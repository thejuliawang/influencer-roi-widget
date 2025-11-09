import React, { useMemo, useState } from "react";

export default function InfluencerRoiWidget() {
  const [mode, setMode] = useState("plan");               // "plan" | "analyze"
  const [model, setModel] = useState("CPM");              // "CPM" | "CPE" | "Flat"
  const [rate, setRate] = useState(12);                   // $ per 1k / per engagement / flat per post
  const [creators, setCreators] = useState(5);
  const [posts, setPosts] = useState(2);
  const [reachPerPost, setReachPerPost] = useState(20000);
  const [engRate, setEngRate] = useState(3.5);            // %
  const [ctr, setCtr] = useState(1.2);                    // %
  const [cvr, setCvr] = useState(2.0);                    // %
  const [aov, setAov] = useState(65);                     // $

  const {
    impressions, engagements, cost, clicks, conversions,
    revenue, profit, roi, effCpm, effCpe, cpa
  } = useMemo(() => {
    const totalUnits = creators * posts;

    const totalImpressions = model === "CPE"
      ? Math.max(1, Math.round((reachPerPost / (Math.max(engRate, 0.01) / 100)) * totalUnits))
      : Math.max(0, Math.round(reachPerPost * totalUnits));

    const totalEngagements = model === "CPE"
      ? Math.max(0, Math.round(reachPerPost * totalUnits))
      : Math.max(0, Math.round(totalImpressions * (engRate / 100)));

    const cost = model === "CPM"
      ? (totalImpressions / 1000) * rate
      : model === "CPE"
      ? totalEngagements * rate
      : rate * totalUnits;

    const clicks = Math.round(totalImpressions * (ctr / 100));
    const conversions = Math.round(clicks * (cvr / 100));
    const revenue = conversions * aov;
    const profit = revenue - cost;
    const roi = cost > 0 ? (profit / cost) * 100 : 0;

    const effCpm = totalImpressions > 0 ? cost / (totalImpressions / 1000) : 0;
    const effCpe = totalEngagements > 0 ? cost / totalEngagements : 0;
    const cpa = conversions > 0 ? cost / conversions : 0;

    return { impressions: totalImpressions, engagements: totalEngagements, cost, clicks, conversions, revenue, profit, roi, effCpm, effCpe, cpa };
  }, [model, rate, creators, posts, reachPerPost, engRate, ctr, cvr, aov]);

  const Donut = ({ value }) => {
    const clamped = Math.max(0, Math.min(200, value));
    const r = 48, stroke = 10, C = 2 * Math.PI * r;
    const pct = Math.min(100, Math.max(0, clamped));
    const offset = C - (pct / 100) * C;
    return (
      <svg width="140" height="140" viewBox="0 0 140 140">
        <g transform="translate(70,70)">
          <circle r={r} fill="none" stroke="#e5e7eb" strokeWidth={stroke} />
          <circle r={r} fill="none" stroke="#10b981" strokeWidth={stroke} strokeDasharray={`${C} ${C}`} strokeDashoffset={offset} transform="rotate(-90)" strokeLinecap="round" />
          <text x="0" y="6" textAnchor="middle" fontWeight="600" fontSize="20" fill="#111827">{value.toFixed(0)}%</text>
          <text x="0" y="26" textAnchor="middle" fontSize="11" fill="#6b7280">ROI</text>
        </g>
      </svg>
    );
  };

  const Stat = ({ label, value }) => (
    <div className="stat">
      <div className="lab">{label}</div>
      <div className="val">{value}</div>
    </div>
  );

  const disabled = mode === "analyze";

  return (
    <div className="irw">
      <div className="topbar">
        <h3 style={{fontWeight:700}}>Influencer ROI Calculator</h3>
        <div style={{display:"flex", gap:8}}>
          <button className={`chip ${mode==="plan"?"active":""}`} onClick={()=>setMode("plan")}>Plan</button>
          <button className={`chip ${mode==="analyze"?"active":""}`} onClick={()=>setMode("analyze")}>Analyze</button>
        </div>
      </div>

      <h1>Influencer ROI Calculator</h1>
      <div className="sub">Predict and justify influencer spend with simple levers.</div>

      <div className="grid">
        {/* FORM */}
        <div>
          <div className="card section">
            <h2>Campaign Setup</h2>
            <div className="controls triple">
              <div>
                <label>Pricing Model</label>
                <select value={model} onChange={(e)=>setModel(e.target.value)} disabled={false}>
                  <option>CPM</option><option>CPE</option><option>Flat</option>
                </select>
              </div>
              <div>
                <label>Rate ({model==="CPM"?"$ per 1,000 impressions":model==="CPE"?"$ per engagement":"Flat fee per post"})</label>
                <input type="number" value={rate} onChange={(e)=>setRate(parseFloat(e.target.value)||0)} min="0" />
                <div className="help">Adjust per your negotiation.</div>
              </div>
              <div className="controls duo">
                <div>
                  <label># Creators</label>
                  <input type="number" value={creators} onChange={(e)=>setCreators(parseInt(e.target.value)||0)} min="0" />
                </div>
                <div>
                  <label>Posts / Creator</label>
                  <input type="number" value={posts} onChange={(e)=>setPosts(parseInt(e.target.value)||0)} min="0" />
                </div>
              </div>
            </div>
          </div>

          <div className="card section">
            <h2>Delivery Estimates</h2>
            <div className="controls duo">
              <div>
                <label>{model==="CPE"?"Engagements per Post":"Impressions per Post"}</label>
                <input type="number" value={reachPerPost} onChange={(e)=>setReachPerPost(parseInt(e.target.value)||0)} min="0" />
              </div>
              <div>
                <label>Engagement Rate (%) {model==="CPE" ? "(used to infer impressions)" : ""}</label>
                <input type="number" value={engRate} onChange={(e)=>setEngRate(parseFloat(e.target.value)||0)} min="0" />
              </div>
            </div>
          </div>

          <div className="card section">
            <h2>Funnel Assumptions</h2>
            <div className="controls triple">
              <div>
                <label>CTR (%)</label>
                <input type="number" value={ctr} onChange={(e)=>setCtr(parseFloat(e.target.value)||0)} min="0" />
              </div>
              <div>
                <label>CVR (%)</label>
                <input type="number" value={cvr} onChange={(e)=>setCvr(parseFloat(e.target.value)||0)} min="0" />
              </div>
              <div>
                <label>AOV ($)</label>
                <input type="number" value={aov} onChange={(e)=>setAov(parseFloat(e.target.value)||0)} min="0" />
              </div>
            </div>
          </div>
        </div>

        {/* KPI PANEL */}
        <aside className="kpi">
          <div className="card">
            <div className="summary">
              <h2 style={{fontWeight:700}}>KPI Summary</h2>
              <span className="badge">Live</span>
            </div>
            <div className="donut"><Donut value={roi} /></div>
            <div className="help" style={{textAlign:"center"}}>ROI = (Revenue − Cost) / Cost</div>

            <div className="statgrid" style={{marginTop:12}}>
              <Stat label="Cost" value={`$${Math.round(cost).toLocaleString()}`} />
              <Stat label="Revenue" value={`$${Math.round(revenue).toLocaleString()}`} />
              <Stat label="Profit" value={`$${Math.round(profit).toLocaleString()}`} />
              <Stat label="Conversions" value={`${conversions.toLocaleString()}`} />
            </div>

            <div className="bar" style={{marginTop:12}}><span style={{width:`${Math.max(0,Math.min(100,roi))}%`}} /></div>

            <div className="statgrid" style={{marginTop:12}}>
              <div className="stat"><div className="lab">Eff. CPM</div><div className="val">${effCpm.toFixed(2)}</div></div>
              <div className="stat"><div className="lab">Eff. CPE</div><div className="val">${effCpe.toFixed(3)}</div></div>
              <div className="stat"><div className="lab">CPA</div><div className="val">${cpa.toFixed(2)}</div></div>
            </div>

            <div className="help" style={{marginTop:12}}>
              With {creators} creators × {posts} posts, expected {impressions.toLocaleString()} impressions, {engagements.toLocaleString()} engagements.
            </div>
          </div>
        </aside>
      </div>

      <footer>Mode: {mode === "plan" ? "Plan" : "Analyze"}</footer>
    </div>
  );
}
