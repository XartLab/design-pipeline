"use strict";

// Replicate mode for ui and web (OpenSpec change replicate-extract-first): the reference is extracted
// into a draft DESIGN.md and MOTION.md (and, at standard and full, the design-system package) before
// anything is built, `next` runs the existing foundation and reference checks itself, and the owner
// confirms what is borrowed. The confirmation stores the hashes of what it judged; the web description
// approval, the web probe and delivery, and the ui delivery and review bind to them, so a later edit
// reopens the confirmation instead of drifting past it. No new gate or receipt: this reuses
// `foundation check`, `reference check`, the decision history and the evaluate-website-clone verdict.
const fs = require("node:fs");
const path = require("node:path");
const { fail, readJson, sha256 } = require("../contract-utils.cjs");
const { checkInteractionStateCoverage, STATE_COVERAGE_SCHEMA } = require("../gate-core.cjs");
const { checkDesignFoundation } = require("../design-synthesis-core.cjs");
const { checkMotionFoundation } = require("../motion-foundation-core.cjs");
const { DEFAULT_DIR: DESIGN_SYSTEM_DIR, checkDesignSystemPackage } = require("../design-system-package-core.cjs");
const { checkReferenceEvidence } = require("../reference-evidence-core.cjs");
const { cliCommand, shellPath, exists, reference, reason } = require("./shared.cjs");
const { addRule } = require("./rules.cjs");

const EVIDENCE = "reference-evidence.json";
// What a confirmation judges and what later stages bind to.
const BOUND = ["DESIGN.md", "MOTION.md", "reference.md", EVIDENCE];
// A reference check that is only waiting for the graybox, the geometry or a pending source is
// work-stage business; these block leaving the extract step.
const EXTRACT_BLOCKERS = ["approval-pending", "approval-rejected", "video-analysis-incomplete"];
const GUIDES = ["references/reference-spec.md", "references/design-synthesis.md", "references/design-system-package.md"];
const PREVIEWS = path.join(".design-pipeline", "design-system", "previews");
const MANIFEST = "website-cloning.json";
const CLONE_ROOTS = [["openspec", "changes"], [".openspec", "changes"], ["spec", "changes"], ["docs", "design"], ["design", "changes"]];

const fileHash = (root, rel) => {
  try { return "sha256:" + sha256(fs.readFileSync(path.join(root, rel))); } catch { return null; }
};
const attempt = check => {
  try { return { result: check() }; } catch (error) { return { error: String(error?.message ?? error) }; }
};
const decideBase = root => `${cliCommand()} decide --root ${shellPath(path.resolve(root))} --project-root ${shellPath(path.resolve(root))} --stage extract`;

// --- the reference stage: web-appropriate, not the film one -----------------------------------------

const REFERENCE = reference("Register the page or screenshot you are reproducing as evidence, then record what you observed in it.", {
  guides: ["references/feature-routes.md"],
  exclusive: true,
  work: `Keep the reference (a screenshot, or a capture of the page) inside the project. Write reference-evidence.json (schema design-pipeline.reference-evidence.v2, intent.role primary-target, source kind image or live-page, requiredArtifacts including graybox.png; references/reference-spec.md and the Static Reference Reconstruction steps in references/feature-routes.md) and reference.md with the observed structure, layout rhythm, type scale, colour, motion parameters, invariants and uncertainties. Do not build yet: the next step extracts DESIGN.md and MOTION.md from this evidence.`,
});

// --- what `next` checks before the replicate flow leaves the extract step ---------------------------

// The text of DESIGN.md's Source Decisions section, or null.
function sourceDecisions(text) {
  const heading = /^##\s+(?:source decisions|evidence and adaptation)\s*$/im.exec(text);
  if (!heading) return null;
  const rest = text.slice(heading.index + heading[0].length);
  const next = /^##\s+/m.exec(rest);
  return (next ? rest.slice(0, next.index) : rest).trim();
}

