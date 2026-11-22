"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { decideDesignSystem, validateDesignSystemDecision } = require("../skill/scripts/design-system-decision-core.cjs");
const { advanceChange, createInitialState, writeNewChange } = require("../skill/scripts/pipeline-state-core.cjs");

const sha256 = (value) => crypto.createHash("sha256").update(value).digest("hex");
const HASH = "a".repeat(64);

function inventory(overrides = {}) {
  return {
    directQuery: "research console",
    directQueryResults: 0,
    searchedCapabilities: ["app shell", "command palette"],
    capabilityResults: { "app shell": { terms: ["app shell"], count: 6, matchedIds: ["AppShell", "SideNav"] } },
    ...overrides,
  };
}

function receipt(overrides = {}) {
  return {
    schema: "design-pipeline.design-system-decision.v1",
    status: "ready",
    mode: "reference",
    projectAuthority: null,
    selected: { id: "AppShell", status: "stable", sourceHash: HASH },
    rejected: [],
    rationale: ["Selected as a non-runtime reference."],
    evidence: ["zero-result-inconclusive", `catalog:AppShell@${HASH}`],
    frontendStackDecision: null,
    capabilityInventory: inventory(),
    changeId: "demo-change",
    authorization: { by: "agent", scratch: false, delegation: null },
    compared: [{ id: "AppShell", status: "stable", compatible: true, outcome: "selected" }],
    ...overrides,
  };
}

function ownerScratch(overrides = {}) {
  return receipt({
    mode: "custom",
    selected: { id: "project-custom", source: "project" },
    capabilityInventory: null,
    compared: [],
    authorization: { by: "owner", scratch: true, delegation: { source: "owner-instruction", quote: "build this one from scratch, no component library" } },
    ...overrides,
  });
}

function changeRoot(name = "demo-change") {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "ds-decision-gate-"));
  const change = path.join(root, name);
  fs.mkdirSync(change, { recursive: true });
  const state = createInitialState({ changeId: name, timestamp: "2026-11-22T00:00:00.000Z", phase: "brief" });
  writeNewChange(path.join(change, "state.json"), path.join(change, "events.jsonl"), state);
  return change;
}

function writeReceipt(change, value) {
  const file = path.join(change, "design-system-decision.json");
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
  return { file, sha256: sha256(fs.readFileSync(file)) };
}

function advance(change, mutation) {
  const stateFile = path.join(change, "state.json");
  return advanceChange(stateFile, path.join(change, "events.jsonl"), {
    expectedSha256: sha256(fs.readFileSync(stateFile)),
    timestamp: "2026-11-22T01:00:00.000Z",
    summary: "advance",
    ...mutation,
  });
}

test("an explicit owner scratch choice is consumable without a catalog search", () => {
  const verdict = validateDesignSystemDecision(ownerScratch(), { changeId: "demo-change" });
  assert.equal(verdict.status, "ready");
  assert.equal(verdict.mode, "custom");
  assert.equal(verdict.grantsVisualAcceptance, false);
});

test("an explicit owner scratch choice needs no catalog and no catalog search", () => {
  const decision = decideDesignSystem({
    mode: "custom",
    changeId: "demo-change",
    authorization: { by: "owner", scratch: true, delegation: { source: "owner-instruction", quote: "build this one from scratch, no component library" } },
    frontendStackDecision: { schema: "design-pipeline.frontend-stack-decision.v1", status: "ready", registryHash: HASH, selected: { styling: {}, uiLibrary: {} }, toolRoutes: [] },
  });
  assert.equal(decision.status, "ready");
  assert.equal(decision.mode, "custom");
  assert.equal(decision.compared.length, 0);
  assert.equal(decision.capabilityInventory, null);
  assert.equal(validateDesignSystemDecision(decision, { changeId: "demo-change" }).status, "ready");
});

