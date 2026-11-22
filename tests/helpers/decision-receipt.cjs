"use strict";

// A schema-valid design-system decision receipt for fixtures whose change advances into a governed
// phase (`directions`, `design-spec`, `motion-spec`, `tasks`, `implementation`). It records an owner
// scratch choice delegated to the fixture's own workflow state, which is the shape `pipeline-state`
// accepts without a catalog search.

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { initState: initWorkflowState } = require("../../skill/scripts/workflow-core.cjs");

const FILE = "design-system-decision.json";
const HASH = "a".repeat(64);

function receipt(overrides = {}) {
  return {
    schema: "design-pipeline.design-system-decision.v1",
    status: "ready",
    mode: "custom",
    projectAuthority: { id: "project-custom", source: "project" },
    selected: { id: "project-custom", source: "project" },
    rejected: [],
    rationale: ["The fixture records an owner scratch choice delegated to its own workflow state."],
    evidence: ["mode:custom"],
    frontendStackDecision: null,
    capabilityInventory: null,
    changeId: null,
    authorization: { by: "owner", scratch: true, delegation: { source: "workflow-state", stateSha256: HASH } },
    compared: [],
    ...overrides,
  };
}

// Writes the receipt into `dir` and returns the binding `advanceChange` / `next` consume.
function writeDecisionReceipt(dir, overrides = {}) {
  const file = path.join(dir, FILE);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(receipt(overrides), null, 2)}\n`);
  return { path: FILE, sha256: crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex"), mode: receipt(overrides).mode };
}

// `workflow-core.initState` for a ui or web fixture. Such a project cannot pass its component or
// build stage without a decision receipt, so a fixture that starts one binds one; a test about the
// gate passes its own `designSystem` and a film or edit project gets none.
function initProject(root, options = {}) {
  const bound = ["ui", "web"].includes(options.deliverable) && options.designSystem === undefined ? { designSystem: writeDecisionReceipt(root).path } : {};
  return initWorkflowState(root, { ...bound, ...options });
}

module.exports = { FILE, HASH, initProject, receipt, writeDecisionReceipt };