// What replicate never borrows, each named on a rejected / not-borrowed line (or the list under it),
// so "Adopted brand colours" never counts as rejecting the brand.
const PROTECTED = [["content", /\bcontent\b|内容/i], ["copy", /\bcopy\b|\bwording\b|文案/i], ["brand marks", /\bbrand\b|品牌/i], ["logos", /\blogos?\b|标志|徽标/i]];
const REJECTED = /\breject|\bnot borrow|\bdo not borrow|\bnot adopt|\bexclude|不借用|不采用|不沿用|排除|拒绝/i;
const ADOPTED = /\badopt|\bborrow(?!ed\b)|借用|采用|沿用/i;
function unborrowedMissing(section) {
  const kept = [];
  let mode = null; // "heading": a rejected sub-heading, until the next heading · "line": a rejected line and the list under it
  for (const line of section.split(/\r?\n/)) {
    const heading = /^\s*#{2,6}\s/.test(line);
    if (heading) { mode = REJECTED.test(line) ? "heading" : null; continue; }
    if (mode === "heading") { kept.push(line); continue; }
    if (REJECTED.test(line)) { mode = "line"; kept.push(line); continue; }
    if (mode === "line" && /^\s*(?:[-*+]|\d+\.)\s/.test(line) && !ADOPTED.test(line)) { kept.push(line); continue; }
    if (line.trim()) mode = null;
  }
  const rejected = kept.join("\n");
  return PROTECTED.filter(([, pattern]) => !pattern.test(rejected)).map(([name]) => name);
}

// Group sizes of the DESIGN.md front matter (colors: 8, typography: 6, ...), for the owner's summary.
function tokenSummary(text) {
  const front = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text)?.[1] ?? "";
  const groups = {};
  let group = null, indent = null;
  for (const line of front.split(/\r?\n/)) {
    const top = /^([A-Za-z][\w-]*):\s*$/.exec(line);
    if (top) { group = top[1]; groups[group] = 0; indent = null; continue; }
    const child = group && /^( +)[^\s#-][^:]*:/.exec(line);
    if (!child) continue;
    indent ??= child[1].length;
    if (child[1].length === indent) groups[group] += 1;
  }
  return groups;
}

// Everything still missing, each with its fix: the existing reference check, DESIGN.md and MOTION.md
// foundation checks, and at standard and full the design-system package (kind all, as `foundation check`).
function findings(state, root) {
  const project = path.resolve(root);
  const out = [];
  const add = (code, message, fix) => out.push({ code, severity: "error", message, fix });
  if (!exists(root, EVIDENCE)) {
    add("reference-evidence-missing", `${EVIDENCE} does not exist: the reference is not registered as evidence.`, `Write ${EVIDENCE} (schema design-pipeline.reference-evidence.v2, intent.role primary-target; references/reference-spec.md), then run ${cliCommand()} reference check --root ${shellPath(project)} --project-root ${shellPath(project)}.`);
  } else {
    const check = attempt(() => checkReferenceEvidence(project));
    if (check.error) add("reference-evidence-invalid", `${EVIDENCE} is invalid: ${check.error}`, `Repair ${EVIDENCE} to the v2 shape in references/reference-spec.md, then run next again.`);
    else if (EXTRACT_BLOCKERS.includes(check.result.reason)) add(`reference-${check.result.reason}`, `reference check is blocked (${check.result.reason}): ${check.result.blockers.join("; ")}`, check.result.reason === "video-analysis-incomplete" ? "Finish the video observations (the reference step lists the missing window), then run next again." : "Record the reference approval (approval.status approved, with the evidence of what the owner said) in the reference evidence, then run next again.");
  }
  const design = attempt(() => checkDesignFoundation({ projectRoot: project }));
  if (design.error) add("design-invalid", `DESIGN.md is invalid: ${design.error}`, "Repair DESIGN.md to the Google DESIGN.md format (references/design-synthesis.md), then run next again.");
  else if (design.result.status !== "ready") add("design-missing", "DESIGN.md does not exist.", `Write the draft DESIGN.md from the reference: ${design.result.nextCommand}`);
  else {
    // The borrowed list is the Source Decisions section; replicate also names what is never borrowed.
    const section = sourceDecisions(fs.readFileSync(path.join(project, "DESIGN.md"), "utf8")) ?? "";
    const missing = unborrowedMissing(section);
    if (missing.length) add("design-source-decisions-incomplete", `DESIGN.md Source Decisions does not reject the reference's ${missing.join(", ")}.`, "In Source Decisions list what is adopted (structure, layout rhythm, type scale, colour, motion parameters) and, under a rejected / not borrowed line, the reference's content, copy, brand marks and logos, then run next again.");
  }
  const motion = attempt(() => checkMotionFoundation({ projectRoot: project }));
  if (motion.error) add("motion-invalid", `MOTION.md is invalid: ${motion.error}`, "Repair MOTION.md (references/motion-foundation.md), then run next again.");
  else if (motion.result.status !== "ready") add("motion-missing", "MOTION.md does not exist.", `${motion.result.nextAction}, taking the reference's motion parameters (or a static posture when it has none).`);
  if (state.tier !== "quick" || exists(root, path.join(DESIGN_SYSTEM_DIR, "tokens.json"))) {
    const system = attempt(() => checkDesignSystemPackage({ projectRoot: project }));
    if (system.error) add("design-system-invalid", `The design-system package is invalid: ${system.error}`, "Repair the package (references/design-system-package.md), then run next again.");
    else if (system.result.status !== "ready") add(system.result.status === "synthesis-required" ? "design-system-missing" : "design-system-invalid", `The design-system package is ${system.result.status}: ${(system.result.findings || []).map(item => `${item.file}: ${item.message}`).join("; ")}`, `Write or repair the package from the reference (references/design-system-package.md), then run ${cliCommand()} design-system check --project-root ${shellPath(project)}.`);
  }
  if (["web", "ui"].includes(state.deliverable)) {
    const recorded = recordedBehaviours(root);
    if (recorded?.rowErrors?.length) {
      for (const item of recorded.rowErrors) {
        const message = item.id ? `Recorded behaviour ${item.id}: ${item.message}` : item.message;
        add("recorded-behaviours-missing", message, item.fix);
      }
    } else if (recorded?.error) {
      add("recorded-behaviours-missing", recorded.error, "Repair reference.md under the exact ## Recorded behaviours heading with the required columns and valid rows.");
    }
  }
  return out;
}


