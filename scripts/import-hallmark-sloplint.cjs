#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { canonicalTree, copyTrackedFiles, fail, inspectCheckout } = require("./git-tree-snapshot.cjs");

const destination = path.resolve(__dirname, "../skill/vendor/hallmark-sloplint");
const repository = "https://github.com/Nutlope/hallmark";
// The revision comes from the checkout; sources.lock.json records which upstream HEAD was imported.
// Only the two dependency-free linter scripts and their MIT license are vendored; the render helper is
// sloplint.mjs's own dynamic import target, so the two must keep their upstream relative locations.
const SCOPE = [
  "skills/hallmark/scripts/sloplint.mjs",
  "skills/hallmark/scripts/sloplint-render.mjs",
  "skills/hallmark/LICENSE",
];
const copyright = "Copyright (c) 2026 Hallmark contributors";

function parseArgs(argv) {
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--help" || token === "-h") return { help: true };
    if (token !== "--source" && token !== "--reviewed-at") fail(`unknown option: ${token}`);
    const value = argv[++index];
    if (!value || value.startsWith("--")) fail(`${token} requires a value`);
    options[token.slice(2)] = value;
  }
  if (!options.source) fail("--source is required");
  const date = options["reviewed-at"];
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || "") || !Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date) fail("--reviewed-at requires a valid YYYY-MM-DD");
  return { source: path.resolve(options.source), reviewedAt: date };
}

function importSnapshot(source, reviewedAt) {
  for (const file of SCOPE) {
    if (!fs.existsSync(path.join(source, file))) fail(`source is not a complete Nutlope/hallmark checkout: missing ${file}`);
  }
  const checkout = inspectCheckout(source, { include: (file) => SCOPE.includes(file) });
  const license = checkout.blobs.get("skills/hallmark/LICENSE")?.toString("utf8") || "";
  if (!license.startsWith("MIT License") || !license.includes(copyright)) fail("source LICENSE does not match reviewed Hallmark MIT attribution");
  const files = checkout.indexEntries.map((entry) => entry.path);
  if (SCOPE.some((file) => !files.includes(file))) fail(`upstream scoped inventory lost a file: ${files.join(", ")}`);
  const byteCount = checkout.indexEntries.reduce((sum, entry) => sum + entry.size, 0);

  fs.mkdirSync(path.dirname(destination), { recursive: true });
  const backup = `${destination}.backup-${process.pid}`;
  if (fs.existsSync(backup)) fail(`stale import backup already exists: ${backup}`);
  const stage = fs.mkdtempSync(path.join(path.dirname(destination), ".hallmark-sloplint-stage-"));
  let movedOld = false;
  let manifest;
  try {
    const upstream = path.join(stage, "upstream");
    fs.mkdirSync(upstream);
    copyTrackedFiles(upstream, checkout.indexEntries, checkout.blobs);
    const treeSha256 = canonicalTree(upstream, files);
    manifest = {
      schema: "design-pipeline.hallmark-sloplint-source.v1",
      source: {
        repository, revision: checkout.revision, gitTree: checkout.gitTree, committedAt: checkout.committedAt,
        license: "MIT", reviewedAt, scope: SCOPE,
        contentHashScope: "selected linter scripts and license: sorted POSIX path, NUL, SHA-256 blob hash, newline; gitTree is the upstream repository root, not this scoped snapshot",
      },
      licenses: [{ path: "upstream/skills/hallmark/LICENSE", license: "MIT", copyright }],
      snapshot: {
        root: "upstream", fileCount: files.length, byteCount, treeSha256,
        executableFiles: checkout.indexEntries.filter((entry) => entry.mode === "100755").map((entry) => entry.path).sort(),
        objects: checkout.indexEntries.map(({ path: file, mode, oid, size }) => ({ path: file, mode, oid, size })),
      },
      boundary: { mode: "built-in-reference-adaptation", installsUpstreamDependencies: false, executesUpstreamScripts: false, executesDeployment: false, changesProjectRuntime: false },
    };
    fs.writeFileSync(path.join(stage, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
    if (fs.existsSync(destination)) { fs.renameSync(destination, backup); movedOld = true; }
    fs.renameSync(stage, destination);
  } catch (error) {
    if (!fs.existsSync(destination) && movedOld && fs.existsSync(backup)) fs.renameSync(backup, destination);
    if (fs.existsSync(stage)) fs.rmSync(stage, { recursive: true, force: true });
    throw error;
  }
  if (movedOld) fs.rmSync(backup, { recursive: true, force: true });
  return manifest;
}

try {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) process.stdout.write("Usage: node scripts/import-hallmark-sloplint.cjs --source <clean-reviewed-checkout> --reviewed-at YYYY-MM-DD\n");
  else {
    const manifest = importSnapshot(options.source, options.reviewedAt);
    process.stdout.write(`${JSON.stringify({ status: "imported", revision: manifest.source.revision, files: manifest.snapshot.fileCount, treeSha256: manifest.snapshot.treeSha256 })}\n`);
  }
} catch (error) {
  process.stderr.write(`FAIL ${error.message}\n`);
  process.exitCode = 1;
}