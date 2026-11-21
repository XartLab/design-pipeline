"use strict";

// A ui delivery names the files under review with --file and the owner's acceptance binds their bytes
// (OpenSpec change ui-review-binds-delivered-files, #182): a reviewed file changed, replaced or gone
// after the acceptance returns `next` to the final review instead of `done`.

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const { decide, initState, nextAction, readState } = require("../skill/scripts/workflow-core.cjs");

const PAGE = "<!doctype html><title>Desk</title><h1>Desk console</h1>\n";
const REPLACEMENT = "<!doctype html><title>Desk</title><h1>A completely different page</h1>\n";
const DELIVERY = "index.html built and rendered at 1280 and 390 widths";
const roots = [];

// Delivery and acceptance write the appearance ledger; keep it out of the user's home.
const ledger = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "ui-delivery-ledger-")), "ledger.json");
process.env.DESIGN_PIPELINE_LEDGER = ledger;
test.after(() => {
  delete process.env.DESIGN_PIPELINE_LEDGER;
  fs.rmSync(path.dirname(ledger), { recursive: true, force: true });
  for (const root of roots) fs.rmSync(root, { recursive: true, force: true });
});

function project(tier = "quick") {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "ui-delivery-"));
  roots.push(root);
  initState(root, { deliverable: "ui", tier });
  fs.writeFileSync(path.join(root, "index.html"), PAGE);
  return root;
}

const deliver = (root, files = ["index.html"], answer = DELIVERY) => decide(root, { by: "agent", stage: "deliver", answer, files });
const accept = (root) => decide(root, { by: "owner", stage: "review", verdict: "accept", answer: "Looks right" });
const rewrite = (root, rel, text) => fs.writeFileSync(path.join(root, rel), text);

test("a reviewed file changed after the owner accepted reopens the review", () => {
  const root = project();
  assert.equal(deliver(root).next.stage, "review");
  assert.equal(accept(root).next.type, "done");
  assert.equal(nextAction(root).type, "done");

  rewrite(root, "index.html", REPLACEMENT);
  const reopened = nextAction(root);
  assert.deepEqual([reopened.stage, reopened.type], ["review", "ask"]);
  assert.match(reopened.first, /accepted an earlier version/);
  assert.match(reopened.first, /index\.html/);
  assert.equal(accept(root).next.type, "done", "the owner accepts the changed page again");
});

test("unchanged reviewed files keep the delivery accepted", () => {
  const root = project();
  deliver(root);
  assert.equal(accept(root).next.type, "done");
  assert.equal(nextAction(root).type, "done");
  assert.equal(nextAction(root).type, "done");
});

test("a reviewed file that disappears reopens the review", () => {
  const root = project();
  deliver(root);
  accept(root);
  fs.rmSync(path.join(root, "index.html"));
  const reopened = nextAction(root);
  assert.deepEqual([reopened.stage, reopened.type], ["review", "ask"]);
  assert.match(reopened.first, /index\.html/);
  rewrite(root, "index.html", REPLACEMENT);
  assert.equal(accept(root).next.type, "done");
});

test("every named file is bound, not only the first", () => {
  const root = project();
  fs.mkdirSync(path.join(root, "assets"));
  rewrite(root, "assets/app.css", ".desk { color: #101418; }\n");
  deliver(root, ["index.html", "assets/app.css"]);
  accept(root);
  assert.equal(nextAction(root).type, "done");
  rewrite(root, "assets/app.css", ".desk { color: #e4572e; }\n");
  const reopened = nextAction(root);
  assert.deepEqual([reopened.stage, reopened.type], ["review", "ask"]);
  assert.match(reopened.first, /assets\/app\.css/);
});

test("delivery records the reviewed files and their hashes", () => {
  const root = project();
  deliver(root, ["index.html"]);
  const state = readState(root);
  assert.deepEqual(Object.keys(state.decisions.deliveredFiles), ["index.html"]);
  assert.match(state.decisions.deliveredFiles["index.html"], /^sha256:[0-9a-f]{64}$/);
  assert.deepEqual(Object.keys(state.decisions.deliveryInputHashes), ["files"]);
  assert.deepEqual(state.decisions.deliveryInputHashes.files, state.decisions.deliveredFiles);
});

test("ui delivery refuses a missing, escaping or directory file, and a delivery with no file", () => {
  const root = project();
  fs.mkdirSync(path.join(root, "assets"));
  rewrite(root, "outside-holder", "x");
  assert.throws(() => decide(root, { by: "agent", stage: "deliver", answer: DELIVERY }), { code: "INPUT_MISSING" });
  assert.throws(() => deliver(root, ["missing.html"]), /does not exist/);
  assert.throws(() => deliver(root, ["../outside-holder"]), /must stay inside/);
  assert.throws(() => deliver(root, ["assets"]), /not a directory/);
  assert.equal(nextAction(root).stage, "work", "a refused delivery records nothing");
});