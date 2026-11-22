"use strict";

// Issue #190: the interaction audit must exempt a prose link that is the only content of its
// paragraph, and the ten top-level CLI commands that had no guide must each have a usage line.

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { captureInteraction } = require("../skill/scripts/interaction-capture-core.cjs");
const { resolvePuppeteer } = require("../skill/scripts/film-capture-core.cjs");
const { resolveBrowser } = require("../skill/scripts/browser-locate.cjs");
const { SCHEMA, evaluateProbeFile, validateProbeFile } = require("../skill/scripts/interaction-core.cjs");

const repoRoot = path.resolve(__dirname, "..");

function browserTools() {
  try {
    resolvePuppeteer(repoRoot, process.env.DESIGN_PIPELINE_PUPPETEER_MODULE);
    const puppeteerModule = process.env.DESIGN_PIPELINE_PUPPETEER_MODULE
      ? path.resolve(process.env.DESIGN_PIPELINE_PUPPETEER_MODULE)
      : require.resolve("puppeteer-core", { paths: [repoRoot] });
    return { chrome: resolveBrowser(), puppeteerModule, skip: false };
  } catch (error) {
    if (error.code !== "TOOL_MISSING") throw error;
    return { skip: `no browser for the audit probe (${error.message})` };
  }
}
const tools = browserTools();

test("the two motion-recipe specimens report no target-size finding for their recipe link", { skip: tools.skip }, async (t) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "issue-190-recipes-"));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const doc = {
    schema: SCHEMA,
    id: "issue-190-recipes",
    url: "index.html",
    probes: [{ id: "audit", kind: "audit", thresholds: { fonts: ["sans-serif"] } }],
  };
  for (const recipe of ["hp-ghost-bar", "cooldown-completion"]) {
    fs.copyFileSync(path.join(repoRoot, "skill/tools/motion-recipes", `${recipe}.html`), path.join(dir, "index.html"));
    fs.writeFileSync(path.join(dir, "interaction.json"), `${JSON.stringify(doc, null, 2)}\n`);
    const recorded = await captureInteraction(path.join(dir, "interaction.json"), {
      doc: validateProbeFile(doc),
      chrome: tools.chrome,
      puppeteerModule: tools.puppeteerModule,
    });
    const result = evaluateProbeFile(doc, recorded, { project: dir });
    const failed = result.findings.filter((finding) => finding.code === "audit.target-size").map((finding) => finding.selector);
    assert.deepEqual(failed, [], `${recipe} has no undersized target`);
  }
});

test("a prose link that is the only content of its paragraph is exempt from target size", { skip: tools.skip }, async (t) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "issue-190-prose-link-"));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const html = `<!doctype html><html lang="en" style="background:#fff;color:#18181b;font:16px/1.5 sans-serif"><body style="margin:0;padding:32px">
<p><a id="recipe" href="#recipe">Recipe, tuning and source evidence</a></p>
<p><a id="after-break" href="#next">Next</a><br>then more</p>
<p>Some text <a id="in-sentence" href="#terms">terms</a> here.</p>
<div><a id="outside" href="#next">Next</a></div>
</body></html>`;
  fs.writeFileSync(path.join(dir, "index.html"), html);
  const doc = {
    schema: SCHEMA,
    id: "issue-190",
    url: "index.html",
    probes: [{ id: "audit", kind: "audit", thresholds: { fonts: ["sans-serif"] } }],
  };
  fs.writeFileSync(path.join(dir, "interaction.json"), `${JSON.stringify(doc, null, 2)}\n`);
  const recorded = await captureInteraction(path.join(dir, "interaction.json"), {
    doc: validateProbeFile(doc),
    chrome: tools.chrome,
    puppeteerModule: tools.puppeteerModule,
  });
  const result = evaluateProbeFile(doc, recorded, { project: dir });
  const failed = result.findings.filter((finding) => finding.code === "audit.target-size").map((finding) => finding.selector).sort();
  assert.deepEqual(failed, ["#after-break", "#outside"], "only the paragraph-only prose link is exempt");
});

test("the ten undocumented CLI commands each have a usage line in the maintained reference", () => {
  const reference = fs.readFileSync(path.join(repoRoot, "skill/references/pipeline-reference.md"), "utf8");
  const commands = ["plan", "resume", "explain-block", "package", "patterns", "ui-ir", "design-code-map", "art-motion", "diligence", "style-signals"];
  for (const command of commands) {
    assert.ok(reference.includes(`designer-pipeline ${command}`), `${command} has a usage line`);
  }
});
