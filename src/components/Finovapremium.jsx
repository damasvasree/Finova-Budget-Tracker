
import { useState, useEffect, useRef, useCallback } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadialBarChart, RadialBar,
} from "recharts";

/* ═══════════════════════════════════════════════════════════
   DESIGN SYSTEM
═══════════════════════════════════════════════════════════ */
const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap');
`;

const PALETTE = {
  indigo:  "#5B5BD6",
  violet:  "#8E4EC6",
  emerald: "#12A594",
  rose:    "#E54666",
  amber:   "#F76B15",
  sky:     "#0090FF",
};

function theme(dark) {
  return {
    bg:       dark ? "#08080F" : "#F2F1F8",
    panel:    dark ? "#0F0F1C" : "#FFFFFF",
    panel2:   dark ? "#15152A" : "#F7F6FD",
    border:   dark ? "#1F1F3A" : "#E4E2F4",
    text:     dark ? "#EEEEFF" : "#16163A",
    sub:      dark ? "#6B6A90" : "#8180A8",
    accent:   PALETTE.indigo,
    shadow:   dark ? "rgba(0,0,0,0.5)" : "rgba(91,91,214,0.08)",
  };
}

/* ═══════════════════════════════════════════════════════════
   STATIC DATA
═══════════════════════════════════════════════════════════ */
const CATS = [
  { id:"housing",    label:"Housing",      emoji:"🏠", color:"#5B5BD6", budget:1500 },
  { id:"food",       label:"Food",         emoji:"🍜", color:"#8E4EC6", budget:600  },
  { id:"transport",  label:"Transport",    emoji:"🚇", color:"#0090FF", budget:300  },
  { id:"utilities",  label:"Utilities",    emoji:"⚡", color:"#12A594", budget:200  },
  { id:"health",     label:"Health",       emoji:"💊", color:"#E54666", budget:200  },
  { id:"leisure",    label:"Leisure",      emoji:"🎮", color:"#F76B15", budget:300  },
  { id:"shopping",   label:"Shopping",     emoji:"🛍️", color:"#D6409F", budget:400  },
  { id:"education",  label:"Education",    emoji:"📚", color:"#3E63DD", budget:150  },
];

const getCat = id => CATS.find(c => c.id === id) || { label: id, emoji:"💰", color: PALETTE.indigo };

const INIT_TXS = [
  { id:1,  name:"Monthly Rent",        cat:"housing",   amount:1400, date:"2026-02-01", kind:"expense" },
  { id:2,  name:"Salary Deposit",      cat:"income",    amount:5800, date:"2026-02-01", kind:"income"  },
  { id:3,  name:"Whole Foods",         cat:"food",      amount:142,  date:"2026-02-03", kind:"expense" },
  { id:4,  name:"Uber Rides",          cat:"transport", amount:34,   date:"2026-02-04", kind:"expense" },
  { id:5,  name:"Netflix",             cat:"leisure",   amount:22,   date:"2026-02-05", kind:"expense" },
  { id:6,  name:"Electric Bill",       cat:"utilities", amount:94,   date:"2026-02-06", kind:"expense" },
  { id:7,  name:"Gym Membership",      cat:"health",    amount:49,   date:"2026-02-07", kind:"expense" },
  { id:8,  name:"Chipotle",            cat:"food",      amount:22,   date:"2026-02-08", kind:"expense" },
  { id:9,  name:"Amazon Purchase",     cat:"shopping",  amount:87,   date:"2026-02-09", kind:"expense" },
  { id:10, name:"Udemy Course",        cat:"education", amount:49,   date:"2026-02-10", kind:"expense" },
  { id:11, name:"Freelance Payment",   cat:"income",    amount:1200, date:"2026-02-11", kind:"income"  },
  { id:12, name:"Starbucks",           cat:"food",      amount:14,   date:"2026-02-12", kind:"expense" },
  { id:13, name:"Metro Card",          cat:"transport", amount:33,   date:"2026-02-13", kind:"expense" },
  { id:14, name:"Water Bill",          cat:"utilities", amount:38,   date:"2026-02-14", kind:"expense" },
  { id:15, name:"Zara",                cat:"shopping",  amount:128,  date:"2026-02-15", kind:"expense" },
  { id:16, name:"Doctor Visit",        cat:"health",    amount:80,   date:"2026-02-16", kind:"expense" },
  { id:17, name:"Cinema",              cat:"leisure",   amount:28,   date:"2026-02-17", kind:"expense" },
  { id:18, name:"Grocery Run",         cat:"food",      amount:98,   date:"2026-02-18", kind:"expense" },
  { id:19, name:"Gas Station",         cat:"transport", amount:61,   date:"2026-02-19", kind:"expense" },
  { id:20, name:"Spotify",             cat:"leisure",   amount:11,   date:"2026-02-20", kind:"expense" },
];

const TREND = [
  { month:"Aug", expenses:3200, income:6200, savings:3000 },
  { month:"Sep", expenses:3800, income:6500, savings:2700 },
  { month:"Oct", expenses:2900, income:7000, savings:4100 },
  { month:"Nov", expenses:4100, income:7000, savings:2900 },
  { month:"Dec", expenses:5100, income:7200, savings:2100 },
  { month:"Jan", expenses:3600, income:7000, savings:3400 },
  { month:"Feb", expenses:2759, income:7000, savings:4241 },
];

const DAILY = [
  { day:"Mon", amt:142 },{ day:"Tue", amt:89 },{ day:"Wed", amt:215 },
  { day:"Thu", amt:67 }, { day:"Fri", amt:318 },{ day:"Sat", amt:176 },
  { day:"Sun", amt:93 },
];

const AI_CARDS = [
  { type:"warn",    icon:"⚡", tag:"Overspend Risk",  title:"Food Budget Alert",       body:"You've used 46% of your food budget with 8 days remaining. Projected overspend: ~$140. Consider limiting dining-out to 2×/week." },
  { type:"success", icon:"🎯", tag:"Goal Progress",   title:"Savings On Track",        body:"At current velocity you'll hit your $10K emergency fund by April 2026 — 6 weeks ahead of plan. Excellent discipline!" },
  { type:"info",    icon:"🔍", tag:"Optimization",    title:"Subscription Audit",      body:"4 active subscriptions total $64/mo. Netflix + Spotify = $33. Switching to a family plan saves ~$14/month, or $168/year." },
  { type:"predict", icon:"🔮", tag:"AI Forecast",     title:"Month-End Projection",    body:"Based on 20 days of data, February will land at ~$2,750 total — your best month in 6 months and $1,750 under budget!" },
];

/* ═══════════════════════════════════════════════════════════
   GLOBAL CSS
═══════════════════════════════════════════════════════════ */
const GLOBAL_CSS = `
  ${FONTS}
  *, *::before, *::after { box-sizing: border-box; margin:0; padding:0; }
  body { font-family: 'DM Sans', sans-serif; }
  ::-webkit-scrollbar { width:5px; height:5px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:#5B5BD640; border-radius:99px; }
  input, select, button { font-family: inherit; }
  input[type=number]::-webkit-inner-spin-button { -webkit-appearance:none; }

  @keyframes fadeUp   { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
  @keyframes slideIn  { from { opacity:0; transform:translateX(-16px); } to { opacity:1; transform:translateX(0); } }
  @keyframes scaleIn  { from { opacity:0; transform:scale(0.94); } to { opacity:1; transform:scale(1); } }
  @keyframes shimmer  { 0% { background-position:200% 0; } 100% { background-position:-200% 0; } }
  @keyframes pulse    { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
  @keyframes bounce   { 0%,80%,100% { transform:scale(0); } 40% { transform:scale(1.0); } }
  @keyframes float    { 0%,100% { transform:translateY(0px); } 50% { transform:translateY(-6px); } }
  @keyframes spin     { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
  @keyframes barGrow  { from { width:0%; } to { width:var(--w); } }
  @keyframes countUp  { from { opacity:0; transform:translateY(4px); } to { opacity:1; transform:translateY(0); } }

  .fade-up        { animation: fadeUp   0.4s cubic-bezier(.22,1,.36,1) both; }
  .fade-in        { animation: fadeIn   0.3s ease both; }
  .scale-in       { animation: scaleIn  0.35s cubic-bezier(.22,1,.36,1) both; }
  .slide-in       { animation: slideIn  0.3s cubic-bezier(.22,1,.36,1) both; }

  .stagger-1 { animation-delay:0.05s; }
  .stagger-2 { animation-delay:0.10s; }
  .stagger-3 { animation-delay:0.15s; }
  .stagger-4 { animation-delay:0.20s; }
  .stagger-5 { animation-delay:0.25s; }
  .stagger-6 { animation-delay:0.30s; }
  .stagger-7 { animation-delay:0.35s; }
  .stagger-8 { animation-delay:0.40s; }

  .hover-lift { transition: transform 0.2s ease, box-shadow 0.2s ease; }
  .hover-lift:hover { transform:translateY(-2px); }

  .shimmer-bg {
    background: linear-gradient(90deg, transparent 25%, rgba(255,255,255,0.06) 50%, transparent 75%);
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
  }

  .nav-btn { transition: all 0.2s cubic-bezier(.22,1,.36,1); }
  .nav-btn:hover { transform: translateX(2px); }

  .tx-row { transition: background 0.15s ease; }

  .glow-accent { box-shadow: 0 0 20px #5B5BD630; }
  .glow-green  { box-shadow: 0 0 20px #12A59430; }

  .modal-overlay {
    animation: fadeIn 0.2s ease;
    backdrop-filter: blur(6px);
  }
  .modal-box {
    animation: scaleIn 0.3s cubic-bezier(.22,1,.36,1);
  }

  .progress-bar {
    animation: barGrow 1s cubic-bezier(.22,1,.36,1) both;
  }

  .theme-transition {
    transition: background 0.35s ease, color 0.35s ease, border-color 0.35s ease;
  }

  .dot-pulse {
    animation: pulse 2s ease infinite;
  }

  .float-icon {
    animation: float 3s ease-in-out infinite;
  }
`;

/* ═══════════════════════════════════════════════════════════
   UTILITIES
═══════════════════════════════════════════════════════════ */
const $  = (n, dec=0) => "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits:dec, maximumFractionDigits:dec });
const pct = (spent, budget) => Math.min(Math.round((spent/budget)*100), 100);

function useAnimatedNumber(target, duration=900) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = null;
    const from = 0;
    const tick = ts => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(from + (target - from) * ease));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target]);
  return val;
}

/* ═══════════════════════════════════════════════════════════
   CHART TOOLTIP
═══════════════════════════════════════════════════════════ */
function Tip({ active, payload, label, tk }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: tk.panel, border:`1px solid ${tk.border}`,
      borderRadius:14, padding:"12px 16px",
      boxShadow:`0 16px 40px ${tk.shadow}`,
      fontSize:12, color:tk.text,
    }}>
      <p style={{ color:tk.sub, fontWeight:700, marginBottom:8, fontSize:11, textTransform:"uppercase", letterSpacing:"0.06em" }}>{label}</p>
      {payload.map((p,i) => (
        <div key={i} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:i<payload.length-1?4:0 }}>
          <div style={{ width:8,height:8, borderRadius:"50%", background:p.color||p.fill }} />
          <span style={{ color:tk.sub }}>{p.name}</span>
          <span style={{ fontWeight:700, marginLeft:"auto", paddingLeft:16 }}>{$(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   STAT CARD
═══════════════════════════════════════════════════════════ */
function StatCard({ title, value, sub, subOk, icon, accentColor, tk, progress, delay=0, children }) {
  const numVal = parseFloat(String(value).replace(/[^0-9.]/g,"")) || 0;
  const animated = useAnimatedNumber(numVal);
  const displayVal = value.startsWith("$") ? $(animated) : String(animated);

  return (
    <div className={`hover-lift fade-up theme-transition`}
      style={{
        background: tk.panel, border:`1px solid ${tk.border}`,
        borderRadius:24, padding:"24px 26px",
        position:"relative", overflow:"hidden",
        animationDelay: `${delay}s`,
      }}>
      {/* Glow blob */}
      <div style={{
        position:"absolute", top:-24, right:-24,
        width:100, height:100, borderRadius:"50%",
        background: accentColor + "18",
        filter:"blur(20px)",
      }} />
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
        <span style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", color:tk.sub }}>
          {title}
        </span>
        <div style={{
          width:36, height:36, borderRadius:11,
          background: accentColor+"1E",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:17,
        }}>{icon}</div>
      </div>
      <div style={{ fontSize:28, fontWeight:800, color:tk.text, letterSpacing:"-0.04em", fontFamily:"Syne, sans-serif", marginBottom:8 }}>
        {displayVal}
      </div>
      {sub && (
        <div style={{ fontSize:12, color: subOk ? "#12A594" : tk.sub, display:"flex", alignItems:"center", gap:4 }}>
          {sub}
        </div>
      )}
      {progress !== undefined && (
        <div style={{ marginTop:14 }}>
          <div style={{ height:5, borderRadius:99, background: tk.border, overflow:"hidden" }}>
            <div className="progress-bar" style={{
              height:"100%", borderRadius:99,
              background: `linear-gradient(90deg, ${accentColor}, ${accentColor}99)`,
              "--w": `${Math.min(progress,100)}%`,
            }} />
          </div>
        </div>
      )}
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ADD TRANSACTION MODAL
═══════════════════════════════════════════════════════════ */
function AddModal({ onClose, onAdd, tk }) {
  const [form, setForm] = useState({
    name:"", amount:"", cat:"food",
    date: new Date().toISOString().split("T")[0],
    kind:"expense",
  });
  const s = (k,v) => setForm(f => ({...f,[k]:v}));

  const submit = () => {
    if (!form.name.trim() || !form.amount) return;
    onAdd({ ...form, id: Date.now(), amount: parseFloat(form.amount) });
    onClose();
  };

  const inputStyle = {
    width:"100%", padding:"11px 14px",
    borderRadius:12, border:`1.5px solid ${tk.border}`,
    background: tk.panel2, color: tk.text,
    fontSize:13, outline:"none",
    transition:"border-color 0.2s",
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{
      position:"fixed", inset:0,
      background:"rgba(0,0,0,0.55)",
      zIndex:200, display:"flex",
      alignItems:"center", justifyContent:"center",
    }}>
      <div className="modal-box" onClick={e => e.stopPropagation()} style={{
        background:tk.panel, border:`1px solid ${tk.border}`,
        borderRadius:28, padding:"32px 36px",
        width:480, maxWidth:"92vw",
        boxShadow:`0 40px 100px rgba(0,0,0,0.3)`,
      }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:26 }}>
          <div>
            <h2 style={{ fontSize:20, fontWeight:800, color:tk.text, fontFamily:"Syne,sans-serif" }}>New Transaction</h2>
            <p style={{ fontSize:12, color:tk.sub, marginTop:3 }}>Record an expense or income entry</p>
          </div>
          <button onClick={onClose} style={{
            width:32, height:32, borderRadius:99,
            border:`1px solid ${tk.border}`, background:"transparent",
            cursor:"pointer", color:tk.sub, fontSize:18,
            display:"flex", alignItems:"center", justifyContent:"center",
            transition:"all 0.2s",
          }}>×</button>
        </div>

        {/* Kind Toggle */}
        <div style={{ display:"flex", gap:6, padding:4, background:tk.panel2, borderRadius:14, marginBottom:22 }}>
          {[["expense","💸 Expense"], ["income","💰 Income"]].map(([k, label]) => (
            <button key={k} onClick={() => s("kind",k)} style={{
              flex:1, padding:"9px 0", borderRadius:11, border:"none",
              cursor:"pointer", fontSize:13, fontWeight:700,
              transition:"all 0.25s cubic-bezier(.22,1,.36,1)",
              background: form.kind===k
                ? (k==="expense" ? PALETTE.rose : PALETTE.emerald)
                : "transparent",
              color: form.kind===k ? "#fff" : tk.sub,
              boxShadow: form.kind===k ? `0 4px 14px ${(k==="expense"?PALETTE.rose:PALETTE.emerald)}40` : "none",
            }}>{label}</button>
          ))}
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          <div style={{ gridColumn:"1/-1" }}>
            <label style={{ fontSize:11, fontWeight:700, color:tk.sub, textTransform:"uppercase", letterSpacing:"0.08em", display:"block", marginBottom:6 }}>Description</label>
            <input style={inputStyle} value={form.name} onChange={e=>s("name",e.target.value)}
              placeholder="e.g. Grocery shopping"
              onFocus={e=>e.target.style.borderColor=PALETTE.indigo}
              onBlur={e=>e.target.style.borderColor=tk.border} />
          </div>
          <div>
            <label style={{ fontSize:11, fontWeight:700, color:tk.sub, textTransform:"uppercase", letterSpacing:"0.08em", display:"block", marginBottom:6 }}>Amount ($)</label>
            <input style={inputStyle} type="number" value={form.amount}
              onChange={e=>s("amount",e.target.value)} placeholder="0.00"
              onFocus={e=>e.target.style.borderColor=PALETTE.indigo}
              onBlur={e=>e.target.style.borderColor=tk.border} />
          </div>
          <div>
            <label style={{ fontSize:11, fontWeight:700, color:tk.sub, textTransform:"uppercase", letterSpacing:"0.08em", display:"block", marginBottom:6 }}>Date</label>
            <input style={inputStyle} type="date" value={form.date}
              onChange={e=>s("date",e.target.value)}
              onFocus={e=>e.target.style.borderColor=PALETTE.indigo}
              onBlur={e=>e.target.style.borderColor=tk.border} />
          </div>
          {form.kind==="expense" && (
            <div style={{ gridColumn:"1/-1" }}>
              <label style={{ fontSize:11, fontWeight:700, color:tk.sub, textTransform:"uppercase", letterSpacing:"0.08em", display:"block", marginBottom:8 }}>Category</label>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8 }}>
                {CATS.map(c => (
                  <button key={c.id} onClick={()=>s("cat",c.id)} style={{
                    padding:"9px 6px", borderRadius:12,
                    border: `1.5px solid ${form.cat===c.id ? c.color : tk.border}`,
                    background: form.cat===c.id ? c.color+"1A" : "transparent",
                    cursor:"pointer", fontSize:11, fontWeight:700,
                    color: form.cat===c.id ? c.color : tk.sub,
                    display:"flex", flexDirection:"column", alignItems:"center", gap:4,
                    transition:"all 0.15s",
                  }}>
                    <span style={{ fontSize:18 }}>{c.emoji}</span>
                    <span>{c.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ display:"flex", gap:10, marginTop:26 }}>
          <button onClick={onClose} style={{
            flex:1, padding:"13px 0", borderRadius:14,
            border:`1.5px solid ${tk.border}`, background:"transparent",
            cursor:"pointer", color:tk.sub, fontWeight:700, fontSize:13,
            transition:"all 0.2s",
          }}>Cancel</button>
          <button onClick={submit} style={{
            flex:2, padding:"13px 0", borderRadius:14, border:"none",
            background:"linear-gradient(135deg, #5B5BD6, #8E4EC6)",
            cursor:"pointer", color:"#fff", fontWeight:700, fontSize:13,
            boxShadow:"0 6px 20px #5B5BD650",
            transition:"transform 0.2s",
          }}
            onMouseEnter={e=>e.currentTarget.style.transform="translateY(-1px)"}
            onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}
          >+ Add Transaction</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   DASHBOARD PAGE
═══════════════════════════════════════════════════════════ */
function Dashboard({ txs, tk }) {
  const expenses = txs.filter(t=>t.kind==="expense");
  const income   = txs.filter(t=>t.kind==="income");
  const totalExp = expenses.reduce((s,t)=>s+t.amount,0);
  const totalInc = income.reduce((s,t)=>s+t.amount,0);
  const totalBudget = CATS.reduce((s,c)=>s+c.budget,0);
  const savings  = Math.max(totalInc-totalExp,0);
  const budgetLeft = Math.max(totalBudget-totalExp,0);
  const animBudgetPct = useAnimatedNumber(pct(totalExp,totalBudget));

  const catBreakdown = CATS.map(c => {
    const spent = expenses.filter(t=>t.cat===c.id).reduce((s,t)=>s+t.amount,0);
    return { ...c, spent, pct:pct(spent,c.budget) };
  }).sort((a,b)=>b.spent-a.spent);

  const pieData = catBreakdown.filter(c=>c.spent>0).map(c=>({ name:c.label, value:c.spent, color:c.color }));
  const recent  = [...txs].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,5);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:24 }}>

      {/* Hero Banner */}
      <div className="fade-up" style={{
        borderRadius:28, padding:"30px 36px",
        background:"linear-gradient(135deg, #5B5BD6 0%, #8E4EC6 60%, #A855F7 100%)",
        position:"relative", overflow:"hidden",
      }}>
        <div style={{ position:"absolute", top:-50, right:-50, width:200, height:200, borderRadius:"50%", background:"rgba(255,255,255,0.07)" }} />
        <div style={{ position:"absolute", bottom:-40, right:120, width:130, height:130, borderRadius:"50%", background:"rgba(255,255,255,0.04)" }} />
        <div style={{ position:"absolute", top:20, right:240, width:60, height:60, borderRadius:"50%", background:"rgba(255,255,255,0.06)" }} />

        <p style={{ color:"rgba(255,255,255,0.65)", fontSize:12, fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:8 }}>
          February 2026 · Monthly Overview
        </p>
        <div style={{ display:"flex", alignItems:"flex-end", gap:16, flexWrap:"wrap" }}>
          <div>
            <h1 style={{ fontSize:42, fontWeight:900, color:"#fff", letterSpacing:"-0.05em", fontFamily:"Syne,sans-serif", lineHeight:1 }}>
              {$(totalExp)}
            </h1>
            <p style={{ color:"rgba(255,255,255,0.55)", fontSize:13, marginTop:6 }}>spent of {$(totalBudget)} monthly budget</p>
          </div>
          <div style={{ marginLeft:"auto", display:"flex", gap:32 }}>
            {[
              { l:"Income",  v:$(totalInc), icon:"↑" },
              { l:"Savings", v:$(savings),  icon:"🏦" },
              { l:"Budget%", v:`${animBudgetPct}%`, icon:"📊" },
            ].map(item => (
              <div key={item.l}>
                <p style={{ color:"rgba(255,255,255,0.5)", fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em" }}>{item.l}</p>
                <p style={{ color:"#fff", fontSize:18, fontWeight:800, marginTop:4, fontFamily:"Syne,sans-serif" }}>{item.icon} {item.v}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mini progress */}
        <div style={{ marginTop:22 }}>
          <div style={{ height:6, borderRadius:99, background:"rgba(255,255,255,0.15)", overflow:"hidden" }}>
            <div className="progress-bar" style={{ height:"100%", borderRadius:99, background:"rgba(255,255,255,0.75)", "--w":`${pct(totalExp,totalBudget)}%` }} />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
        <StatCard title="Total Expenses" value={$(totalExp)} icon="💸"
          sub={<>▼ 12.4% vs last month</>} subOk
          accentColor={PALETTE.rose} tk={tk} delay={0.05}
          progress={pct(totalExp,totalBudget)} />
        <StatCard title="Budget Left" value={$(budgetLeft)} icon="🎯"
          sub={`${$(totalExp)} used of ${$(totalBudget)}`}
          accentColor={PALETTE.indigo} tk={tk} delay={0.10}
          progress={pct(budgetLeft,totalBudget)} />
        <StatCard title="Net Savings" value={$(savings)} icon="💰"
          sub={<>▲ +{$(savings-3200)} vs Aug</>} subOk
          accentColor={PALETTE.emerald} tk={tk} delay={0.15} />
        <StatCard title="Total Income" value={$(totalInc)} icon="📈"
          sub="Salary + Freelance"
          accentColor={PALETTE.violet} tk={tk} delay={0.20} />
      </div>

      {/* Charts Row */}
      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:20 }}>
        {/* Trend Chart */}
        <div className="fade-up stagger-5 theme-transition hover-lift" style={{
          background:tk.panel, border:`1px solid ${tk.border}`,
          borderRadius:24, padding:28,
        }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:22 }}>
            <div>
              <h3 style={{ fontSize:15, fontWeight:800, color:tk.text, fontFamily:"Syne,sans-serif" }}>Income vs Expenses</h3>
              <p style={{ fontSize:12, color:tk.sub, marginTop:3 }}>7-month financial trend</p>
            </div>
            <div style={{ display:"flex", gap:16 }}>
              {[["Income","#12A594"],["Expenses","#E54666"],["Savings","#5B5BD6"]].map(([l,c])=>(
                <div key={l} style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <div style={{ width:8,height:8, borderRadius:2, background:c }} />
                  <span style={{ fontSize:11, color:tk.sub }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ height:210 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TREND} margin={{ top:5,right:5,left:-22,bottom:0 }}>
                <defs>
                  {[["ig","#12A594"],["eg","#E54666"],["sg","#5B5BD6"]].map(([id,col])=>(
                    <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={col} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={col} stopOpacity={0}   />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
                <XAxis dataKey="month" tick={{ fontSize:11,fill:tk.sub }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:11,fill:tk.sub }} axisLine={false} tickLine={false} />
                <Tooltip content={<Tip tk={tk}/>} />
                <Area type="monotone" dataKey="income"   name="Income"   stroke="#12A594" strokeWidth={2} fill="url(#ig)" />
                <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#E54666" strokeWidth={2} fill="url(#eg)" />
                <Area type="monotone" dataKey="savings"  name="Savings"  stroke="#5B5BD6" strokeWidth={2} fill="url(#sg)" dot={{ r:4, fill:"#5B5BD6", strokeWidth:2, stroke:"#fff" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie */}
        <div className="fade-up stagger-6 theme-transition hover-lift" style={{
          background:tk.panel, border:`1px solid ${tk.border}`,
          borderRadius:24, padding:28,
        }}>
          <h3 style={{ fontSize:15, fontWeight:800, color:tk.text, fontFamily:"Syne,sans-serif", marginBottom:3 }}>By Category</h3>
          <p style={{ fontSize:12, color:tk.sub, marginBottom:16 }}>Feb spend split</p>
          <div style={{ height:150 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={42} outerRadius={68} paddingAngle={3} dataKey="value" strokeWidth={0}>
                  {pieData.map((e,i)=><Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip content={<Tip tk={tk}/>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:6, marginTop:8 }}>
            {catBreakdown.filter(c=>c.spent>0).slice(0,4).map(c=>(
              <div key={c.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                  <div style={{ width:8,height:8, borderRadius:"50%", background:c.color, flexShrink:0 }} />
                  <span style={{ fontSize:11, color:tk.sub }}>{c.label}</span>
                </div>
                <span style={{ fontSize:11, fontWeight:700, color:tk.text }}>{$(c.spent)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{ display:"grid", gridTemplateColumns:"3fr 2fr", gap:20 }}>
        {/* Recent Transactions */}
        <div className="fade-up stagger-7 theme-transition" style={{
          background:tk.panel, border:`1px solid ${tk.border}`,
          borderRadius:24, overflow:"hidden",
        }}>
          <div style={{ padding:"22px 26px 18px", borderBottom:`1px solid ${tk.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <h3 style={{ fontSize:15, fontWeight:800, color:tk.text, fontFamily:"Syne,sans-serif" }}>Recent Transactions</h3>
              <p style={{ fontSize:12, color:tk.sub, marginTop:2 }}>Latest financial activity</p>
            </div>
          </div>
          {recent.map((tx,i) => {
            const cat = tx.kind==="income" ? { emoji:"💼", color:PALETTE.emerald, label:"Income" } : getCat(tx.cat);
            return (
              <div key={tx.id} className="tx-row" style={{
                display:"flex", alignItems:"center", gap:14,
                padding:"14px 26px",
                borderBottom: i<recent.length-1 ? `1px solid ${tk.border}` : "none",
              }}
                onMouseEnter={e=>e.currentTarget.style.background=tk.panel2}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <div style={{ width:40,height:40, borderRadius:14, background:cat.color+"18", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{cat.emoji}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontSize:13, fontWeight:700, color:tk.text, margin:0, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{tx.name}</p>
                  <p style={{ fontSize:11, color:tk.sub, marginTop:2 }}>{cat.label} · {tx.date}</p>
                </div>
                <span style={{ fontSize:14, fontWeight:800, color: tx.kind==="income" ? PALETTE.emerald : tk.text, flexShrink:0 }}>
                  {tx.kind==="income" ? "+" : "−"}{$(tx.amount,2)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Budget Progress */}
        <div className="fade-up stagger-8 theme-transition" style={{
          background:tk.panel, border:`1px solid ${tk.border}`,
          borderRadius:24, padding:26,
        }}>
          <h3 style={{ fontSize:15, fontWeight:800, color:tk.text, fontFamily:"Syne,sans-serif", marginBottom:3 }}>Budget Status</h3>
          <p style={{ fontSize:12, color:tk.sub, marginBottom:20 }}>Spent vs allocated</p>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {catBreakdown.slice(0,6).map(cat=>(
              <div key={cat.id}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                    <span>{cat.emoji}</span>
                    <span style={{ fontSize:12, fontWeight:600, color:tk.text }}>{cat.label}</span>
                  </div>
                  <span style={{ fontSize:11, fontWeight:700, color: cat.pct>=90 ? PALETTE.rose : tk.text }}>
                    {$(cat.spent)} <span style={{ color:tk.sub, fontWeight:400 }}>/ {$(cat.budget)}</span>
                  </span>
                </div>
                <div style={{ height:5, borderRadius:99, background:tk.border, overflow:"hidden" }}>
                  <div className="progress-bar" style={{
                    height:"100%", borderRadius:99,
                    background: cat.pct>=90 ? PALETTE.rose : cat.pct>=70 ? PALETTE.amber : cat.color,
                    "--w":`${cat.pct}%`,
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   EXPENSE TRACKER PAGE
═══════════════════════════════════════════════════════════ */
function Tracker({ txs, onDelete, tk }) {
  const [search, setSearch] = useState("");
  const [filterKind, setFilterKind] = useState("all");
  const [filterCat, setFilterCat] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  const filtered = txs
    .filter(tx => filterKind==="all" || tx.kind===filterKind)
    .filter(tx => filterCat==="all"  || tx.cat===filterCat)
    .filter(tx => tx.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a,b) => sortBy==="date" ? new Date(b.date)-new Date(a.date)
                 : sortBy==="amount" ? b.amount-a.amount
                 : a.name.localeCompare(b.name));

  const totExp = filtered.filter(t=>t.kind==="expense").reduce((s,t)=>s+t.amount,0);
  const totInc = filtered.filter(t=>t.kind==="income").reduce((s,t)=>s+t.amount,0);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div className="fade-up" style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div>
          <h2 style={{ fontSize:24, fontWeight:900, color:tk.text, letterSpacing:"-0.04em", fontFamily:"Syne,sans-serif" }}>Transactions</h2>
          <p style={{ fontSize:13, color:tk.sub, marginTop:4 }}>{filtered.length} entries</p>
        </div>
        <div style={{ display:"flex", gap:24 }}>
          <div style={{ textAlign:"right" }}>
            <p style={{ fontSize:11, color:tk.sub }}>Filtered Expenses</p>
            <p style={{ fontSize:18, fontWeight:800, color:PALETTE.rose, fontFamily:"Syne,sans-serif" }}>{$(totExp,2)}</p>
          </div>
          <div style={{ textAlign:"right" }}>
            <p style={{ fontSize:11, color:tk.sub }}>Filtered Income</p>
            <p style={{ fontSize:18, fontWeight:800, color:PALETTE.emerald, fontFamily:"Syne,sans-serif" }}>{$(totInc,2)}</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="fade-up stagger-1 theme-transition" style={{
        background:tk.panel, border:`1px solid ${tk.border}`,
        borderRadius:18, padding:"16px 20px",
        display:"flex", gap:12, flexWrap:"wrap", alignItems:"center",
      }}>
        <div style={{ flex:"1 1 200px", position:"relative" }}>
          <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", fontSize:14, color:tk.sub }}>⌕</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search transactions..."
            style={{
              width:"100%", padding:"9px 12px 9px 34px",
              borderRadius:10, border:`1.5px solid ${tk.border}`,
              background:tk.panel2, color:tk.text, fontSize:13, outline:"none",
            }} />
        </div>

        <div style={{ display:"flex", gap:6 }}>
          {[["all","All"],["expense","Expenses"],["income","Income"]].map(([v,l])=>(
            <button key={v} onClick={()=>setFilterKind(v)} style={{
              padding:"8px 14px", borderRadius:20,
              border:`1.5px solid ${filterKind===v ? PALETTE.indigo : tk.border}`,
              background: filterKind===v ? PALETTE.indigo+"1A" : "transparent",
              cursor:"pointer", fontSize:12, fontWeight:600,
              color: filterKind===v ? PALETTE.indigo : tk.sub,
              transition:"all 0.2s",
            }}>{l}</button>
          ))}
        </div>

        <select value={filterCat} onChange={e=>setFilterCat(e.target.value)} style={{
          padding:"9px 14px", borderRadius:10,
          border:`1.5px solid ${tk.border}`, background:tk.panel2,
          color:tk.text, fontSize:12, outline:"none", cursor:"pointer",
        }}>
          <option value="all">All Categories</option>
          {CATS.map(c=><option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
        </select>

        <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{
          padding:"9px 14px", borderRadius:10,
          border:`1.5px solid ${tk.border}`, background:tk.panel2,
          color:tk.text, fontSize:12, outline:"none", cursor:"pointer",
        }}>
          <option value="date">Sort: Date</option>
          <option value="amount">Sort: Amount</option>
          <option value="name">Sort: Name</option>
        </select>
      </div>

      {/* Table */}
      <div className="fade-up stagger-2 theme-transition" style={{
        background:tk.panel, border:`1px solid ${tk.border}`,
        borderRadius:22, overflow:"hidden",
      }}>
        {/* Header */}
        <div style={{
          display:"grid", gridTemplateColumns:"3fr 1.5fr 1fr 1.2fr 40px",
          padding:"12px 24px", borderBottom:`1px solid ${tk.border}`,
          background: tk.panel2,
        }}>
          {["Description","Category","Date","Amount",""].map((h,i)=>(
            <span key={i} style={{ fontSize:11,fontWeight:700,color:tk.sub,textTransform:"uppercase",letterSpacing:"0.08em" }}>{h}</span>
          ))}
        </div>

        {filtered.length===0 ? (
          <div style={{ padding:"64px 24px", textAlign:"center" }}>
            <div className="float-icon" style={{ fontSize:48, marginBottom:14 }}>📭</div>
            <p style={{ fontWeight:800, color:tk.text, fontSize:16, fontFamily:"Syne,sans-serif" }}>No transactions found</p>
            <p style={{ color:tk.sub, fontSize:13, marginTop:6 }}>Try adjusting your filters</p>
          </div>
        ) : filtered.map((tx,i) => {
          const cat = tx.kind==="income" ? { emoji:"💼", color:PALETTE.emerald, label:"Income" } : getCat(tx.cat);
          return (
            <div key={tx.id} className="tx-row" style={{
              display:"grid", gridTemplateColumns:"3fr 1.5fr 1fr 1.2fr 40px",
              padding:"13px 24px", borderBottom: i<filtered.length-1 ? `1px solid ${tk.border}` : "none",
              alignItems:"center",
            }}
              onMouseEnter={e=>e.currentTarget.style.background=tk.panel2}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:38,height:38, borderRadius:12, background:cat.color+"18", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, flexShrink:0 }}>{cat.emoji}</div>
                <p style={{ fontSize:13, fontWeight:700, color:tk.text, margin:0 }}>{tx.name}</p>
              </div>
              <span style={{ padding:"4px 12px", borderRadius:99, background:cat.color+"1A", color:cat.color, fontSize:11, fontWeight:700, display:"inline-block", width:"fit-content" }}>{cat.label}</span>
              <span style={{ fontSize:12, color:tk.sub }}>{tx.date}</span>
              <span style={{ fontSize:14, fontWeight:800, color: tx.kind==="income" ? PALETTE.emerald : tk.text }}>
                {tx.kind==="income" ? "+" : "−"}{$(tx.amount,2)}
              </span>
              <button onClick={()=>onDelete(tx.id)} style={{
                width:28,height:28, borderRadius:8, border:"none",
                background:"transparent", cursor:"pointer", color:tk.sub,
                fontSize:16, display:"flex", alignItems:"center", justifyContent:"center",
                transition:"all 0.15s",
              }}
                onMouseEnter={e=>{ e.currentTarget.style.background=PALETTE.rose+"18"; e.currentTarget.style.color=PALETTE.rose; }}
                onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; e.currentTarget.style.color=tk.sub; }}>
                ×
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ANALYTICS PAGE
═══════════════════════════════════════════════════════════ */
function Analytics({ txs, tk }) {
  const expenses = txs.filter(t=>t.kind==="expense");
  const catData = CATS.map(c => {
    const spent = expenses.filter(t=>t.cat===c.id).reduce((s,t)=>s+t.amount,0);
    return { name:c.label, spent, budget:c.budget, fill:c.color };
  }).sort((a,b)=>b.spent-a.spent);

  const totalSpent = expenses.reduce((s,t)=>s+t.amount,0);
  const avgDaily   = Math.round(totalSpent / 20);
  const avgWeekly  = Math.round(totalSpent / 4);
  const maxTx      = Math.max(...expenses.map(t=>t.amount));
  const topCat     = catData[0];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div className="fade-up">
        <h2 style={{ fontSize:24, fontWeight:900, color:tk.text, letterSpacing:"-0.04em", fontFamily:"Syne,sans-serif" }}>Analytics</h2>
        <p style={{ fontSize:13, color:tk.sub, marginTop:4 }}>Deep-dive into your spending patterns</p>
      </div>

      {/* KPI Row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
        {[
          { title:"Daily Average",   val:$(avgDaily),   icon:"📅", color:PALETTE.indigo },
          { title:"Weekly Average",  val:$(avgWeekly),  icon:"📊", color:PALETTE.violet },
          { title:"Largest Expense", val:$(maxTx),      icon:"💸", color:PALETTE.rose   },
          { title:"Top Category",    val:topCat?.name,  icon:CATS.find(c=>c.label===topCat?.name)?.emoji||"🏆", color:PALETTE.amber  },
        ].map((item,i)=>(
          <div key={i} className={`fade-up stagger-${i+1} hover-lift theme-transition`} style={{
            background:tk.panel, border:`1px solid ${tk.border}`,
            borderRadius:20, padding:"20px 22px",
          }}>
            <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:10 }}>
              <span style={{ fontSize:22 }}>{item.icon}</span>
              <span style={{ fontSize:11, fontWeight:700, color:tk.sub, textTransform:"uppercase", letterSpacing:"0.08em" }}>{item.title}</span>
            </div>
            <p style={{ fontSize:24, fontWeight:900, color:item.color, letterSpacing:"-0.04em", fontFamily:"Syne,sans-serif" }}>{item.val}</p>
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        {/* Bar: Spent vs Budget */}
        <div className="fade-up stagger-5 theme-transition hover-lift" style={{
          background:tk.panel, border:`1px solid ${tk.border}`,
          borderRadius:24, padding:28,
        }}>
          <h3 style={{ fontSize:15, fontWeight:800, color:tk.text, fontFamily:"Syne,sans-serif", marginBottom:4 }}>Spent vs Budget</h3>
          <p style={{ fontSize:12, color:tk.sub, marginBottom:20 }}>Category comparison</p>
          <div style={{ height:230 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={catData} margin={{ top:0,right:5,left:-18,bottom:0 }} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
                <XAxis dataKey="name" tick={{ fontSize:9, fill:tk.sub }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:10, fill:tk.sub }} axisLine={false} tickLine={false} />
                <Tooltip content={<Tip tk={tk}/>} />
                <Bar dataKey="budget" name="Budget" fill={tk.border} radius={[5,5,0,0]} />
                <Bar dataKey="spent"  name="Spent"  radius={[5,5,0,0]}>
                  {catData.map((e,i)=><Cell key={i} fill={e.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line: Daily Spend */}
        <div className="fade-up stagger-6 theme-transition hover-lift" style={{
          background:tk.panel, border:`1px solid ${tk.border}`,
          borderRadius:24, padding:28,
        }}>
          <h3 style={{ fontSize:15, fontWeight:800, color:tk.text, fontFamily:"Syne,sans-serif", marginBottom:4 }}>Daily Spend This Week</h3>
          <p style={{ fontSize:12, color:tk.sub, marginBottom:20 }}>Mon–Sun pattern</p>
          <div style={{ height:230 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={DAILY} margin={{ top:5,right:5,left:-18,bottom:0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
                <XAxis dataKey="day" tick={{ fontSize:11, fill:tk.sub }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:10, fill:tk.sub }} axisLine={false} tickLine={false} />
                <Tooltip content={<Tip tk={tk}/>} />
                <Line type="monotone" dataKey="amt" name="Spent" stroke={PALETTE.indigo} strokeWidth={3}
                  dot={{ fill:PALETTE.indigo, r:5, strokeWidth:2.5, stroke:"#fff" }}
                  activeDot={{ r:7, fill:PALETTE.indigo }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Full Trend */}
      <div className="fade-up stagger-7 theme-transition hover-lift" style={{
        background:tk.panel, border:`1px solid ${tk.border}`,
        borderRadius:24, padding:28,
      }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:20 }}>
          <div>
            <h3 style={{ fontSize:15, fontWeight:800, color:tk.text, fontFamily:"Syne,sans-serif" }}>Savings Growth Trend</h3>
            <p style={{ fontSize:12, color:tk.sub, marginTop:3 }}>6-month trajectory</p>
          </div>
          <div style={{
            padding:"6px 14px", borderRadius:99,
            background: PALETTE.emerald+"1A", color: PALETTE.emerald,
            fontSize:12, fontWeight:700,
          }}>↑ +41% since Aug</div>
        </div>
        <div style={{ height:180 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={TREND} margin={{ top:5,right:5,left:-18,bottom:0 }}>
              <defs>
                <linearGradient id="savG3" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={PALETTE.emerald} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={PALETTE.emerald} stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
              <XAxis dataKey="month" tick={{ fontSize:11, fill:tk.sub }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:11, fill:tk.sub }} axisLine={false} tickLine={false} />
              <Tooltip content={<Tip tk={tk}/>} />
              <Area type="monotone" dataKey="savings" name="Savings" stroke={PALETTE.emerald} strokeWidth={2.5} fill="url(#savG3)"
                dot={{ fill:PALETTE.emerald, r:4, strokeWidth:2, stroke:"#fff" }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   BUDGET PLANNER PAGE
═══════════════════════════════════════════════════════════ */
function Budget({ txs, tk }) {
  const [budgets, setBudgets] = useState(Object.fromEntries(CATS.map(c=>[c.id, c.budget])));
  const [editing, setEditing] = useState(null);
  const expenses = txs.filter(t=>t.kind==="expense");

  const cats = CATS.map(c => {
    const spent   = expenses.filter(t=>t.cat===c.id).reduce((s,t)=>s+t.amount,0);
    const budget  = budgets[c.id];
    const p       = budget > 0 ? Math.min(Math.round((spent/budget)*100), 100) : 0;
    const status  = p>=100 ? "over" : p>=80 ? "warn" : "ok";
    return { ...c, budget, spent, pct:p, status, remaining: budget-spent };
  });

  const totalBudget = Object.values(budgets).reduce((s,v)=>s+v,0);
  const totalSpent  = cats.reduce((s,c)=>s+c.spent,0);
  const overallPct  = pct(totalSpent, totalBudget);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div className="fade-up" style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
        <div>
          <h2 style={{ fontSize:24, fontWeight:900, color:tk.text, letterSpacing:"-0.04em", fontFamily:"Syne,sans-serif" }}>Budget Planner</h2>
          <p style={{ fontSize:13, color:tk.sub, marginTop:4 }}>Click any budget amount to edit it inline</p>
        </div>
        <div style={{ display:"flex", gap:24 }}>
          <div style={{ textAlign:"right" }}>
            <p style={{ fontSize:11, color:tk.sub }}>Total Budget</p>
            <p style={{ fontSize:20, fontWeight:900, color:PALETTE.indigo, fontFamily:"Syne,sans-serif" }}>{$(totalBudget)}</p>
          </div>
          <div style={{ textAlign:"right" }}>
            <p style={{ fontSize:11, color:tk.sub }}>Total Spent</p>
            <p style={{ fontSize:20, fontWeight:900, color:PALETTE.rose, fontFamily:"Syne,sans-serif" }}>{$(totalSpent)}</p>
          </div>
        </div>
      </div>

      {/* Overall Bar */}
      <div className="fade-up stagger-1 theme-transition" style={{
        background: "linear-gradient(135deg, #5B5BD6, #8E4EC6)",
        borderRadius:22, padding:"24px 28px",
        position:"relative", overflow:"hidden",
      }}>
        <div style={{ position:"absolute", top:-30, right:-30, width:120, height:120, borderRadius:"50%", background:"rgba(255,255,255,0.06)" }} />
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
          <div>
            <p style={{ color:"rgba(255,255,255,0.6)", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em" }}>Overall Utilization</p>
            <p style={{ color:"#fff", fontSize:32, fontWeight:900, fontFamily:"Syne,sans-serif", marginTop:4 }}>{overallPct}%</p>
          </div>
          <div style={{ textAlign:"right" }}>
            <p style={{ color:"rgba(255,255,255,0.6)", fontSize:12 }}>Remaining</p>
            <p style={{ color:"#fff", fontSize:22, fontWeight:800, fontFamily:"Syne,sans-serif" }}>{$(Math.max(totalBudget-totalSpent,0))}</p>
          </div>
        </div>
        <div style={{ height:10, borderRadius:99, background:"rgba(255,255,255,0.15)", overflow:"hidden" }}>
          <div className="progress-bar" style={{ height:"100%", borderRadius:99, background:"rgba(255,255,255,0.9)", "--w":`${overallPct}%` }} />
        </div>
      </div>

      {/* Category Grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(310px,1fr))", gap:16 }}>
        {cats.map((cat,i) => (
          <div key={cat.id} className={`fade-up hover-lift theme-transition stagger-${(i%8)+1}`} style={{
            background:tk.panel,
            border:`1.5px solid ${cat.status==="over" ? PALETTE.rose+"50" : cat.status==="warn" ? PALETTE.amber+"40" : tk.border}`,
            borderRadius:22, padding:24,
            transition:"all 0.2s ease",
          }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:46,height:46, borderRadius:15, background:cat.color+"1E", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>{cat.emoji}</div>
                <div>
                  <p style={{ fontSize:14, fontWeight:800, color:tk.text, margin:0, fontFamily:"Syne,sans-serif" }}>{cat.label}</p>
                  <p style={{ fontSize:11, margin:"3px 0 0", color:cat.status==="over" ? PALETTE.rose : cat.status==="warn" ? PALETTE.amber : PALETTE.emerald, fontWeight:600 }}>
                    {cat.status==="over" ? "⚠ Over budget" : cat.status==="warn" ? "⚡ Near limit" : "✓ On track"}
                  </p>
                </div>
              </div>
              <div style={{ textAlign:"right" }}>
                {editing===cat.id ? (
                  <input autoFocus defaultValue={cat.budget} type="number"
                    onBlur={e=>{ setBudgets(b=>({...b,[cat.id]:+e.target.value})); setEditing(null); }}
                    onKeyDown={e=>e.key==="Enter"&&e.target.blur()}
                    style={{ width:90, textAlign:"right", padding:"5px 10px", borderRadius:10,
                      border:`1.5px solid ${cat.color}`, background:tk.panel2,
                      color:tk.text, fontSize:15, fontWeight:800, outline:"none",
                      fontFamily:"Syne,sans-serif" }} />
                ) : (
                  <p onClick={()=>setEditing(cat.id)} title="Click to edit" style={{
                    fontSize:17, fontWeight:900, color:tk.text,
                    cursor:"pointer", borderBottom:`2px dashed ${cat.color}50`,
                    fontFamily:"Syne,sans-serif", margin:0,
                  }}>{$(cat.budget)}</p>
                )}
                <p style={{ fontSize:10, color:tk.sub, marginTop:2 }}>monthly budget</p>
              </div>
            </div>

            <div style={{ height:8, borderRadius:99, background:tk.border, overflow:"hidden", marginBottom:10 }}>
              <div className="progress-bar" style={{
                height:"100%", borderRadius:99,
                background: cat.status==="over" ? PALETTE.rose : cat.status==="warn" ? PALETTE.amber : cat.color,
                "--w":`${cat.pct}%`,
              }} />
            </div>

            <div style={{ display:"flex", justifyContent:"space-between" }}>
              <span style={{ fontSize:12, color:tk.sub }}>
                Spent: <b style={{ color:tk.text }}>{$(cat.spent)}</b>
              </span>
              <span style={{ fontSize:12, fontWeight:700, color: cat.remaining<0 ? PALETTE.rose : tk.sub }}>
                {cat.remaining<0 ? `Over ${$(Math.abs(cat.remaining))}` : `Left: ${$(cat.remaining)}`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   AI INSIGHTS PAGE
═══════════════════════════════════════════════════════════ */
function AIInsights({ txs, tk }) {
  const [chat, setChat] = useState([
    { role:"ai", msg:"👋 Hello! I'm your Finova AI assistant. I've analyzed your February spending and have some valuable insights. What would you like to explore?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  const RESPONSES = [
    "📊 Based on your Feb data: food at 46% budget utilization with 8 days left is your biggest risk. I recommend a $20/day dining cap for the remaining days.",
    "💡 Your savings rate this month is exceptional — 61% of income! If sustained, you'll hit $50K net worth by Q3 2026.",
    "🔍 I noticed 4 recurring subscriptions: Netflix ($22), Spotify ($11), Gym ($49), Udemy ($49). Total: $131/mo. The Gym + Udemy combo could be replaced with free alternatives to save $98/month.",
    "📈 Transport spending is only 32% of budget — impressive. That efficiency is saving you ~$200 extra monthly vs your peers.",
    "🎯 Your next financial milestone: Reduce food spend below $500 for one month. That alone would boost your monthly savings by ~$100.",
  ];

  const send = () => {
    if (!input.trim()) return;
    const msg = input;
    setInput("");
    setChat(c=>[...c, { role:"user", msg }]);
    setLoading(true);
    setTimeout(()=>{
      setChat(c=>[...c, { role:"ai", msg: RESPONSES[Math.floor(Math.random()*RESPONSES.length)] }]);
      setLoading(false);
      setTimeout(()=>{ chatRef.current?.scrollTo({ top:99999, behavior:"smooth" }); }, 50);
    }, 1400);
  };

  const typeStyle = {
    warn:    { bg: PALETTE.amber+"12",  border: PALETTE.amber+"30",  tag: PALETTE.amber,   icon: PALETTE.amber   },
    success: { bg: PALETTE.emerald+"12",border: PALETTE.emerald+"30",tag: PALETTE.emerald, icon: PALETTE.emerald },
    info:    { bg: PALETTE.indigo+"12", border: PALETTE.indigo+"30", tag: PALETTE.indigo,  icon: PALETTE.indigo  },
    predict: { bg: PALETTE.violet+"12", border: PALETTE.violet+"30", tag: PALETTE.violet,  icon: PALETTE.violet  },
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div className="fade-up">
        <h2 style={{ fontSize:24, fontWeight:900, color:tk.text, letterSpacing:"-0.04em", fontFamily:"Syne,sans-serif" }}>AI Insights</h2>
        <p style={{ fontSize:13, color:tk.sub, marginTop:4 }}>Personalized intelligence powered by Finova AI</p>
      </div>

      {/* Insight Cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:16 }}>
        {AI_CARDS.map((card,i) => {
          const s = typeStyle[card.type];
          return (
            <div key={i} className={`fade-up stagger-${i+1} hover-lift`} style={{
              background:s.bg, border:`1.5px solid ${s.border}`,
              borderRadius:22, padding:24,
            }}>
              <div style={{ display:"flex", alignItems:"flex-start", gap:14 }}>
                <div style={{ width:46,height:46, borderRadius:15, background:s.icon+"1E", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{card.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:7 }}>
                    <p style={{ fontSize:13, fontWeight:800, color:tk.text, margin:0, fontFamily:"Syne,sans-serif" }}>{card.title}</p>
                    <span style={{ fontSize:10, padding:"2px 9px", borderRadius:99, background:s.tag+"1E", color:s.tag, fontWeight:700 }}>{card.tag}</span>
                  </div>
                  <p style={{ fontSize:12, color:tk.sub, lineHeight:1.7, marginBottom:14 }}>{card.body}</p>
                  <button style={{
                    fontSize:12, fontWeight:700, color:s.tag,
                    background:"transparent", border:`1.5px solid ${s.border}`,
                    padding:"6px 14px", borderRadius:10, cursor:"pointer",
                    transition:"all 0.2s",
                  }}
                    onMouseEnter={e=>{ e.currentTarget.style.background=s.tag+"18"; }}
                    onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; }}>
                    {card.action || "Learn more"} →
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Forecast Chart */}
      <div className="fade-up stagger-5 theme-transition hover-lift" style={{
        background:tk.panel, border:`1px solid ${tk.border}`,
        borderRadius:24, padding:28,
      }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
              <div style={{ width:30,height:30, borderRadius:9, background:"linear-gradient(135deg,#5B5BD6,#8E4EC6)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:15 }}>🔮</div>
              <h3 style={{ fontSize:15, fontWeight:800, color:tk.text, fontFamily:"Syne,sans-serif", margin:0 }}>Predictive Forecast</h3>
            </div>
            <p style={{ fontSize:12, color:tk.sub }}>AI-projected spending for next 4 months</p>
          </div>
          <div style={{ padding:"6px 14px", borderRadius:99, background:PALETTE.violet+"1A", color:PALETTE.violet, fontSize:12, fontWeight:700 }}>
            🔮 AI Model v2.4
          </div>
        </div>
        <div style={{ height:190 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={[
              ...TREND.slice(-3),
              { month:"Mar", expenses:2900, savings:4300 },
              { month:"Apr", expenses:3100, savings:4000 },
              { month:"May", expenses:2750, savings:4500 },
            ]} margin={{ top:5,right:5,left:-18,bottom:0 }}>
              <defs>
                <linearGradient id="fcExp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={PALETTE.rose}   stopOpacity={0.25} />
                  <stop offset="95%" stopColor={PALETTE.rose}   stopOpacity={0}    />
                </linearGradient>
                <linearGradient id="fcSav" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={PALETTE.violet} stopOpacity={0.3}  />
                  <stop offset="95%" stopColor={PALETTE.violet} stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
              <XAxis dataKey="month" tick={{ fontSize:11, fill:tk.sub }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:11, fill:tk.sub }} axisLine={false} tickLine={false} />
              <Tooltip content={<Tip tk={tk}/>} />
              <Area type="monotone" dataKey="expenses" name="Expenses" stroke={PALETTE.rose}   strokeWidth={2} fill="url(#fcExp)" />
              <Area type="monotone" dataKey="savings"  name="Savings"  stroke={PALETTE.violet} strokeWidth={2} strokeDasharray="6 3" fill="url(#fcSav)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p style={{ fontSize:11, color:tk.sub, textAlign:"right", marginTop:10 }}>Dashed = AI projections</p>
      </div>

      {/* AI Chat */}
      <div className="fade-up stagger-6 theme-transition" style={{
        background:tk.panel, border:`1px solid ${tk.border}`,
        borderRadius:24, overflow:"hidden",
      }}>
        <div style={{ padding:"20px 26px", borderBottom:`1px solid ${tk.border}`, display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ width:40,height:40, borderRadius:13, background:"linear-gradient(135deg,#5B5BD6,#8E4EC6)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🤖</div>
          <div>
            <p style={{ fontSize:14, fontWeight:800, color:tk.text, margin:0, fontFamily:"Syne,sans-serif" }}>Finova AI Assistant</p>
            <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:2 }}>
              <div className="dot-pulse" style={{ width:6,height:6, borderRadius:"50%", background:PALETTE.emerald }} />
              <span style={{ fontSize:11, color:PALETTE.emerald, fontWeight:600 }}>Online · Analyzing your finances</span>
            </div>
          </div>
        </div>

        <div ref={chatRef} style={{ padding:"22px 26px", minHeight:200, maxHeight:280, overflowY:"auto", display:"flex", flexDirection:"column", gap:14 }}>
          {chat.map((msg,i)=>(
            <div key={i} className="fade-up" style={{ display:"flex", justifyContent: msg.role==="user" ? "flex-end" : "flex-start" }}>
              {msg.role==="ai" && (
                <div style={{ width:28,height:28, borderRadius:9, background:"linear-gradient(135deg,#5B5BD6,#8E4EC6)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, marginRight:10, flexShrink:0, alignSelf:"flex-end" }}>🤖</div>
              )}
              <div style={{
                maxWidth:"72%", padding:"12px 18px",
                borderRadius: msg.role==="user" ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
                background: msg.role==="user"
                  ? "linear-gradient(135deg, #5B5BD6, #8E4EC6)"
                  : tk.panel2,
                border: msg.role==="ai" ? `1px solid ${tk.border}` : "none",
                color: msg.role==="user" ? "#fff" : tk.text,
                fontSize:13, lineHeight:1.65,
              }}>{msg.msg}</div>
            </div>
          ))}
          {loading && (
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:28,height:28, borderRadius:9, background:"linear-gradient(135deg,#5B5BD6,#8E4EC6)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13 }}>🤖</div>
              <div style={{ padding:"12px 18px", borderRadius:"20px 20px 20px 4px", background:tk.panel2, border:`1px solid ${tk.border}`, display:"flex", gap:5 }}>
                {[0,1,2].map(i=>(
                  <div key={i} style={{ width:7,height:7, borderRadius:"50%", background:PALETTE.indigo, animation:"bounce 1.2s ease infinite", animationDelay:`${i*0.2}s` }} />
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ padding:"16px 22px", borderTop:`1px solid ${tk.border}`, display:"flex", gap:10 }}>
          <input value={input} onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&send()}
            placeholder="Ask about your spending, goals, or budget strategies..."
            style={{ flex:1, padding:"12px 18px", borderRadius:14, border:`1.5px solid ${tk.border}`, background:tk.panel2, color:tk.text, fontSize:13, outline:"none" }} />
          <button onClick={send} style={{
            padding:"12px 22px", borderRadius:14, border:"none",
            background:"linear-gradient(135deg, #5B5BD6, #8E4EC6)",
            color:"#fff", cursor:"pointer", fontWeight:700, fontSize:13,
            boxShadow:"0 4px 16px #5B5BD640",
            transition:"transform 0.2s",
          }}
            onMouseEnter={e=>e.currentTarget.style.transform="translateY(-1px)"}
            onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
            Send ↑
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════════════════ */
export default function App() {
  const [dark,  setDark]  = useState(false);
  const [page,  setPage]  = useState("dashboard");
  const [txs,   setTxs]   = useState(INIT_TXS);
  const [modal, setModal] = useState(false);
  const [sidebar, setSidebar] = useState(true);

  const tk = theme(dark);

  const addTx     = tx  => setTxs(prev=>[tx,...prev]);
  const deleteTx  = id  => setTxs(prev=>prev.filter(t=>t.id!==id));

  const NAV = [
    { id:"dashboard", label:"Dashboard",   icon:"⬡", badge: null },
    { id:"tracker",   label:"Transactions", icon:"↔", badge: txs.length },
    { id:"analytics", label:"Analytics",   icon:"∿", badge: null },
    { id:"budget",    label:"Budget",       icon:"◎", badge: null },
    { id:"insights",  label:"AI Insights", icon:"✦", badge: "NEW" },
  ];

  const expenses  = txs.filter(t=>t.kind==="expense");
  const totalExp  = expenses.reduce((s,t)=>s+t.amount,0);
  const totalBudget = CATS.reduce((s,c)=>s+c.budget,0);

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div className="theme-transition" style={{ display:"flex", height:"100vh", background:tk.bg, overflow:"hidden" }}>

        {/* ── SIDEBAR ── */}
        <aside className="theme-transition" style={{
          width: sidebar ? 230 : 66,
          flexShrink:0,
          background: tk.panel,
          borderRight:`1px solid ${tk.border}`,
          display:"flex", flexDirection:"column",
          transition:"width 0.3s cubic-bezier(.22,1,.36,1)",
          overflow:"hidden",
        }}>
          {/* Logo */}
          <div style={{ height:66, display:"flex", alignItems:"center", gap:12, padding: sidebar?"0 20px":"0 15px", borderBottom:`1px solid ${tk.border}`, flexShrink:0 }}>
            <div style={{ width:38,height:38, borderRadius:13, background:"linear-gradient(135deg,#5B5BD6,#8E4EC6)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:"0 4px 16px #5B5BD650" }}>
              <span style={{ color:"#fff", fontSize:18, fontWeight:900, fontFamily:"Syne,sans-serif" }}>F</span>
            </div>
            {sidebar && (
              <div>
                <p style={{ fontSize:15, fontWeight:900, color:tk.text, letterSpacing:"-0.03em", fontFamily:"Syne,sans-serif", lineHeight:1 }}>Finova</p>
                <p style={{ fontSize:10, color:tk.sub, fontWeight:600, marginTop:2 }}>Smart Finance</p>
              </div>
            )}
          </div>

          {/* Nav */}
          <nav style={{ flex:1, padding:"14px 8px", display:"flex", flexDirection:"column", gap:3 }}>
            {NAV.map(item=>(
              <button key={item.id} onClick={()=>setPage(item.id)} className="nav-btn" style={{
                width:"100%", display:"flex", alignItems:"center",
                gap:10, padding: sidebar ? "10px 14px" : "10px 0",
                justifyContent: sidebar ? "flex-start" : "center",
                borderRadius:13, border:"none", cursor:"pointer",
                background: page===item.id ? (dark?"#5B5BD620":"#EEF0FF") : "transparent",
                color: page===item.id ? PALETTE.indigo : tk.sub,
                fontWeight: page===item.id ? 700 : 500,
                fontSize:13,
              }}>
                <span style={{ fontSize:17, width:20, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{item.icon}</span>
                {sidebar && (
                  <>
                    <span style={{ flex:1, textAlign:"left" }}>{item.label}</span>
                    {item.badge && (
                      <span style={{
                        fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:99,
                        background: typeof item.badge==="string" ? "linear-gradient(135deg,#5B5BD6,#8E4EC6)" : (dark?"#1F1F3A":"#E8E8FF"),
                        color: typeof item.badge==="string" ? "#fff" : PALETTE.indigo,
                      }}>{item.badge}</span>
                    )}
                  </>
                )}
              </button>
            ))}
          </nav>

          {/* Add Transaction Btn */}
          <div style={{ padding:`12px 8px ${sidebar?"14px":"16px"}`, borderTop:`1px solid ${tk.border}` }}>
            <button onClick={()=>setModal(true)} style={{
              width:"100%", padding:"12px 0", borderRadius:14, border:"none",
              background:"linear-gradient(135deg, #5B5BD6, #8E4EC6)",
              color:"#fff", cursor:"pointer", fontWeight:700,
              fontSize: sidebar ? 13 : 20,
              boxShadow:"0 4px 16px #5B5BD650",
              display:"flex", alignItems:"center", justifyContent:"center", gap:6,
              transition:"transform 0.2s, box-shadow 0.2s",
            }}
              onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-1px)"; e.currentTarget.style.boxShadow="0 8px 24px #5B5BD660"; }}
              onMouseLeave={e=>{ e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 4px 16px #5B5BD650"; }}>
              {sidebar ? "+ Add Transaction" : "+"}
            </button>
          </div>

          {/* User */}
          {sidebar && (
            <div style={{ padding:"0 8px 16px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", borderRadius:13, background:tk.panel2 }}>
                <div style={{ width:34,height:34, borderRadius:11, background:"linear-gradient(135deg,#E54666,#8E4EC6)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:900, color:"#fff", flexShrink:0, fontFamily:"Syne,sans-serif" }}>JD</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontSize:12, fontWeight:800, color:tk.text, margin:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>Jordan Davis</p>
                  <p style={{ fontSize:10, color:tk.sub, marginTop:1 }}>Pro Plan · Active</p>
                </div>
                <div style={{ width:8,height:8, borderRadius:"50%", background:PALETTE.emerald, flexShrink:0 }} />
              </div>
            </div>
          )}
        </aside>

        {/* ── MAIN CONTENT ── */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>

          {/* Top Bar */}
          <header className="theme-transition" style={{
            height:66, display:"flex", alignItems:"center",
            gap:12, padding:"0 30px",
            background:tk.panel, borderBottom:`1px solid ${tk.border}`,
            flexShrink:0,
          }}>
            <button onClick={()=>setSidebar(s=>!s)} style={{
              width:36,height:36, borderRadius:11,
              border:`1px solid ${tk.border}`, background:"transparent",
              cursor:"pointer", color:tk.sub, fontSize:16,
              display:"flex", alignItems:"center", justifyContent:"center",
              transition:"all 0.2s",
            }}
              onMouseEnter={e=>e.currentTarget.style.background=tk.panel2}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              ☰
            </button>

            <div>
              <p style={{ fontSize:14, fontWeight:800, color:tk.text, margin:0, fontFamily:"Syne,sans-serif" }}>
                {NAV.find(n=>n.id===page)?.label}
              </p>
              <p style={{ fontSize:11, color:tk.sub, margin:0 }}>February 2026</p>
            </div>

            <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:10 }}>
              {/* Search */}
              <div style={{
                display:"flex", alignItems:"center", gap:8,
                padding:"8px 16px", borderRadius:12,
                background:tk.panel2, border:`1px solid ${tk.border}`,
                color:tk.sub, fontSize:12, cursor:"text",
              }}>
                <span style={{ fontSize:13 }}>⌕</span>
                <span>Search transactions...</span>
                <span style={{ padding:"2px 7px", borderRadius:7, background:tk.border, fontSize:10, marginLeft:10 }}>⌘K</span>
              </div>

              {/* Budget badge */}
              <div style={{
                padding:"7px 14px", borderRadius:12,
                background: totalExp/totalBudget > 0.9 ? PALETTE.rose+"18" : PALETTE.emerald+"18",
                border:`1px solid ${totalExp/totalBudget > 0.9 ? PALETTE.rose+"40" : PALETTE.emerald+"40"}`,
                color: totalExp/totalBudget > 0.9 ? PALETTE.rose : PALETTE.emerald,
                fontSize:12, fontWeight:700,
              }}>
                {Math.round((totalExp/totalBudget)*100)}% of budget used
              </div>

              {/* Notifications */}
              <button style={{
                width:38,height:38, borderRadius:12,
                border:`1px solid ${tk.border}`, background:"transparent",
                cursor:"pointer", color:tk.sub,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:17, position:"relative",
                transition:"all 0.2s",
              }}
                onMouseEnter={e=>e.currentTarget.style.background=tk.panel2}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                🔔
                <div style={{ position:"absolute", top:7, right:7, width:7,height:7, borderRadius:"50%", background:PALETTE.rose, border:`2px solid ${tk.panel}` }} />
              </button>

              {/* Theme Toggle */}
              <button onClick={()=>setDark(d=>!d)} style={{
                width:38,height:38, borderRadius:12,
                border:`1px solid ${tk.border}`, background:"transparent",
                cursor:"pointer", display:"flex", alignItems:"center",
                justifyContent:"center", fontSize:17,
                transition:"all 0.2s",
              }}
                onMouseEnter={e=>e.currentTarget.style.background=tk.panel2}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                {dark ? "☀️" : "🌙"}
              </button>

              {/* Period */}
              <select style={{
                padding:"8px 14px", borderRadius:12,
                border:`1px solid ${tk.border}`, background:tk.panel2,
                color:tk.text, fontSize:12, outline:"none", cursor:"pointer",
              }}>
                <option>Feb 2026</option>
                <option>Jan 2026</option>
                <option>Dec 2025</option>
              </select>
            </div>
          </header>

          {/* Page */}
          <main key={page} style={{ flex:1, overflowY:"auto", padding:"28px 32px" }}>
            {page==="dashboard" && <Dashboard txs={txs} tk={tk} />}
            {page==="tracker"   && <Tracker   txs={txs} onDelete={deleteTx} tk={tk} />}
            {page==="analytics" && <Analytics txs={txs} tk={tk} />}
            {page==="budget"    && <Budget    txs={txs} tk={tk} />}
            {page==="insights"  && <AIInsights txs={txs} tk={tk} />}
          </main>
        </div>
      </div>

      {modal && <AddModal onClose={()=>setModal(false)} onAdd={addTx} tk={tk} />}
    </>
  );
}