// The table is parsed whenever a recorded behaviour is consumed; ids never live in workflow state.
function recordedBehaviours(root) {
  let reference;
  try { reference = readJson(path.join(root, EVIDENCE), "reference evidence"); } catch { return null; }
  if (reference.source?.kind !== "video") return null;
  try {
    const documentLines = fs.readFileSync(path.join(root, "reference.md"), "utf8").split(/\r?\n/);
    const heading = documentLines.findIndex(line => line === "## Recorded behaviours");
    if (heading < 0) return { error: "reference.md must contain a non-empty ## Recorded behaviours table with id, time, change, control and keyboard columns." };
    let end = heading + 1;
    while (end < documentLines.length && !documentLines[end].startsWith("## ")) end++;
    const lines = documentLines.slice(heading + 1, end).filter(line => line.trim().startsWith("|"));
    const cells = line => line.trim().replace(/^\|\s*|\s*\|$/g, "").split("|").map(value => value.trim());
    if (lines.length < 3) return { error: "## Recorded behaviours must contain a header, Markdown separator and at least one data row." };
    const columns = ["id", "time", "change", "control", "keyboard"];
    const header = cells(lines[0]);
    if (header.length !== columns.length || columns.some((column, index) => header[index] !== column)) return { error: "## Recorded behaviours columns must be id, time, change, control and keyboard, in that order." };
    const separator = cells(lines[1]);
    if (separator.length !== columns.length || separator.some(cell => !/^:?-{3,}:?$/.test(cell))) return { error: "## Recorded behaviours must contain a valid Markdown separator row." };
    const ids = [], rowErrors = [];
    for (const line of lines.slice(2)) {
      const row = cells(line), rawId = row[0] || "";
      const id = /^rb-[0-9]+$/.test(rawId) ? rawId : null;
      if (row.length !== columns.length) {
        rowErrors.push({ id, message: `row has ${row.length} cells; expected five`, fix: "Give this row exactly five cells: id, time, change, control, keyboard." });
        continue;
      }
      const [candidate, time, change, control, keyboard] = row;
      if (!/^rb-[0-9]+$/.test(candidate)) rowErrors.push({ id: null, message: `id ${candidate || "(empty)"} must match rb-[0-9]+`, fix: "Use a unique id such as rb-1." });
      else if (ids.includes(candidate)) rowErrors.push({ id: candidate, message: "id is duplicated", fix: "Give each observed behavior a unique rb-<number> id." });
      else ids.push(candidate);
      if (!time || !change) rowErrors.push({ id, message: "time and change must be non-empty", fix: "Record when the behavior occurs and what changes on screen." });
      if (!control || !keyboard || /^none\s*$/i.test(keyboard) || /^none\s*:\s*$/i.test(keyboard)) rowErrors.push({ id, message: "requires a real control and keyboard path; keyboard: none: <reason> is allowed only with a non-empty reason", fix: "Name the control role and element plus keyboard path; use none: <reason> only for owner-confirmed no-input behavior." });
    }
    if (rowErrors.length) return { ids, rowErrors, error: rowErrors.map(item => `${item.id ? `Recorded behaviour ${item.id}: ` : ""}${item.message}`).join("; ") };
    return { ids };
  } catch (error) {
    return { error: String(error?.message ?? error) };
  }
}