test("a custom choice the agent made without searched capabilities is refused", () => {
  const verdict = validateDesignSystemDecision(receipt({ mode: "custom", compared: [], capabilityInventory: null, authorization: { by: "agent", scratch: false, delegation: null } }), { changeId: "demo-change" });
  assert.equal(verdict.status, "blocked");
  assert.equal(verdict.code, "CAPABILITY_INVENTORY_MISSING");
});

test("an agent-made custom choice without compared candidates is refused", () => {
  const verdict = validateDesignSystemDecision(receipt({ mode: "custom", compared: [], authorization: { by: "agent", scratch: false, delegation: null } }), { changeId: "demo-change" });
  assert.equal(verdict.status, "blocked");
  assert.equal(verdict.code, "COMPARISON_MISSING");
});

test("a receipt without an authorization is refused", () => {
  const verdict = validateDesignSystemDecision(receipt({ authorization: null }), { changeId: "demo-change" });
  assert.equal(verdict.status, "blocked");
  assert.equal(verdict.code, "DECISION_NOT_AUTHORIZED");
});

test("an owner-authorized scratch choice without the owner's words is refused", () => {
  const verdict = validateDesignSystemDecision(ownerScratch({ authorization: { by: "owner", scratch: true, delegation: null } }), { changeId: "demo-change" });
  assert.equal(verdict.status, "blocked");
  assert.equal(verdict.code, "DELEGATION_MISSING");
});

test("a malformed receipt is refused before any semantic check", () => {
  const malformed = receipt();
  delete malformed.evidence;
  const verdict = validateDesignSystemDecision(malformed, { changeId: "demo-change" });
  assert.equal(verdict.status, "blocked");
  assert.equal(verdict.code, "UNSUPPORTED_SCHEMA");
});

test("a zero-result product query with capability hits must be marked inconclusive", () => {
  const verdict = validateDesignSystemDecision(receipt({ evidence: [`catalog:AppShell@${HASH}`] }), { changeId: "demo-change" });
  assert.equal(verdict.status, "blocked");
  assert.equal(verdict.code, "ZERO_RESULT_NOT_MARKED");
});

test("a reference decision is a reference, not an adopted substrate", () => {
  const verdict = validateDesignSystemDecision(receipt(), { changeId: "demo-change" });
  assert.equal(verdict.status, "ready");
  assert.equal(verdict.runtimeSubstrate, null);
  assert.deepEqual(verdict.unusedCapabilities, ["SideNav"]);
});

test("a decision that belongs to another change is refused", () => {
  const verdict = validateDesignSystemDecision(receipt({ changeId: "other-change" }), { changeId: "demo-change" });
  assert.equal(verdict.status, "blocked");
  assert.equal(verdict.code, "DECISION_CHANGE_MISMATCH");
});

test("a change cannot advance into directions without a decision receipt", () => {
  const change = changeRoot();
  assert.throws(() => advance(change, { phase: "directions" }), (error) => {
    assert.equal(error.code, "BLOCKED");
    assert.equal(error.details.findingCode, "DESIGN_SYSTEM_DECISION_REQUIRED");
    return true;
  });
});

test("a bound decision lets the change advance and records its lineage", () => {
  const change = changeRoot();
  const bound = writeReceipt(change, receipt());
  const result = advance(change, { phase: "directions", designSystem: { path: "design-system-decision.json", sha256: bound.sha256 } });
  assert.equal(result.state.phase, "directions");
  assert.equal(result.state.extensions.designSystem.path, "design-system-decision.json");
  assert.equal(result.state.extensions.designSystem.sha256, bound.sha256);
  assert.equal(result.state.extensions.designSystem.mode, "reference");
});

test("a changed receipt invalidates the advancement", () => {
  const change = changeRoot();
  const bound = writeReceipt(change, receipt());
  advance(change, { phase: "directions", designSystem: { path: "design-system-decision.json", sha256: bound.sha256 } });
  writeReceipt(change, receipt({ rationale: ["A different reason."] }));
  assert.throws(() => advance(change, { phase: "tasks" }), (error) => {
    assert.equal(error.details.findingCode, "DESIGN_SYSTEM_DECISION_CHANGED");
    return true;
  });
});

