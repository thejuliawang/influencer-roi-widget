/* Copy CRA build to stable paths under docs/static */
const fs = require("fs");
const path = require("path");

const buildDir = path.join(__dirname, "..", "build");
const docsDir = path.join(__dirname, "..", "docs");
const srcJsDir = path.join(buildDir, "static", "js");
const srcCssDir = path.join(buildDir, "static", "css");
const outJsDir = path.join(docsDir, "static", "js");
const outCssDir = path.join(docsDir, "static", "css");

fs.mkdirSync(outJsDir, { recursive: true });
fs.mkdirSync(outCssDir, { recursive: true });

const mainJs = fs.readdirSync(srcJsDir).find(f => /^main\..*\.js$/.test(f));
fs.copyFileSync(path.join(srcJsDir, mainJs), path.join(outJsDir, "main.js"));

const css = fs.readdirSync(srcCssDir).find(f => /^main\..*\.css$/.test(f));
if (css) fs.copyFileSync(path.join(srcCssDir, css), path.join(outCssDir, "main.css"));

const indexHtml = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Influencer ROI Widget</title>
</head><body>
<script defer src="./static/js/main.js"></script>
<r2wc-influencer-roi></r2wc-influencer-roi>
</body></html>`;
fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(path.join(docsDir, "index.html"), indexHtml);

console.log("Wrote docs/index.html and stable static/js/main.js");