function checkRecordedBehaviourDelivery(state, root) {
  if (state.mode !== "replicate" || !["web", "ui"].includes(state.deliverable)) return null;
  let reference;
  try { reference = readJson(path.join(root, EVIDENCE), "reference evidence"); } catch { return null; }
  if (reference.source?.kind !== "video") return null;
  const recorded = recordedBehaviours(root);
  if (recorded?.error) return { code: "recorded-behaviours-missing", error: recorded.error, fix: "Add the exact ## Recorded behaviours heading and a Markdown table with id, time, change, control and keyboard columns; fix every row, then retry delivery." };
  if (recorded?.rowErrors?.length) {
    const first = recorded.rowErrors[0];
    return { code: "recorded-behaviours-missing", error: recorded.rowErrors.map(item => `${item.id ? `${item.id}: ` : ""}${item.message}`).join("; "), fix: first.fix };
  }
  try {
    const matrix = readJson(path.join(root, "component-state-matrix.json"), "component state matrix");
    if (matrix.schema !== STATE_COVERAGE_SCHEMA) return { code: "RECORDED_BEHAVIOUR_UNCOVERED", error: "component-state-matrix.json does not use the interaction-state coverage schema.", fix: "Use the existing interaction-state coverage schema in component-state-matrix.json and retry delivery." };
    const result = checkInteractionStateCoverage(matrix, { recordedBehaviours: recorded.ids });
    if (result.status === "passed") return null;
    const blocker = result.blockers.find(item => item.code === "RECORDED_BEHAVIOUR_UNKNOWN") || result.blockers.find(item => item.code === "RECORDED_BEHAVIOUR_UNCOVERED") || result.blockers[0];
    return { code: blocker.code, error: result.blockers.map(item => item.message).join("; "), fix: "Map each listed behaviour id to a passing entry in component-state-matrix.json; remove unknown ids, then retry delivery." };
  } catch (error) {
    return { code: "RECORDED_BEHAVIOUR_UNCOVERED", error: String(error?.message ?? error), fix: "Repair component-state-matrix.json using the existing interaction-state matrix contract, then retry delivery." };
  }
}
// --- the confirmation ------------------------------------------------------------------------------

const extractions = state => (Array.isArray(state.decisions?.extractions) ? state.decisions.extractions : []);
const currentInputs = root => Object.fromEntries(BOUND.map(rel => [rel, fileHash(root, rel)]));
const changedFiles = (was, now) => BOUND.filter(rel => (was?.[rel] ?? null) !== (now[rel] ?? null));

const extractFinished = (state, root) => {
  const latest = extractions(state).at(-1);
  return latest?.verdict === "accept" && !changedFiles(latest.inputs, currentInputs(root)).length && !findings(state, root).length;
};

function previews(root) {
  const dir = path.join(path.resolve(root), PREVIEWS);
  if (!fs.existsSync(dir)) return [];
  const names = fs.readdirSync(dir).filter(name => name.endsWith(".html")).sort((a, b) => (a === "Cover.html" ? -1 : b === "Cover.html" ? 1 : a.localeCompare(b)));
  return names.map(name => path.join(dir, name));
}

