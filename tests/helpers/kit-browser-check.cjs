"use strict";

// Shared browser half of template check for the example kits and the default renders: one Chrome per
// job, motion settled (the browser is launched with prefers-reduced-motion forced on, so every kit
// loads in its final state and the check is deterministic), the page height measured in the same
// browser instead of hard-coded, and the widths of one kit checked in parallel in separate Chromes.
// The check itself is page-check.cjs, unchanged.

const fs = require("node:fs");
const path = require("node:path");
const bank = require("../../skill/tools/template-bank/bank.cjs");
const { checkPage, FAST_FRAMES } = require("../../skill/tools/template-bank/page-check.cjs");
const { resolvePuppeteer } = require("../../skill/scripts/film-capture-core.cjs");
const { resolveBrowser } = require("../../skill/scripts/browser-locate.cjs");

// { puppeteerModule, chrome } or { skip: reason }
function locateBrowser() {
  try {
    const puppeteerModule = process.env.DESIGN_PIPELINE_PUPPETEER_MODULE || path.dirname(require.resolve("puppeteer-core/package.json"));
    return { puppeteerModule, chrome: resolveBrowser() };
  } catch (error) {
    return { skip: `browser unavailable: ${error.message}` };
  }
}

const CI_SKIP = process.env.GITHUB_ACTIONS === "true" && "text-occluded differs on the CI runner (#305)";

function launch(found, file) {
  const puppeteer = resolvePuppeteer(path.dirname(path.resolve(file)), found.puppeteerModule);
  return puppeteer.launch({ executablePath: found.chrome, headless: true, args: ["--allow-file-access-from-files", "--force-color-profile=srgb", "--font-render-hinting=none", "--hide-scrollbars", "--force-prefers-reduced-motion", ...FAST_FRAMES] });
}

async function pageHeight(browser, file, width) {
  const page = await browser.newPage();
  try {
    await page.setViewport({ width, height: 900, deviceScaleFactor: 1 });
    await page.goto(`file://${path.resolve(file)}`, { waitUntil: "load", timeout: 60000 });
    await page.evaluate(() => document.fonts.ready);
    return await page.evaluate(() => Math.ceil(document.documentElement.scrollHeight));
  } finally {
    await page.close();
  }
}

// One kit page at several widths, each width in its own Chrome and all at once. Returns
// [{ width, height, status, findings: ["rule:slot: message"], ms }] in the order of widths.
async function checkKit(found, file, widths) {
  return Promise.all(widths.map(async (width) => {
    const started = Date.now();
    const browser = await launch(found, file);
    try {
      const height = await pageHeight(browser, file, width);
      const report = await checkPage({ file, browser, size: [width, height] });
      return { width, height, status: report.status, findings: report.findings.map((f) => `${f.rule}:${f.slot}: ${f.message}`), ms: Date.now() - started };
    } finally {
      await browser.close();
    }
  }));
}

// Default renders of templates (id, params) in one Chrome: the static report and the browser report
// together, the way template render merges them (the browser's contrast replaces the static one).
// Returns [{ name, status, findings }].
async function checkRenders(found, jobs, dir) {
  const browser = await launch(found, dir);
  const out = [];
  try {
    for (const { id, params = {} } of jobs) {
      const name = `${id}${Object.keys(params).length ? ` ${JSON.stringify(params)}` : ""}`;
      const file = path.join(dir, `${id}-${Object.values(params).join("-") || "default"}.svg`);
      const svg = bank.render(id, { params }).svg;
      fs.writeFileSync(file, svg);
      const fixed = bank.check(svg).findings.filter((f) => f.rule !== "contrast" && f.rule !== "contrast-unverified");
      const page = await checkPage({ file, browser });
      const findings = [...fixed, ...page.findings].map((f) => `${f.rule}:${f.slot}: ${f.message}`);
      out.push({ name, status: findings.length ? "failed" : "passed", findings });
    }
  } finally {
    await browser.close();
  }
  return out;
}

module.exports = { locateBrowser, CI_SKIP, launch, checkKit, checkRenders };
