import React from "react";
import ReactDOM from "react-dom/client";
import r2wc from "react-to-webcomponent";
import InfluencerRoiWidget from "./InfluencerRoiWidget";

/** ---- Single-script style injector (no <link>) ---- */
const STYLE_ID = "influencer-roi-widget-styles";
const CSS = `
.irw * { box-sizing: border-box; }
.irw { max-width: 1120px; margin: 24px auto; padding: 28px; color:#0f172a; background:#fff; border:1px solid #e5e7eb; border-radius:16px; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Ubuntu,'Helvetica Neue',Arial,sans-serif; }
.irw h1 { font-size: 40px; line-height:1.2; font-weight: 800; text-align:center; margin: 0 0 6px; }
.irw .sub { text-align:center; color:#6b7280; margin: 0 0 22px; }

.irw .topbar { position: sticky; top:0; background:#ffffffcc; backdrop-filter: blur(5px); border-bottom:1px solid #e5e7eb; margin:-28px -28px 22px; padding:10px 28px; display:flex; justify-content:space-between; align-items:center; }
.irw .chip { padding:6px 10px; border-radius:999px; border:1px solid #e5e7eb; cursor:pointer; font-weight:600; }
.irw .chip.active { background:#111827; color:#fff; border-color:#111827; }

.irw .grid { display:grid; grid-template-columns:1fr; gap:20px; }
@media (min-width: 980px) { .irw .grid { grid-template-columns: 2fr 1fr; gap:26px; } }

.irw .card { border:1px solid #e5e7eb; border-radius:16px; padding:16px; box-shadow: 0 1px 1px rgba(0,0,0,.02); }
.irw .section { margin-bottom:14px; }
.irw .section h2 { font-size:16px; font-weight:700; margin-bottom:10px; }
.irw .controls { display:grid; grid-template-columns:1fr; gap:12px; }
@media (min-width: 760px) { .irw .controls.triple { grid-template-columns: repeat(3, 1fr); } .irw .controls.duo { grid-template-columns: repeat(2, 1fr); } }

.irw label { display:block; font-size:12px; color:#6b7280; margin-bottom:6px; }
.irw input[type="number"], .irw select { width:100%; padding:12px 14px; border:1px solid #d1d5db; border-radius:12px; font-size:15px; background:#fff; outline:none; transition:.12s; }
.irw input[type="number"]:focus, .irw select:focus { border-color:#2563eb; box-shadow:0 0 0 4px rgba(37,99,235,.12); }
.irw .help { font-size:12px; color:#94a3b8; margin-top:4px; }

.irw .kpi { position: sticky; top:90px; }
.irw .kpi .summary { display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; }
.irw .badge { font-size:12px; background:#ecfdf5; color:#047857; padding:4px 8px; border-radius:8px; font-weight:700; }
.irw .statgrid { display:grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap:10px; }
.irw .stat { padding:10px; border-radius:10px; background:#f8fafc; }
.irw .stat .lab { color:#6b7280; font-size:12px; }
.irw .stat .val { font-weight:700; }

.irw .donut { display:flex; flex-direction:column; align-items:center; }
.irw .bar { height:8px; background:#eef2f7; border-radius:999px; overflow:hidden; }
.irw .bar > span { display:block; height:100%; background:#10b981; transition: width .3s ease; }

.irw footer { margin-top:14px; font-size:12px; color:#94a3b8; }
`;

(function ensureStyles(){
  if (typeof document === "undefined") return;
  if (!document.getElementById(STYLE_ID)) {
    const s = document.createElement("style");
    s.id = STYLE_ID;
    s.textContent = CSS;
    document.head.appendChild(s);
  }
})();
/** ---------------------------------------------------- */

const asWC = r2wc(InfluencerRoiWidget, React, ReactDOM, {
  shadow: false,
  props: { config: "json" } // keep for future options
});
if (!customElements.get("r2wc-influencer-roi")) {
  customElements.define("r2wc-influencer-roi", asWC);
}
// ...everything already in index.js above (style injector + custom element)

// ---- Dev preview (CRA) ----
// When running `npm start`, CRA serves public/index.html with <div id="root"></div>.
// Mount the widget there so you can see it during development.
const rootEl = document.getElementById("root");
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(<InfluencerRoiWidget />);
}