const EXTRACT = {
  id: "extract",
  finished: extractFinished,
  action: (state, root) => {
    const project = path.resolve(root);
    const missing = findings(state, root);
    const web = state.deliverable === "web";
    if (missing.length) {
      // A live page is measured before it is judged (OpenSpec change reference-palette-extract).
      const measure = `${cliCommand()} reference extract --root ${shellPath(project)} --url <page url> --output reference/extract`;
      const clone = web ? ` If the reference is a live page, also initialize its website-clone change: node ${shellPath(path.resolve(__dirname, "..", "init-website-clone.cjs"))} --change-id <id> --url <page url> --project-root ${shellPath(project)} (it writes website-cloning.json with the protected invariants and allowed differences; next then consults the evaluator's verdict at probe and delivery; references/website-cloning.md).` : "";
      return {
        type: "run",
        instruction: `Extract the reference into a draft design foundation before anything is built: DESIGN.md (the Google format; Source Decisions lists what you borrow as adopted, such as structure, layout rhythm, type scale, colour and motion parameters, and what you do not as rejected: the reference's content, copy, brand marks and logos)${state.tier === "quick" ? " and MOTION.md" : `, MOTION.md and the design-system package (${DESIGN_SYSTEM_DIR}/, then ${cliCommand()} design-system compile --project-root ${shellPath(project)} so the owner can see its previews)`}. If the reference is a live page, run ${measure} first: it measures the palette (tiers by share), type scale and spacing from computed styles, with no model, into extraction.json, palette-evidence.json and design-md-draft.md; then judge that draft against the reference and copy into DESIGN.md only what you adopt, never a "(low confidence)" value. A challenge or block page (REFERENCE_BLOCKED), an HTTP error (REFERENCE_HTTP_STATUS) or a page that renders nothing (REFERENCE_EMPTY) is refused; use a screenshot as an image reference then. Still missing: ${missing.map((item, index) => `(${index + 1}) ${item.message} Fix: ${item.fix}`).join(" ")}${clone} next re-runs these checks itself; the owner confirms the extraction once they pass.`,
        findings: missing,
        command: `${cliCommand()} foundation check --root ${shellPath(project)} --project-root ${shellPath(project)} --kind all`,
        measure,
        guides: GUIDES,
        why: "The reference is extracted into DESIGN.md and MOTION.md first; the build follows them, not a template.",
      };
    }
    const latest = extractions(state).at(-1);
    const now = currentInputs(root);
    if (latest?.verdict === "reject" && !changedFiles(latest.inputs, now).length) {
      return {
        type: "run",
        instruction: `The owner rejected this extraction ("${latest.reason}"); it is now a rule. Revise DESIGN.md, MOTION.md and the design-system package for it, then run next again.`,
        guides: GUIDES,
        why: "Nothing is built from an extraction the owner has not confirmed.",
      };
    }
    const design = fs.readFileSync(path.join(project, "DESIGN.md"), "utf8");
    const stale = latest?.verdict === "accept" ? changedFiles(latest.inputs, now) : [];
    return {
      type: "ask",
      ...(stale.length ? { first: `The owner confirmed an extraction at ${latest.at}, but ${stale.join(", ")} changed since; show them the current one and ask again:` } : latest?.verdict === "reject" ? { first: `The owner rejected the earlier extraction ("${latest.reason}"); it changed since. Show them the revision and ask again:` } : {}),
      question: "Here is what I extracted from the reference: the design tokens, the motion language, and what is borrowed and what is not. Confirm it, or tell me what to change?",
      show: [...["DESIGN.md", "MOTION.md", "reference.md"].map(rel => path.join(project, rel)), ...previews(root)],
      tokens: tokenSummary(design),
      borrowed: sourceDecisions(design),
      recommended: "Confirm only when the borrowed list is what you want carried over and the not-borrowed list keeps the reference's content and brand out; the tokens and previews are a draft to correct now, not later.",
      instruction: "Show the design-system cover and previews when `show` lists them, summarise `tokens`, and read out `borrowed` (the Source Decisions section) as two lists: what is borrowed and what is not. Record only the owner's own words.",
      record: `${decideBase(root)} --verdict accept --answer "<the owner's words confirming the extraction>"`,
      correction: `${decideBase(root)} --verdict reject --answer "<what to change, in the owner's words>"`,
      why: "The extraction fixes what the build reproduces; the confirmation binds DESIGN.md, MOTION.md, reference.md and the reference evidence, so a later edit asks again.",
    };
  },
};

// Records the owner's verdict on the extraction `next` asked about. Returns nothing; a refused call changes nothing.
function recordExtraction(state, root, options) {
  if (!["accept", "reject"].includes(options.verdict)) fail("workflow", "--verdict accept|reject is required for the extraction");
  const words = reason(options.answer, options.verdict === "accept" ? "quote the owner's words confirming the extraction; record only words they gave" : "say in one sentence what the owner wants changed; it becomes a rule");
  if (/<[^<>]*>/.test(words)) fail("workflow", "--answer still holds the placeholder. Fix: replace it with the owner's own words from the conversation");
  const at = new Date().toISOString();
  const history = extractions(state);
  state.decisions.extractions = [...history, { verdict: options.verdict, inputs: currentInputs(root), ...(options.verdict === "reject" ? { reason: words } : { note: words }), at }];
  if (options.verdict === "reject") addRule(state, words, `extraction ${history.filter(item => item.verdict === "reject").length + 1}`, { stage: "extract" });
}

