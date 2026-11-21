"use strict";

const { assertEnum, assertObject, canonicalJson, fail, isObject, sha256, wordCount } = require("./contract-utils.cjs");
const { CATALOG_SCHEMA, validateCatalog } = require("./design-system-catalog-core.cjs");
const { validateTokens } = require("./interoperability-core.cjs");

const DECISION_SCHEMA = "design-pipeline.design-system-decision.v1";
const DECISION_FILE = "design-system-decision.json";
const PROJECTION_SCHEMA = "design-pipeline.design-system-token-projection.v1";
const MODES = ["reference", "adopt", "substitute", "custom"];
const STATUSES = ["stable", "canary", "beta", "experimental", "deprecated", "unknown"];
const TYPES = new Set(["color", "dimension", "fontFamily", "fontWeight", "duration", "cubicBezier", "number", "strokeStyle", "border", "transition", "shadow", "gradient", "typography"]);
const AUTHORIZED_BY = ["owner", "agent"];
const DELEGATION_SOURCES = ["workflow-state", "owner-instruction"];
const DELEGATION_MIN_WORDS = 6;

function semanticName(name) {
  return name.replace(/^--/, "").replace(/[^A-Za-z0-9_-]+/g, ".").replace(/[-_]+/g, ".").replace(/^\.+|\.+$/g, "");
}

// Hex, CSS color functions, the two keywords, or an alias to a `--color-*` token.
function isColorValue(value) {
  if (typeof value !== "string") return false;
  const text = value.trim();
  return /^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(text)
    || /^(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color|color-mix|light-dark)\(.*\)$/i.test(text)
    || /^(?:transparent|currentcolor)$/i.test(text)
    || /^var\(--color-[A-Za-z0-9-]+\)$/.test(text);
}

