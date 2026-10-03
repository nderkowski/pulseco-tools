# PulseCo free tools

Revenue link: free search traffic to the PulseCo shops and the free-card email list (`docs/GOAL.md` growth).

This folder is ready to be the **root** of `nderkowski/pulseco-tools`, with GitHub Pages serving the root of the publishing branch. Copy all files, including `.nojekyll`; no npm install or build is needed in the destination repo. Expected public URL: https://nderkowski.github.io/pulseco-tools/.

The three individual calculator pages and the combined shift tools page use `dialysis/calc.mjs`. It is an exact copy of HQ's tested `public/tools/dialysis/calc.mjs`; HQ's site tests enforce equality and preserve the original countdown script. Do not update just one copy.

## Maintain from the HQ repository

- `node tools/build-pulseco-tools.mjs` regenerates the HTML, sitemap, robots, favicon, arithmetic copy and the 1200×630 PNG preview from SVG via `server/render.mjs` and Edge. Edit page copy in that builder; edit `style.css` and `tools.mjs` here directly.
- `EMPIRE_DATA_DIR=$(mktemp -d) node tools/render-pulseco-tools.mjs` serves only this folder on an ephemeral loopback port, checks browser examples, labels, focus, keyboard Tab and horizontal overflow, and captures every page at 390×844, 1280×800 and 360×844. It uses Edge discovery and PNG validation from `server/render.mjs`, with CDP viewport emulation to avoid Edge CLI's minimum layout width. Evidence goes to the printed temporary directory. The browser and server close afterwards.
- `EMPIRE_DATA_DIR=$(mktemp -d) node --test tests/*.test.mjs` runs the isolated HQ suite.
- `npm.cmd run check` runs the required static check.

No third-party scripts, fonts, analytics, accounts or patient-data storage. The calculators do arithmetic only; follow your unit's orders and policy. The unit converter uses **US fluid ounces**, not ounces of mass. The standalone end-time page uses clock arithmetic without a date; the combined tools page's existing countdown is tied to today's local date.

The Pages deployment, public URLs and external shop/email destinations still need post-push verification by the lead. Building this folder does not publish it.