// The reference files a web probe pass also binds in replicate mode (DESIGN.md and MOTION.md are
// already bound by the interaction lineage).
const boundReferenceFiles = (state, root) => (state.mode === "replicate" ? ["reference.md", EVIDENCE].filter(rel => exists(root, rel)) : []);

// --- website-clone fidelity, consulted at probe and delivery ----------------------------------------

// Every website-cloning.json of the project, at its root or in a change directory beside it.
function findManifests(root) {
  const project = path.resolve(root);
  const dirs = [project];
  for (const parts of CLONE_ROOTS) {
    const base = path.join(project, ...parts);
    if (fs.existsSync(base) && fs.statSync(base).isDirectory()) dirs.push(...fs.readdirSync(base).filter(name => name !== "archive").map(name => path.join(base, name)));
  }
  return dirs.filter(dir => fs.existsSync(path.join(dir, MANIFEST)));
}

// null when the project has no clone manifest; else the evaluator's last verdict as the manifest records it.
function cloneFidelity(state, root) {
  if (state.deliverable !== "web" || state.mode !== "replicate") return null;
  const dirs = findManifests(root);
  if (!dirs.length) return null;
  // Two live clone changes: never judge this page by whichever directory is listed first.
  if (dirs.length > 1) return { ambiguous: true, dirs, complete: false };
  const [dir] = dirs;
  const read = attempt(() => readJson(path.join(dir, MANIFEST), "website-cloning manifest"));
  const manifest = read.result ?? {};
  // The verdict judged the page as it was then: a later interaction pass (any page or reference edit
  // forces one, its inputs being hash-bound) means the evaluator has not seen the current page.
  const evaluated = Date.parse(manifest.verification?.evaluatedAt ?? "");
  const checkedAt = state.gates?.interaction?.status === "passed" ? state.gates.interaction.at : 0;
  const fresh = Number.isFinite(evaluated) && evaluated >= checkedAt;
  return {
    dir,
    complete: manifest.status === "complete" && manifest.verification?.status === "passed" && fresh,
    status: read.error ? "unreadable" : manifest.status === "complete" && !fresh ? "complete but evaluated before the latest page check, so the page it judged is not the current one" : manifest.status ?? "unknown",
    reasons: read.error ? [read.error] : manifest.verification?.reasons ?? [],
    protectedInvariants: manifest.implementationAuthority?.protectedInvariants ?? [],
    allowedDifferences: manifest.implementationAuthority?.allowedDifferences ?? [],
  };
}

const cloneComplete = (state, root) => cloneFidelity(state, root)?.complete ?? true;

function cloneAction(state, root) {
  const clone = cloneFidelity(state, root);
  const rel = dir => path.relative(path.resolve(root), dir).split(path.sep).join("/") || ".";
  if (clone.ambiguous) {
    return {
      type: "blocked",
      blocker: `More than one website-clone manifest: ${clone.dirs.map(rel).join(", ")}.`,
      instruction: "Keep only the clone change for this page (archive the others under their changes directory's archive/), then run next again.",
      why: "The fidelity verdict must come from this page's own clone change.",
    };
  }
  const where = path.relative(path.resolve(root), clone.dir).split(path.sep).join("/") || ".";
  return {
    type: "run",
    instruction: `The website-clone manifest in ${where} reports ${clone.status}${clone.reasons.length ? `: ${clone.reasons.join("; ")}` : ""}. Produce the EvidencePort report for the built page (references/website-cloning.md), then run the evaluator; it is the only path that may move the manifest to complete. Protected invariants: ${clone.protectedInvariants.join("; ") || "none declared"}. Allowed differences: ${clone.allowedDifferences.join("; ") || "none declared"}. Repair the page or the evidence for each reason, rerun the evaluator, then run next again.`,
    command: `node ${shellPath(path.resolve(__dirname, "..", "evaluate-website-clone.cjs"))} --change-root ${shellPath(clone.dir)} --evidence <report>`,
    guide: "references/website-cloning.md",
    why: "A replicated page passes the clone fidelity verdict (protected invariants, allowed differences) before it is checked and delivered.",
  };
}

module.exports = { EXTRACT, REFERENCE, boundReferenceFiles, checkRecordedBehaviourDelivery, cloneAction, cloneComplete, recordedBehaviours, recordExtraction, sourceDecisions, tokenSummary };