function inferType(role, value) {
  const name = role.toLowerCase().replace(/[._]+/g, "-");
  if (name.startsWith("color-") || name === "color") return "color";
  // A `-color` name elsewhere (for example `focus-outline-color`) is a color only when its value is one.
  if (name.endsWith("-color") && isColorValue(value)) return "color";
  if (/(?:^|-)(?:border|outline)(?:-[a-z]+)*-style$/.test(name) && /^(?:solid|dashed|dotted|double|groove|ridge|outset|inset)$/.test(String(value))) return "strokeStyle";
  if (name.startsWith("shadow-") || name === "shadow") return "shadow";
  if (name.startsWith("duration-") || name === "duration") return "duration";
  if (name.startsWith("ease-") || name.startsWith("easing-")) return "cubicBezier";
  if (name.startsWith("opacity-") || name === "opacity") return "number";
  if (name.startsWith("font-family-")) return "fontFamily";
  if (name.startsWith("font-weight-") || (name.startsWith("text-") && name.endsWith("-weight"))) return "fontWeight";
  if (name.startsWith("font-size-") || (name.startsWith("text-") && name.endsWith("-size"))) return "dimension";
  if ((name.startsWith("text-") && name.endsWith("-leading")) || name.startsWith("font-line-height-")) return "number";
  if (/^(?:spacing|size|radius|border-width)(?:-|$)/.test(name)) return "dimension";
  if (name.startsWith("gradient-") || name === "gradient") return "gradient";
  if (name.startsWith("transition-") || name === "transition") return "transition";
  if (typeof value === "number") return "number";
  if (typeof value === "string" && (/^#|^(?:rgb|hsl|oklch|lab)\(/i.test(value))) return "color";
  if (typeof value === "string" && /^-?(?:\d*\.)?\d+(?:px|rem|em|vh|vw|%)$/i.test(value)) return "dimension";
  if (typeof value === "string" && /^-?(?:\d*\.)?\d+(?:ms|s)$/i.test(value)) return "duration";
  return null;
}

function addToken(root, name, token, losses) {
  const parts = semanticName(name).split(".").filter(Boolean);
  if (!parts.length) fail("token projection", `invalid token name ${name}`);
  const group = parts.length === 1 ? null : parts[0];
  const leaf = parts.length === 1 ? parts[0] : parts.slice(1).join("-");
  if (group !== null && Object.hasOwn(root, group) && Object.hasOwn(root[group], "$value")) {
    losses.push({ severity: "blocked", code: "path-collision", path: name, message: "token group collides with a token" });
    return;
  }
  const parent = group === null ? root : (root[group] ||= {});
  if (Object.hasOwn(parent, leaf)) {
    losses.push({ severity: "blocked", code: "path-collision", path: name, message: "normalized token path is not unique" });
    return;
  }
  parent[leaf] = token;
}

function projectDesignSystemTokens(catalog) {
  validateCatalog(catalog);
  const tokenEntry = catalog.entries.slice().sort((a, b) => a.id.localeCompare(b.id)).find((entry) => entry.theme?.tokens || entry.tokens);
  const source = tokenEntry?.theme?.tokens ?? tokenEntry?.tokens;
  if (!isObject(source) || !Object.keys(source).length) fail("token projection", "catalog entry theme.tokens or tokens must be a non-empty object");
  const projected = {};
  const losses = [];
  for (const name of Object.keys(source).sort()) {
    const raw = source[name];
    let value = raw;
    let type;
    let role = semanticName(name);
    let modes;
    if (Array.isArray(raw)) {
      if (raw.length !== 2 || raw.some((item) => typeof item !== "string" && typeof item !== "number")) fail("token projection", `${name} must be a [light, dark] tuple`);
      [value] = raw;
      modes = { light: raw[0], dark: raw[1] };
    } else if (isObject(raw)) {
      const allowed = ["value", "type", "role"];
      const extras = Object.keys(raw).filter((key) => !allowed.includes(key));
      if (extras.length || !Object.hasOwn(raw, "value")) fail("token projection", `${name} has unsupported token properties`);
      value = raw.value;
      type = raw.type;
      role = raw.role || role;
      if (Array.isArray(value)) {
        if (value.length !== 2 || value.some((item) => typeof item !== "string" && typeof item !== "number")) fail("token projection", `${name}.value must be a [light, dark] tuple`);
        modes = { light: value[0], dark: value[1] };
        [value] = value;
      }
    }
    if (typeof value !== "string" && (typeof value !== "number" || !Number.isFinite(value))) fail("token projection", `${name} has an invalid value`);
    if (type !== undefined && !TYPES.has(type)) fail("token projection", `${name}.type has invalid value ${String(type)}`);
    type ||= inferType(role, value);
    if (!type) {
      type = "number";
      losses.push({ severity: "review", code: "type-unresolved", path: name, message: "source token type cannot be inferred without semantic interpretation" });
    }
    const extension = { role };
    if (modes) extension.modes = modes;
    extension.sourceName = name;
    addToken(projected, name, { $type: type, $value: value, $extensions: { "design-pipeline": extension } }, losses);
  }
  const blocked = losses.some((loss) => loss.severity === "blocked");
  const tokens = {
    schema: "design-pipeline.design-tokens.v1",
    dtcgProfile: "2025.10",
    provenance: {
      source: tokenEntry.provenance.source,
      sha256: sha256(canonicalJson(source)),
      license: tokenEntry.provenance.license,
    },
    tokens: projected,
  };
  if (!blocked) validateTokens(tokens);
  return { schema: PROJECTION_SCHEMA, status: blocked ? "blocked" : losses.length ? "review" : "ready", tokens, losses };
}

function parseVersion(value, label) {
  const match = String(value || "").trim().match(/^v?(\d+)(?:\.(\d+))?(?:\.(\d+))?(?:-[0-9A-Za-z.-]+)?$/);
  if (!match) fail("design system decision", `${label} is not a supported semantic version`);
  return [Number(match[1]), Number(match[2] || 0), Number(match[3] || 0)];
}

function compareVersion(left, right) {
  for (let index = 0; index < 3; index += 1) if (left[index] !== right[index]) return left[index] < right[index] ? -1 : 1;
  return 0;
}

function satisfiesVersion(actualValue, constraintValue, label) {
  const actual = parseVersion(actualValue, `${label} installed version`);
  const constraint = String(constraintValue).trim();
  if (constraint.startsWith(">=")) return compareVersion(actual, parseVersion(constraint.slice(2), `${label} constraint`)) >= 0;
  if (constraint.startsWith("^")) {
    const lower = parseVersion(constraint.slice(1), `${label} constraint`);
    const upper = lower[0] > 0 ? [lower[0] + 1, 0, 0] : lower[1] > 0 ? [0, lower[1] + 1, 0] : [0, 0, lower[2] + 1];
    return compareVersion(actual, lower) >= 0 && compareVersion(actual, upper) < 0;
  }
  return compareVersion(actual, parseVersion(constraint, `${label} constraint`)) === 0;
}

function runtimeOf(value) {
  const runtime = value?.runtime || value?.content?.runtime || {};
  return {
    react: runtime.react,
    reactDom: runtime.reactDom || runtime["react-dom"],
    stylex: runtime.stylex || runtime["@stylexjs/stylex"],
  };
}

function incompatibilities(project, candidate) {
  const expected = runtimeOf(candidate);
  const actual = runtimeOf(project);
  const issues = [];
  for (const key of ["react", "reactDom", "stylex"]) {
    if (expected[key] && (!actual[key] || !satisfiesVersion(actual[key], expected[key], key))) issues.push(`${key}:${actual[key] || "missing"}!~${expected[key]}`);
  }
  if (actual.react && actual.reactDom && parseVersion(actual.react, "react installed version")[0] !== parseVersion(actual.reactDom, "react-dom installed version")[0]) issues.push("react:react-dom-major-mismatch");
  return issues;
}

function existingSystem(project) {
  const value = project?.designSystem || project?.existingDesignSystem;
  if (value) return typeof value === "string" ? { id: value, source: "project" } : { ...value, source: value.source || "project" };
  if (project?.designMd || project?.DESIGN) return { id: "project-design", source: "DESIGN.md" };
  return null;
}

function validateFrontendStackDecision(value) {
  if (!isObject(value) || value.schema !== "design-pipeline.frontend-stack-decision.v1") return false;
  if (value.status !== "ready" || !/^[a-f0-9]{64}$/.test(value.registryHash || "")) return false;
  return isObject(value.selected) && isObject(value.selected.styling) && isObject(value.selected.uiLibrary) && Array.isArray(value.toolRoutes);
}

function validateCapabilityInventory(value) {
  assertObject(value, "capabilityInventory", "design system decision");
  if (!Array.isArray(value.searchedCapabilities)) fail("design system decision", "capabilityInventory.searchedCapabilities must be an array");
  if (typeof value.directQuery !== "string" || !value.directQuery.trim()) fail("design system decision", "capabilityInventory.directQuery must be a non-empty string");
  if (!Number.isInteger(value.directQueryResults) || value.directQueryResults < 0) fail("design system decision", "capabilityInventory.directQueryResults must be a non-negative integer");
  if (!isObject(value.capabilityResults)) fail("design system decision", "capabilityInventory.capabilityResults must be an object");
}

function decideDesignSystemCore(request, compared) {
  assertObject(request, "request", "design system decision");
  if (request.schema !== undefined && request.schema !== "design-pipeline.design-system-decision-request.v1") fail("design system decision", "unsupported request schema");
  if (request.version !== undefined && request.version !== "1") fail("design system decision", "unsupported request version");
  assertEnum(request.mode, MODES, "mode", "design system decision");
  // An explicit owner scratch choice is not a fallback: it needs no catalog and no catalog search.
  const ownerScratch = request.authorization?.by === "owner" && request.authorization?.scratch === true;
  if (!(request.mode === "custom" && ownerScratch)) validateCatalog(request.catalog);
  if (request.allowCanary !== undefined && typeof request.allowCanary !== "boolean") fail("design system decision", "allowCanary must be boolean");
  const evidence = [];
  const rationale = [];
  const rejected = [];
  const existing = existingSystem(request.project);
  const projectAuthority = existing;
  if (existing) evidence.push(`project-authority:${existing.source}`);
  if (!validateFrontendStackDecision(request.frontendStackDecision)) {
    rationale.push("A ready frontend-stack decision is required before selecting a design system.");
    return { schema: DECISION_SCHEMA, status: "blocked", mode: request.mode, projectAuthority, selected: null, rejected, rationale, evidence, frontendStackDecision: request.frontendStackDecision || null, capabilityInventory: request.capabilityInventory || null };
  }
  evidence.push(`frontend-stack:${request.frontendStackDecision.registryHash}`);
  if (request.mode !== "custom" && request.capabilityInventory === undefined) {
    rationale.push("Capability inventory is required before selecting a design system. Decompose the brief and search the catalog first.");
    return { schema: DECISION_SCHEMA, status: "blocked", mode: request.mode, projectAuthority, selected: null, rejected, rationale, evidence, frontendStackDecision: request.frontendStackDecision, capabilityInventory: null };
  }
  if (request.capabilityInventory !== undefined) {
    validateCapabilityInventory(request.capabilityInventory);
    const capabilityHits = Object.values(request.capabilityInventory.capabilityResults).reduce((sum, item) => sum + (item?.count || 0), 0);
    if (request.capabilityInventory.directQueryResults === 0 && capabilityHits > 0) evidence.push("zero-result-inconclusive");
    evidence.push(`capability-inventory:${request.capabilityInventory.searchedCapabilities.length}:${capabilityHits}`);
  }
  // Any other custom choice compares the catalog first, so the receipt records what was considered.
  const compareCatalog = !(request.mode === "custom" && ownerScratch);
  const candidates = compareCatalog ? request.catalog.entries.slice().sort((a, b) => a.id.localeCompare(b.id)) : [];
  let selected = null;
  for (const entry of candidates) {
    const entryStatus = entry.status || "stable";
    if (request.candidateId && entry.id !== request.candidateId) {
      rejected.push({ id: entry.id, reason: "not-requested" });
      compared.push({ id: entry.id, status: entryStatus, compatible: null, outcome: "not-compared", reason: "not-requested" });
      continue;
    }
    assertEnum(entryStatus, STATUSES, `${entry.id}.status`, "design system decision");
    if (["deprecated", "unknown"].includes(entryStatus)) {
      if (!selected) rejected.push({ id: entry.id, reason: `status-${entryStatus}` });
      compared.push({ id: entry.id, status: entryStatus, compatible: false, outcome: selected ? "not-selected" : "rejected", reason: `status-${entryStatus}` });
      continue;
    }
    if (["canary", "beta", "experimental"].includes(entryStatus) && !request.allowCanary) {
      if (!selected) rejected.push({ id: entry.id, reason: "prerelease-not-allowed" });
      compared.push({ id: entry.id, status: entryStatus, compatible: null, outcome: selected ? "not-selected" : "rejected", reason: "prerelease-not-allowed" });
      continue;
    }
    const issues = incompatibilities(request.project, entry);
    if (issues.length && request.mode !== "reference") {
      if (!selected) rejected.push({ id: entry.id, reason: "runtime-incompatible", evidence: issues });
      compared.push({ id: entry.id, status: entryStatus, compatible: false, outcome: selected ? "not-selected" : "rejected", reason: "runtime-incompatible" });
      continue;
    }
    if (selected || request.mode === "custom") {
      compared.push({ id: entry.id, status: entryStatus, compatible: issues.length === 0, outcome: "not-selected", reason: selected ? "another candidate was selected" : "custom substrate" });
      continue;
    }
    const sourceHash = entry.hash;
    selected = { id: entry.id, status: entryStatus, sourceHash };
    compared.push({ id: entry.id, status: entryStatus, compatible: true, outcome: "selected" });
    evidence.push(`catalog:${entry.id}@${sourceHash}`);
  }
  if (request.mode === "custom") {
    const custom = existing || { id: request.customId || "project-custom", source: "project" };
    rationale.push("Custom mode keeps the design system project-owned.");
    evidence.push("mode:custom");
    return { schema: DECISION_SCHEMA, status: "ready", mode: request.mode, projectAuthority: custom, selected: custom, rejected, rationale, evidence, frontendStackDecision: request.frontendStackDecision, capabilityInventory: request.capabilityInventory || null };
  }
  if (!selected) {
    rationale.push("No eligible catalog entry satisfies status and runtime constraints.");
    return { schema: DECISION_SCHEMA, status: "blocked", mode: request.mode, projectAuthority, selected: null, rejected, rationale, evidence, frontendStackDecision: request.frontendStackDecision, capabilityInventory: request.capabilityInventory };
  }
  if (["adopt", "substitute"].includes(request.mode)) {
    const intakeStatus = request.adapterIntake?.status;
    if (!["admitted", "admissible"].includes(intakeStatus)) {
      if (intakeStatus !== undefined && !["blocked", "review"].includes(intakeStatus)) fail("design system decision", `unknown adapter intake status ${intakeStatus}`);
      rejected.push({ id: selected.id, reason: "adapter-intake-not-admitted" });
      rationale.push(`${request.mode} requires an admitted adapter intake.`);
      return { schema: DECISION_SCHEMA, status: "blocked", mode: request.mode, projectAuthority, selected: null, rejected, rationale, evidence, frontendStackDecision: request.frontendStackDecision, capabilityInventory: request.capabilityInventory };
    }
    evidence.push(`adapter-intake:${intakeStatus}`);
  }
  if (existing && request.mode === "substitute") rejected.push({ id: existing.id, reason: "explicitly-substituted" });
  if (existing && request.mode !== "substitute") rationale.push("The project system remains the governing authority.");
  rationale.push(request.mode === "reference" ? "Selected as a non-runtime reference." : `Selected for ${request.mode} with compatible runtime constraints.`);
  return { schema: DECISION_SCHEMA, status: "ready", mode: request.mode, projectAuthority, selected, rejected, rationale, evidence, frontendStackDecision: request.frontendStackDecision, capabilityInventory: request.capabilityInventory };
}

// The receipt a change consumes: the same v1 schema, extended in place with the change it belongs
// to, who authorized the substrate choice, and the candidates the decision compared.
function normalizeAuthorization(value) {
  if (!isObject(value)) return null;
  return { by: value.by, scratch: value.scratch === true, delegation: isObject(value.delegation) ? { ...value.delegation } : null };
}

function decideDesignSystem(request) {
  const compared = [];
  const decision = decideDesignSystemCore(request, compared);
  return {
    ...decision,
    changeId: typeof request.changeId === "string" && request.changeId.trim() ? request.changeId : null,
    authorization: normalizeAuthorization(request.authorization),
    compared,
  };
}

function blockedDecision(code, message, extra = {}) {
  return { status: "blocked", code, message, ...extra };
}

// The catalog capabilities the search found that the decision did not take: the unused relevant
// capabilities QA must surface instead of letting them disappear.
function unusedCapabilities(receipt) {
  const inventory = isObject(receipt.capabilityInventory) ? receipt.capabilityInventory : null;
  if (!inventory || !isObject(inventory.capabilityResults)) return [];
  const selected = isObject(receipt.selected) ? receipt.selected.id : null;
  const ids = new Set();
  for (const value of Object.values(inventory.capabilityResults)) {
    for (const id of Array.isArray(value?.matchedIds) ? value.matchedIds : []) {
      if (typeof id === "string" && id !== selected) ids.add(id);
    }
  }
  return [...ids].sort();
}

const DECISION_KEYS = ["schema", "status", "mode", "projectAuthority", "selected", "rejected", "rationale", "evidence", "frontendStackDecision", "capabilityInventory", "changeId", "authorization", "compared"];
const COMPARED_KEYS = ["id", "status", "compatible", "outcome"];
const COMPARED_OUTCOMES = ["selected", "rejected", "not-selected", "not-compared"];

// The receipt shape the v1 schema declares: every field present, no unknown field, the declared types.
function validateDecisionShape(receipt) {
  if (!isObject(receipt)) return "the design-system decision receipt must be an object";
  for (const key of DECISION_KEYS) if (!Object.hasOwn(receipt, key)) return `the design-system decision receipt is missing ${key}`;
  for (const key of Object.keys(receipt)) if (!DECISION_KEYS.includes(key)) return `the design-system decision receipt carries the unknown field ${key}`;
  if (!Array.isArray(receipt.rejected) || receipt.rejected.some((item) => !isObject(item))) return "rejected must be an array of objects";
  for (const key of ["rationale", "evidence"]) {
    if (!Array.isArray(receipt[key]) || receipt[key].some((item) => typeof item !== "string" || !item.trim())) return `${key} must be an array of non-empty strings`;
  }
  for (const key of ["projectAuthority", "selected", "frontendStackDecision", "capabilityInventory"]) {
    if (receipt[key] !== null && !isObject(receipt[key])) return `${key} must be an object or null`;
  }
  if (receipt.changeId !== null && typeof receipt.changeId !== "string") return "changeId must be a string or null";
  if (receipt.authorization !== null) {
    if (!isObject(receipt.authorization)) return "authorization must be an object or null";
    for (const key of ["by", "scratch", "delegation"]) if (!Object.hasOwn(receipt.authorization, key)) return `authorization is missing ${key}`;
    if (!AUTHORIZED_BY.includes(receipt.authorization.by)) return "authorization.by must be owner or agent";
    if (typeof receipt.authorization.scratch !== "boolean") return "authorization.scratch must be a boolean";
    const delegation = receipt.authorization.delegation;
    if (delegation !== null) {
      if (!isObject(delegation)) return "authorization.delegation must be an object or null";
      if (!DELEGATION_SOURCES.includes(delegation.source)) return "authorization.delegation.source must be workflow-state or owner-instruction";
      if (delegation.source === "workflow-state" && !/^[a-f0-9]{64}$/.test(String(delegation.stateSha256 || ""))) return "authorization.delegation.stateSha256 must be SHA-256";
      if (delegation.source === "owner-instruction" && (typeof delegation.quote !== "string" || !delegation.quote.trim())) return "authorization.delegation.quote must be a non-empty string";
    }
  }
  if (!Array.isArray(receipt.compared)) return "compared must be an array of comparison records";
  for (const item of receipt.compared) {
    if (!isObject(item)) return "compared must be an array of comparison records";
    for (const key of COMPARED_KEYS) if (!Object.hasOwn(item, key)) return `a compared record is missing ${key}`;
    if (typeof item.id !== "string" || !item.id.trim()) return "a compared record needs an id";
    if (typeof item.status !== "string" || !item.status.trim()) return "a compared record needs a status";
    if (item.compatible !== null && typeof item.compatible !== "boolean") return "a compared record needs a boolean compatible";
    if (!COMPARED_OUTCOMES.includes(item.outcome)) return "a compared record needs a known outcome";
  }
  return null;
}

// The consumable-decision contract. A receipt is consumable when it is schema-valid and ready, names
// who authorized the substrate choice, and - unless the owner explicitly chose from scratch -
// records the searched capabilities and the compared candidates. It never grants visual acceptance,
// and a reference decision is a reference, not an adopted substrate.
function validateDesignSystemDecision(receipt, options = {}) {
  const shape = validateDecisionShape(receipt);
  if (shape) return blockedDecision("UNSUPPORTED_SCHEMA", shape);
  if (receipt.schema !== DECISION_SCHEMA) return blockedDecision("UNSUPPORTED_SCHEMA", `unsupported design-system decision schema ${String(receipt.schema)}`);
  if (receipt.status !== "ready") return blockedDecision("DECISION_NOT_READY", `the design-system decision is ${String(receipt.status)}, not ready`);
  if (!MODES.includes(receipt.mode)) return blockedDecision("UNSUPPORTED_MODE", `unsupported design-system decision mode ${String(receipt.mode)}`);
  const authorization = isObject(receipt.authorization) ? receipt.authorization : null;
  if (!authorization) return blockedDecision("DECISION_NOT_AUTHORIZED", "the design-system decision records no authorization for the substrate choice");
  if (!AUTHORIZED_BY.includes(authorization.by)) return blockedDecision("DECISION_NOT_AUTHORIZED", "authorization.by must be owner or agent");
  const scratch = authorization.scratch === true;
  if (scratch && authorization.by !== "owner") return blockedDecision("DECISION_NOT_AUTHORIZED", "an agent cannot record an owner scratch choice");
  if (scratch && receipt.mode !== "custom") return blockedDecision("SCRATCH_MODE_MISMATCH", `an owner scratch choice is a custom substrate, not ${receipt.mode}`);
  const delegation = isObject(authorization.delegation) ? authorization.delegation : null;
  if (authorization.by === "owner" && !delegation) {
    return blockedDecision("DELEGATION_MISSING", "an owner-authorized decision must record the owner's instruction or the delegating workflow state");
  }
  if (delegation) {
    if (!DELEGATION_SOURCES.includes(delegation.source)) return blockedDecision("DELEGATION_MISSING", "delegation.source must be workflow-state or owner-instruction");
    if (delegation.source === "owner-instruction") {
      if (typeof delegation.quote !== "string" || wordCount(delegation.quote) < DELEGATION_MIN_WORDS) {
        return blockedDecision("DELEGATION_MISSING", `the owner's quoted instruction needs at least ${DELEGATION_MIN_WORDS} words`);
      }
    } else if (!/^[a-f0-9]{64}$/.test(String(delegation.stateSha256 || ""))) {
      return blockedDecision("DELEGATION_MISSING", "the delegating workflow state needs its sha256");
    }
  }
  const ownerScratch = authorization.by === "owner" && scratch;
  const inventory = isObject(receipt.capabilityInventory) ? receipt.capabilityInventory : null;
  const compared = Array.isArray(receipt.compared) ? receipt.compared : [];
  if (!ownerScratch) {
    if (!inventory) return blockedDecision("CAPABILITY_INVENTORY_MISSING", "the decision must record the searched capabilities before the substrate is chosen");
    const searched = Array.isArray(inventory.searchedCapabilities) ? inventory.searchedCapabilities.filter((item) => typeof item === "string" && item.trim()) : [];
    if (!searched.length) return blockedDecision("CAPABILITY_INVENTORY_MISSING", "the capability inventory records no searched capability");
    const results = isObject(inventory.capabilityResults) ? inventory.capabilityResults : {};
    const hits = Object.values(results).reduce((sum, item) => sum + (Number(item?.count) || 0), 0);
    const evidence = Array.isArray(receipt.evidence) ? receipt.evidence : [];
    if (inventory.directQueryResults === 0 && hits > 0 && !evidence.includes("zero-result-inconclusive")) {
      return blockedDecision("ZERO_RESULT_NOT_MARKED", "a zero-result product query with capability hits must be marked inconclusive");
    }
    if (hits === 0) return blockedDecision("CAPABILITY_SEARCH_EMPTY", "the decision records no capability candidates; only an owner scratch choice may select a substrate without them");
    if (["adopt", "substitute", "custom"].includes(receipt.mode) && !compared.length) {
      return blockedDecision("COMPARISON_MISSING", "the decision records no compared candidates");
    }
    if (authorization.by === "owner" && ["reference", "adopt", "substitute"].includes(receipt.mode) && !compared.length) {
      return blockedDecision("COMPARISON_MISSING", "an owner-authorized substrate choice must record the candidates that were compared");
    }
  }
  if (options.changeId !== undefined && options.changeId !== null && receipt.changeId !== options.changeId) {
    return blockedDecision("DECISION_CHANGE_MISMATCH", `the design-system decision belongs to change ${String(receipt.changeId)}, not ${String(options.changeId)}`);
  }
  return {
    status: "ready",
    code: "READY",
    mode: receipt.mode,
    changeId: receipt.changeId ?? null,
    runtimeSubstrate: receipt.mode === "reference" ? null : (isObject(receipt.selected) ? receipt.selected : null),
    unusedCapabilities: unusedCapabilities(receipt),
    grantsVisualAcceptance: false,
  };
}

module.exports = { CATALOG_SCHEMA, DECISION_SCHEMA, DECISION_FILE, MODES, PROJECTION_SCHEMA, decideDesignSystem, projectDesignSystemTokens, validateCatalog, validateDesignSystemDecision };