test("a removed receipt invalidates the advancement", () => {
  const change = changeRoot();
  const bound = writeReceipt(change, receipt());
  advance(change, { phase: "directions", designSystem: { path: "design-system-decision.json", sha256: bound.sha256 } });
  fs.rmSync(bound.file);
  assert.throws(() => advance(change, { phase: "tasks" }), (error) => {
    assert.equal(error.details.findingCode, "DESIGN_SYSTEM_DECISION_MISSING");
    return true;
  });
});

test("a receipt outside the change is refused", () => {
  const change = changeRoot();
  const outside = path.join(path.dirname(change), "outside-decision.json");
  fs.writeFileSync(outside, `${JSON.stringify(receipt(), null, 2)}\n`);
  assert.throws(() => advance(change, { phase: "directions", designSystem: { path: "../outside-decision.json", sha256: sha256(fs.readFileSync(outside)) } }), (error) => {
    assert.equal(error.details.findingCode, "DESIGN_SYSTEM_DECISION_OUTSIDE_CHANGE");
    return true;
  });
});

test("a bound receipt is re-checked after the change leaves the governed phases", () => {
  const change = changeRoot();
  const bound = writeReceipt(change, receipt());
  const binding = { path: "design-system-decision.json", sha256: bound.sha256 };
  for (const phase of ["directions", "design-spec", "tasks", "implementation", "gate-review"]) advance(change, { phase, ...(phase === "directions" ? { designSystem: binding } : {}) });
  fs.rmSync(bound.file);
  assert.throws(() => advance(change, { phase: "verification" }), (error) => {
    assert.equal(error.details.findingCode, "DESIGN_SYSTEM_DECISION_MISSING");
    return true;
  });
});

test("an edited receipt also invalidates the release phases", () => {
  const change = changeRoot();
  const bound = writeReceipt(change, receipt());
  const binding = { path: "design-system-decision.json", sha256: bound.sha256 };
  for (const phase of ["directions", "design-spec", "tasks", "implementation", "gate-review", "verification"]) advance(change, { phase, ...(phase === "directions" ? { designSystem: binding } : {}) });
  writeReceipt(change, receipt({ rationale: ["A different reason."] }));
  assert.throws(() => advance(change, { phase: "release-readiness" }), (error) => {
    assert.equal(error.details.findingCode, "DESIGN_SYSTEM_DECISION_CHANGED");
    return true;
  });
});

test("a replacement decision invalidates the evidence recorded under the old one", () => {
  const change = changeRoot();
  const bound = writeReceipt(change, receipt());
  advance(change, {
    phase: "directions",
    designSystem: { path: "design-system-decision.json", sha256: bound.sha256 },
    evidence: ["direction:approved"],
    foundations: { design: { path: "DESIGN.md", status: "ready", sha256: HASH, validator: "foundation check" } },
  });
  const rebound = writeReceipt(change, receipt({ rationale: ["The owner chose another reference."] }));
  const advanced = advance(change, { phase: "design-spec", designSystem: { path: "design-system-decision.json", sha256: rebound.sha256 }, evidence: ["spec:ready"] });
  assert.deepEqual(advanced.state.evidence, ["spec:ready"]);
  assert.deepEqual(advanced.state.foundations, { design: null, motion: null });
  assert.equal(advanced.state.extensions.designSystem.sha256, rebound.sha256);
});

test("re-recording the same decision keeps the evidence it already approved", () => {
  const change = changeRoot();
  const bound = writeReceipt(change, receipt());
  const binding = { path: "design-system-decision.json", sha256: bound.sha256 };
  advance(change, { phase: "directions", designSystem: binding, evidence: ["direction:approved"] });
  const advanced = advance(change, { phase: "design-spec", designSystem: binding });
  assert.deepEqual(advanced.state.evidence, ["direction:approved"]);
});
