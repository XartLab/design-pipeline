# Reference Video Acquisition

`reference analyze-video` reads a local file. This guide is the fallback ladder for obtaining
that file when the obvious downloader refuses the page. It adds no command, gate or schema; the
analyzer contract and the evidence it must produce stay in
[reference-spec.md](reference-spec.md#video-content-and-project-analysis).

Everything below runs on the user's machine with the user's tools. Design Pipeline ships no
downloader and no browser driver; the reason is at the end.

## Attempt order

Stop at the first step that produces a playable file inside the project root, then run the
analyzer on it. Each step names the failure that sends you to the next one.

### 1. Ask for the file

`reference analyze-video` resolves its `--path` inside the selected root, so the file has to
exist as bytes before anything else. A file the user already has, or can export from the
site's own player, is the only path with no third-party extraction. Ask once, name what the
analyzer accepts (a container ffmpeg can decode, with a video stream), and record the origin in
`reference.md`.

A page that blocks automated extraction usually blocks every step below too; the user's own
player session is already authorized in a way a script is not.

### 2. Update yt-dlp, then retry

`ERROR: [BiliBili] <id>: Unable to extract initial state` is the extractor failing on the page,
not the network. The site changed and the installed yt-dlp no longer matches it, so update it
before debugging anything else:

```bash
yt-dlp --version
yt-dlp -U            # or the package manager that installed it: winget upgrade yt-dlp, pipx upgrade yt-dlp, scoop update yt-dlp
yt-dlp -f "bv*+ba/b" --merge-output-format mp4 -o reference/<name>.mp4 "<page url>"
```

`-f "bv*+ba/b"` takes the best video and audio and merges them into one file inside the
project. Do not re-encode: the analyzer measures the frames it decodes, so a transcode would
change the evidence.

### 3. Give yt-dlp cookies from a closed browser

`--cookies-from-browser edge` fails with `Could not copy Chrome cookie database` while Edge is
running: every Chromium-based browser locks its cookie store for the session. Close the browser
and run the same command again. When the browser has to stay open, export the cookies to a
Netscape-format file from a browser extension and pass `--cookies <file>` instead.

Cookies are credentials. Keep the export outside the project tree, never commit it, and delete
it when the download succeeds. If the page still refuses, go to the next step: this one only
fixes the lock, not a site that rejects the request itself.

### 4. Read the page in a headless browser, then fetch the streams

This is the path that worked on Bilibili `BV17Et86SETm` on 2026-11-22, after steps 2 and 3
failed: `curl` on the page or the API returned the site's own "出错啦!" error page, while Chrome
loaded the player and exposed its state to script.

1. Resolve an executable with the packaged resolver. Its order is an explicit path (what the
   `--chrome` flag passes), `PUPPETEER_EXECUTABLE_PATH`, the HyperFrames headless shell, then an
   installed Chrome, Edge or Chromium:

   ```bash
   node -p "require('<skill-root>/scripts/browser-locate.cjs').resolveBrowser()"
   ```

2. Read `window.__playinfo__.data.dash` from the loaded page. `dash.video[]` and `dash.audio[]`
   carry `baseUrl` (some responses spell it `base_url`), `codecs` and `bandwidth`; pick the
   highest bandwidth the machine can decode and keep the matching audio entry.

   ```javascript
   // puppeteer-core is not a Design Pipeline dependency: run this from a project that has it,
   // or with whatever browser driver the host already uses.
   const puppeteer = require("puppeteer-core");
   const browser = await puppeteer.launch({ executablePath: process.argv[2], headless: true });
   const page = await browser.newPage();
   await page.goto(process.argv[3], { waitUntil: "networkidle2" });
   const dash = await page.evaluate(() => window.__playinfo__?.data?.dash ?? null);
   await browser.close();
   console.log(JSON.stringify(dash, null, 2));
   ```

   A clean profile can be refused as well. Pointing the driver at the user's own profile can
   get past that, but that profile is their signed-in browser data, so ask before using it.

3. Fetch both streams with the page's `Referer` and merge them without re-encoding:

   ```bash
   ffmpeg -hide_banner -y \
     -headers "Referer: https://www.bilibili.com/" -i "<video baseUrl>" \
     -headers "Referer: https://www.bilibili.com/" -i "<audio baseUrl>" \
     -map 0:v:0 -map 1:a:0 -c copy -movflags +faststart reference/<name>.mp4
   ```

   `-headers` is an input option and applies to the input that follows it, so each `-i` needs
   its own. The `Referer` is what the CDN checks; without it both requests fail. For a
   video-only source, drop the second input and its `-map`.

4. Check the result before analyzing it:
   `ffprobe -v error -show_entries stream=codec_type,duration -of json reference/<name>.mp4`
   must show one video stream and the duration the page claimed.

## Limits

- Internal reference only. The file stays in the project (or in ignored `.design-pipeline/`),
  is not published with a deliverable and is not committed.
- Copyright and site terms are the user's decision. A reference is normally not licensed for
  redistribution, and nothing here grants that permission.
- Per-site extraction breaks without notice. Steps 2 and 4 are recorded from one site on one
  date; when they fail, re-derive from the page instead of treating them as a supported
  interface.
- `reference analyze-video` never fetches. A file that cannot be obtained is a pending source:
  record `source.availability: pending` with `pendingReason` and `requestedFrom` as
  [reference-spec.md](reference-spec.md#source-availability) requires, and ask. Never analyze a
  placeholder, a partial download or a re-encode as if it were the reference.

## No `reference fetch` command

`reference` keeps `check`, `resolve`, `extract` and `analyze-video`, and no `fetch`. That is a
decision, not an omission:

- The package must not require a browser driver or an extractor to install. `browser-locate.cjs`
  finds an executable but deliberately resolves no driver, and the one packaged tool that needs
  one (`tools/template-bank/vector80.cjs --png`) says so and exits when it is missing. A fetch
  command would either add a runtime dependency to every install or fail with `TOOL_MISSING` on
  a clean one.
- Extraction is per-site reverse engineering with no offline check. `npm test` cannot tell a
  correct download from a plausible file for the wrong page, and the second is worse than a
  documented manual path.
- The repository's contracts put downloads on the user's side. The control plane must not
  "resolve ambient modules, download dependencies, fabricate evidence" when an integration is
  unavailable, and `sources fetch` downloads only repository-pinned bundles verified against
  manifest hashes. A reference video is neither pinned nor hash-verified.

So acquisition stays with the agent and the user's tools, and `reference analyze-video` remains
the only command that touches the file.