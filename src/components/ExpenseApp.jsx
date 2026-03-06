
import { useState, useEffect, useCallback } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadialBarChart, RadialBar, Legend
} from "recharts";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "housing",     label: "Housing",       icon: "🏠", color: "#6366f1", budget: 1500 },
  { id: "food",        label: "Food & Dining",  icon: "🍽️", color: "#8b5cf6", budget: 600  },
  { id: "transport",   label: "Transport",      icon: "🚗", color: "#a855f7", budget: 350  },
  { id: "utilities",   label: "Utilities",      icon: "⚡", color: "#ec4899", budget: 200  },
  { id: "health",      label: "Health",         icon: "💊", color: "#14b8a6", budget: 200  },
  { id: "leisure",     label: "Leisure",        icon: "🎮", color: "#f59e0b", budget: 300  },
  { id: "shopping",    label: "Shopping",       icon: "🛍️", color: "#ef4444", budget: 400  },
  { id: "education",   label: "Education",      icon: "📚", color: "#3b82f6", budget: 150  },
];

const INITIAL_TRANSACTIONS = [
  { id: 1,  name: "Monthly Rent",         category: "housing",   amount: 1400, date: "2026-02-01", type: "expense", note: "" },
  { id: 2,  name: "Whole Foods",          category: "food",      amount: 128,  date: "2026-02-03", type: "expense", note: "" },
  { id: 3,  name: "Salary",               category: "income",    amount: 5800, date: "2026-02-01", type: "income",  note: "" },
  { id: 4,  name: "Uber",                 category: "transport", amount: 24,   date: "2026-02-04", type: "expense", note: "" },
  { id: 5,  name: "Netflix",              category: "leisure",   amount: 22,   date: "2026-02-05", type: "expense", note: "" },
  { id: 6,  name: "Electricity Bill",     category: "utilities", amount: 89,   date: "2026-02-06", type: "expense", note: "" },
  { id: 7,  name: "Gym Membership",       category: "health",    amount: 49,   date: "2026-02-07", type: "expense", note: "" },
  { id: 8,  name: "Chipotle",             category: "food",      amount: 18,   date: "2026-02-08", type: "expense", note: "" },
  { id: 9,  name: "Amazon Order",         category: "shopping",  amount: 67,   date: "2026-02-09", type: "expense", note: "" },
  { id: 10, name: "Online Course",        category: "education", amount: 49,   date: "2026-02-10", type: "expense", note: "" },
  { id: 11, name: "Freelance Payment",    category: "income",    amount: 1200, date: "2026-02-11", type: "income",  note: "" },
  { id: 12, name: "Starbucks",            category: "food",      amount: 12,   date: "2026-02-12", type: "expense", note: "" },
  { id: 13, name: "Metro Card",           category: "transport", amount: 33,   date: "2026-02-13", type: "expense", note: "" },
  { id: 14, name: "Water Bill",           category: "utilities", amount: 42,   date: "2026-02-14", type: "expense", note: "" },
  { id: 15, name: "Zara",                 category: "shopping",  amount: 145,  date: "2026-02-15", type: "expense", note: "" },
  { id: 16, name: "Doctor Visit",         category: "health",    amount: 80,   date: "2026-02-16", type: "expense", note: "" },
  { id: 17, name: "Movie Night",          category: "leisure",   amount: 35,   date: "2026-02-17", type: "expense", note: "" },
  { id: 18, name: "Grocery Run",          category: "food",      amount: 94,   date: "2026-02-18", type: "expense", note: "" },
  { id: 19, name: "Gas",                  category: "transport", amount: 58,   date: "2026-02-19", type: "expense", note: "" },
  { id: 20, name: "Spotify",              category: "leisure",   amount: 10,   date: "2026-02-20", type: "expense", note: "" },
];

const MONTHLY_TREND = [
  { month: "Aug", expenses: 3200, income: 6200, savings: 3000 },
  { month: "Sep", expenses: 3800, income: 6200, savings: 2400 },
  { month: "Oct", expenses: 2900, income: 7000, savings: 4100 },
  { month: "Nov", expenses: 4100, income: 7000, savings: 2900 },
  { month: "Dec", expenses: 5200, income: 7000, savings: 1800 },
  { month: "Jan", expenses: 3600, income: 7000, savings: 3400 },
  { month: "Feb", expenses: 2459, income: 7000, savings: 4541 },
];

const DAILY_SPEND = [
  { day: "Mon", amount: 142 }, { day: "Tue", amount: 89 }, { day: "Wed", amount: 210 },
  { day: "Thu", amount: 67 },  { day: "Fri", amount: 320 }, { day: "Sat", amount: 180 },
  { day: "Sun", amount: 95 },
];

const AI_INSIGHTS = [
  {
    id: 1, type: "warning", icon: "⚡", title: "Food Spending Alert",
    desc: "You've spent $252 on food this month — 42% of your $600 budget with 8 days left. At this pace, you'll exceed by ~$130.",
    action: "Set daily food limit", tag: "Overspend Risk"
  },
  {
    id: 2, type: "success", icon: "🎯", title: "Savings Goal On Track",
    desc: "You're projected to save $4,541 this month — 94% of your $4,800 goal. You're 2 weeks ahead of your emergency fund target.",
    action: "View savings plan", tag: "Goal Progress"
  },
  {
    id: 3, type: "info", icon: "🔍", title: "Subscription Audit",
    desc: "You have 4 active subscriptions totaling $64/month. Netflix + Spotify combined is $32. Consider a family plan to save $14/month.",
    action: "Review subscriptions", tag: "Optimization"
  },
  {
    id: 4, type: "predict", icon: "🔮", title: "End-of-Month Forecast",
    desc: "Based on current spending patterns, your February total is projected at $2,750 — $1,750 under budget. Best month in 6 months!",
    action: "See full forecast", tag: "Prediction"
  },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmt = (n) => "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
const fmtDec = (n) => "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const getCat = (id) => CATEGORIES.find(c => c.id === id) || { label: id, icon: "💰", color: "#6366f1" };

function useTheme() {
  const [dark, setDark] = useState(false);
  return { dark, toggle: () => setDark(d => !d) };
}

// ─── THEME TOKENS ─────────────────────────────────────────────────────────────
function t(dark) {
  return {
    bg:        dark ? "#070711"    : "#f6f5fb",
    surface:   dark ? "#0f0f1a"    : "#ffffff",
    surface2:  dark ? "#161625"    : "#f0effe",
    border:    dark ? "#1e1e30"    : "#e8e6f4",
    text:      dark ? "#f0efff"    : "#1a1838",
    muted:     dark ? "#5e5d80"    : "#8884a8",
    accent:    "#6366f1",
    accent2:   "#8b5cf6",
    green:     "#10b981",
    red:       "#f43f5e",
    amber:     "#f59e0b",
  };
}

// ─── CUSTOM TOOLTIP ───────────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label, dark: dk }) {
  const tk = t(dk);
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: tk.surface, border: `1px solid ${tk.border}`, borderRadius: 12, padding: "10px 14px", fontSize: 12, color: tk.text, boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}>
      <p style={{ fontWeight: 700, marginBottom: 6, color: tk.muted }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, marginBottom: 2 }}>{p.name}: <b>{fmt(p.value)}</b></p>
      ))}
    </div>
  );
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────
function StatCard({ title, value, sub, subColor, icon, accent, dark: dk, progress, progressColor }) {
  const tk = t(dk);
  return (
    <div style={{ background: tk.surface, border: `1px solid ${tk.border}`, borderRadius: 20, padding: "22px 24px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: accent + "18" }} />
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
        <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: tk.muted }}>{title}</span>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: accent + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{icon}</div>
      </div>
      <div style={{ fontSize: 26, fontWeight: 800, color: tk.text, marginBottom: 8, letterSpacing: "-0.03em" }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: subColor || tk.muted }}>{sub}</div>}
      {progress !== undefined && (
        <div style={{ marginTop: 12 }}>
          <div style={{ height: 5, borderRadius: 10, background: tk.border, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${Math.min(progress, 100)}%`, borderRadius: 10, background: progressColor || accent, transition: "width 1s ease" }} />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MODAL: ADD TRANSACTION ───────────────────────────────────────────────────
function AddTransactionModal({ onClose, onAdd, dark: dk }) {
  const tk = t(dk);
  const [form, setForm] = useState({ name: "", amount: "", category: "food", date: new Date().toISOString().split("T")[0], type: "expense", note: "" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.name || !form.amount) return;
    onAdd({ ...form, id: Date.now(), amount: parseFloat(form.amount) });
    onClose();
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
      <div style={{ background: tk.surface, border: `1px solid ${tk.border}`, borderRadius: 24, padding: 32, width: 460, maxWidth: "94vw", boxShadow: "0 32px 80px rgba(0,0,0,0.3)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: tk.text, margin: 0 }}>Add Transaction</h2>
            <p style={{ fontSize: 12, color: tk.muted, marginTop: 2 }}>Record a new expense or income</p>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 10, border: `1px solid ${tk.border}`, background: "transparent", cursor: "pointer", color: tk.muted, fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>

        {/* Type Toggle */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, background: tk.surface2, borderRadius: 12, padding: 4 }}>
          {["expense", "income"].map(type => (
            <button key={type} onClick={() => set("type", type)}
              style={{ flex: 1, padding: "8px 0", borderRadius: 9, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 13, transition: "all 0.2s",
                background: form.type === type ? (type === "expense" ? "#f43f5e" : "#10b981") : "transparent",
                color: form.type === type ? "#fff" : tk.muted }}>
              {type === "expense" ? "💸 Expense" : "💰 Income"}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div style={{ gridColumn: "1/-1" }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: tk.muted, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>Description</label>
            <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Grocery shopping"
              style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1px solid ${tk.border}`, background: tk.surface2, color: tk.text, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: tk.muted, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>Amount ($)</label>
            <input value={form.amount} onChange={e => set("amount", e.target.value)} type="number" placeholder="0.00"
              style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1px solid ${tk.border}`, background: tk.surface2, color: tk.text, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: tk.muted, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>Date</label>
            <input value={form.date} onChange={e => set("date", e.target.value)} type="date"
              style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1px solid ${tk.border}`, background: tk.surface2, color: tk.text, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
          </div>
          {form.type === "expense" && (
            <div style={{ gridColumn: "1/-1" }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: tk.muted, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>Category</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                {CATEGORIES.map(cat => (
                  <button key={cat.id} onClick={() => set("category", cat.id)}
                    style={{ padding: "8px 4px", borderRadius: 10, border: `1px solid ${form.category === cat.id ? cat.color : tk.border}`, background: form.category === cat.id ? cat.color + "20" : "transparent",
                      cursor: "pointer", fontSize: 11, fontWeight: 600, color: form.category === cat.id ? cat.color : tk.muted, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, transition: "all 0.15s" }}>
                    <span style={{ fontSize: 16 }}>{cat.icon}</span>
                    <span>{cat.label.split(" ")[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          <div style={{ gridColumn: "1/-1" }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: tk.muted, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>Note (optional)</label>
            <input value={form.note} onChange={e => set("note", e.target.value)} placeholder="Any additional details..."
              style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1px solid ${tk.border}`, background: tk.surface2, color: tk.text, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "12px 0", borderRadius: 12, border: `1px solid ${tk.border}`, background: "transparent", cursor: "pointer", color: tk.muted, fontWeight: 700, fontSize: 14 }}>Cancel</button>
          <button onClick={handleSubmit} style={{ flex: 2, padding: "12px 0", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", cursor: "pointer", color: "#fff", fontWeight: 700, fontSize: 14, boxShadow: "0 4px 14px #6366f140" }}>
            + Add Transaction
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD PAGE ───────────────────────────────────────────────────────────
function DashboardPage({ transactions, dark: dk }) {
  const tk = t(dk);
  const expenses = transactions.filter(tx => tx.type === "expense");
  const income = transactions.filter(tx => tx.type === "income");
  const totalExpense = expenses.reduce((s, tx) => s + tx.amount, 0);
  const totalIncome = income.reduce((s, tx) => s + tx.amount, 0);
  const totalBudget = CATEGORIES.reduce((s, c) => s + c.budget, 0);
  const budgetLeft = totalBudget - totalExpense;
  const savings = totalIncome - totalExpense;

  // Category breakdown
  const catSpend = CATEGORIES.map(cat => {
    const spent = expenses.filter(tx => tx.category === cat.id).reduce((s, tx) => s + tx.amount, 0);
    return { ...cat, spent, pct: Math.round((spent / cat.budget) * 100) };
  }).sort((a, b) => b.spent - a.spent);

  const pieData = catSpend.filter(c => c.spent > 0).map(c => ({ name: c.label, value: c.spent, color: c.color }));

  const recent = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Hero Banner */}
      <div style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)", borderRadius: 24, padding: "28px 32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
        <div style={{ position: "absolute", bottom: -30, right: 80, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginBottom: 6, fontWeight: 600 }}>February 2026 Overview</p>
        <h1 style={{ color: "#fff", fontSize: 36, fontWeight: 900, margin: 0, letterSpacing: "-0.04em" }}>
          {fmtDec(totalExpense)}
          <span style={{ fontSize: 16, fontWeight: 500, opacity: 0.7, marginLeft: 10 }}>spent of {fmt(totalBudget)} budget</span>
        </h1>
        <div style={{ display: "flex", gap: 24, marginTop: 16 }}>
          {[
            { label: "Income", val: fmt(totalIncome), icon: "↑" },
            { label: "Savings", val: fmt(Math.max(savings, 0)), icon: "🏦" },
            { label: "Days Left", val: "8", icon: "📅" },
          ].map(item => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 14 }}>{item.icon}</span>
              <div>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, margin: 0 }}>{item.label}</p>
                <p style={{ color: "#fff", fontSize: 15, fontWeight: 800, margin: 0 }}>{item.val}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        <StatCard title="Total Expenses" value={fmtDec(totalExpense)} icon="💸"
          sub={<span>▼ 12.4% vs last month</span>} subColor={tk.green}
          accent="#f43f5e" dark={dk} progress={(totalExpense / totalBudget) * 100} progressColor="#f43f5e" />
        <StatCard title="Budget Left" value={fmt(Math.max(budgetLeft, 0))} icon="🎯"
          sub={`${Math.round((budgetLeft / totalBudget) * 100)}% remaining of ${fmt(totalBudget)}`}
          accent="#6366f1" dark={dk} progress={Math.round((budgetLeft / totalBudget) * 100)} progressColor="#6366f1" />
        <StatCard title="Net Savings" value={fmt(Math.max(savings, 0))} icon="💰"
          sub={<span>▲ 8.2% this month</span>} subColor={tk.green}
          accent="#10b981" dark={dk} />
        <StatCard title="Total Income" value={fmt(totalIncome)} icon="📈"
          sub="Salary + Freelance" accent="#a855f7" dark={dk} />
      </div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
        {/* Area Chart */}
        <div style={{ background: tk.surface, border: `1px solid ${tk.border}`, borderRadius: 20, padding: 24 }}>
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: tk.text, margin: 0 }}>Monthly Trend</h3>
            <p style={{ fontSize: 12, color: tk.muted, marginTop: 3, margin: "3px 0 0" }}>Income vs Expenses vs Savings — 7 months</p>
          </div>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_TREND} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  {[["inc", "#10b981"], ["exp", "#f43f5e"], ["sav", "#6366f1"]].map(([id, color]) => (
                    <linearGradient key={id} id={id + "Grad"} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={color} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={dk ? "#1e1e30" : "#f0effe"} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: tk.muted }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: tk.muted }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip dark={dk} />} />
                <Area type="monotone" dataKey="income" name="Income" stroke="#10b981" strokeWidth={2} fill="url(#incGrad)" />
                <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#f43f5e" strokeWidth={2} fill="url(#expGrad)" />
                <Area type="monotone" dataKey="savings" name="Savings" stroke="#6366f1" strokeWidth={2} fill="url(#savGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", gap: 20, marginTop: 12 }}>
            {[["Income", "#10b981"], ["Expenses", "#f43f5e"], ["Savings", "#6366f1"]].map(([label, color]) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: color }} />
                <span style={{ fontSize: 11, color: tk.muted }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pie Chart */}
        <div style={{ background: tk.surface, border: `1px solid ${tk.border}`, borderRadius: 20, padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: tk.text, margin: "0 0 4px" }}>By Category</h3>
          <p style={{ fontSize: 12, color: tk.muted, margin: "0 0 16px" }}>Spend distribution</p>
          <div style={{ height: 160 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip content={<ChartTooltip dark={dk} />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
            {catSpend.filter(c => c.spent > 0).slice(0, 4).map(cat => (
              <div key={cat.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: cat.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: tk.muted }}>{cat.label}</span>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: tk.text }}>{fmt(cat.spent)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Transactions + Top Categories */}
      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 20 }}>
        {/* Recent Transactions */}
        <div style={{ background: tk.surface, border: `1px solid ${tk.border}`, borderRadius: 20, overflow: "hidden" }}>
          <div style={{ padding: "20px 24px 16px", borderBottom: `1px solid ${tk.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: tk.text, margin: 0 }}>Recent Transactions</h3>
              <p style={{ fontSize: 12, color: tk.muted, margin: "3px 0 0" }}>Latest activity</p>
            </div>
          </div>
          {recent.map((tx, i) => {
            const cat = tx.type === "income" ? { icon: "💼", color: "#10b981" } : getCat(tx.category);
            return (
              <div key={tx.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 24px", borderBottom: i < recent.length - 1 ? `1px solid ${tk.border}` : "none" }}>
                <div style={{ width: 38, height: 38, borderRadius: 12, background: cat.color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>{cat.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: tk.text, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tx.name}</p>
                  <p style={{ fontSize: 11, color: tk.muted, margin: "2px 0 0" }}>{tx.date}</p>
                </div>
                <span style={{ fontSize: 14, fontWeight: 800, color: tx.type === "income" ? "#10b981" : tk.text, flexShrink: 0 }}>
                  {tx.type === "income" ? "+" : "-"}{fmtDec(tx.amount)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Top Categories */}
        <div style={{ background: tk.surface, border: `1px solid ${tk.border}`, borderRadius: 20, padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: tk.text, margin: "0 0 4px" }}>Budget Progress</h3>
          <p style={{ fontSize: 12, color: tk.muted, margin: "0 0 20px" }}>Spent vs allocated</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {catSpend.slice(0, 6).map(cat => (
              <div key={cat.id}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 15 }}>{cat.icon}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: tk.text }}>{cat.label}</span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: cat.pct > 90 ? "#f43f5e" : tk.text }}>{fmt(cat.spent)}</span>
                    <span style={{ fontSize: 10, color: tk.muted }}> / {fmt(cat.budget)}</span>
                  </div>
                </div>
                <div style={{ height: 6, borderRadius: 10, background: tk.border, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${Math.min(cat.pct, 100)}%`, borderRadius: 10, background: cat.pct > 90 ? "#f43f5e" : cat.pct > 70 ? "#f59e0b" : cat.color, transition: "width 0.8s ease" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 3 }}>
                  <span style={{ fontSize: 10, color: cat.pct > 90 ? "#f43f5e" : tk.muted, fontWeight: 600 }}>{cat.pct}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── EXPENSE TRACKER PAGE ─────────────────────────────────────────────────────
function ExpenseTrackerPage({ transactions, onDelete, dark: dk }) {
  const tk = t(dk);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("date");

  const filtered = transactions
    .filter(tx => filter === "all" || tx.type === filter || tx.category === filter)
    .filter(tx => tx.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sort === "date" ? new Date(b.date) - new Date(a.date) : sort === "amount" ? b.amount - a.amount : a.name.localeCompare(b.name));

  const totalExpenses = filtered.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const totalIncome = filtered.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: tk.text, margin: 0, letterSpacing: "-0.03em" }}>Expense Tracker</h2>
          <p style={{ fontSize: 13, color: tk.muted, margin: "4px 0 0" }}>{filtered.length} transactions</p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 11, color: tk.muted, margin: 0 }}>Total Expenses</p>
              <p style={{ fontSize: 16, fontWeight: 800, color: "#f43f5e", margin: "2px 0 0" }}>{fmtDec(totalExpenses)}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 11, color: tk.muted, margin: 0 }}>Total Income</p>
              <p style={{ fontSize: 16, fontWeight: 800, color: "#10b981", margin: "2px 0 0" }}>{fmtDec(totalIncome)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div style={{ background: tk.surface, border: `1px solid ${tk.border}`, borderRadius: 16, padding: "16px 20px", display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ flex: "1 1 200px", position: "relative" }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: tk.muted }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search transactions..."
            style={{ width: "100%", padding: "9px 12px 9px 36px", borderRadius: 10, border: `1px solid ${tk.border}`, background: tk.surface2, color: tk.text, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {[{ id: "all", label: "All" }, { id: "expense", label: "Expenses" }, { id: "income", label: "Income" },
            ...CATEGORIES.slice(0, 4).map(c => ({ id: c.id, label: c.label }))
          ].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              style={{ padding: "7px 14px", borderRadius: 20, border: `1px solid ${filter === f.id ? tk.accent : tk.border}`,
                background: filter === f.id ? tk.accent + "18" : "transparent", cursor: "pointer",
                color: filter === f.id ? tk.accent : tk.muted, fontSize: 12, fontWeight: 600, transition: "all 0.15s" }}>
              {f.label}
            </button>
          ))}
        </div>
        <select value={sort} onChange={e => setSort(e.target.value)}
          style={{ padding: "9px 14px", borderRadius: 10, border: `1px solid ${tk.border}`, background: tk.surface2, color: tk.text, fontSize: 12, outline: "none", cursor: "pointer" }}>
          <option value="date">Sort: Date</option>
          <option value="amount">Sort: Amount</option>
          <option value="name">Sort: Name</option>
        </select>
      </div>

      {/* Transactions Table */}
      <div style={{ background: tk.surface, border: `1px solid ${tk.border}`, borderRadius: 20, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "3fr 1.5fr 1fr 1fr 0.5fr", padding: "12px 24px", borderBottom: `1px solid ${tk.border}`, background: tk.surface2 }}>
          {["Transaction", "Category", "Date", "Amount", ""].map((h, i) => (
            <span key={i} style={{ fontSize: 11, fontWeight: 700, color: tk.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</span>
          ))}
        </div>
        {filtered.length === 0 ? (
          <div style={{ padding: "60px 24px", textAlign: "center", color: tk.muted }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
            <p style={{ fontWeight: 700, margin: 0 }}>No transactions found</p>
          </div>
        ) : filtered.map((tx, i) => {
          const cat = tx.type === "income" ? { icon: "💼", color: "#10b981", label: "Income" } : getCat(tx.category);
          return (
            <div key={tx.id} style={{ display: "grid", gridTemplateColumns: "3fr 1.5fr 1fr 1fr 0.5fr", padding: "14px 24px", borderBottom: i < filtered.length - 1 ? `1px solid ${tk.border}` : "none", alignItems: "center", transition: "background 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.background = dk ? "#161625" : "#f8f7ff"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: cat.color + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{cat.icon}</div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: tk.text, margin: 0 }}>{tx.name}</p>
                  {tx.note && <p style={{ fontSize: 11, color: tk.muted, margin: "1px 0 0" }}>{tx.note}</p>}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ fontSize: 11, padding: "4px 10px", borderRadius: 20, background: cat.color + "18", color: cat.color, fontWeight: 600 }}>{cat.label}</span>
              </div>
              <span style={{ fontSize: 12, color: tk.muted }}>{tx.date}</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: tx.type === "income" ? "#10b981" : tk.text }}>
                {tx.type === "income" ? "+" : "-"}{fmtDec(tx.amount)}
              </span>
              <button onClick={() => onDelete(tx.id)}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: tk.muted, fontSize: 16, padding: 4, borderRadius: 6, transition: "all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.color = "#f43f5e"; e.currentTarget.style.background = "#f43f5e18"; }}
                onMouseLeave={e => { e.currentTarget.style.color = tk.muted; e.currentTarget.style.background = "transparent"; }}>
                ×
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── BUDGET PLANNER PAGE ──────────────────────────────────────────────────────
function BudgetPlannerPage({ transactions, dark: dk }) {
  const tk = t(dk);
  const expenses = transactions.filter(tx => tx.type === "expense");
  const [budgets, setBudgets] = useState(Object.fromEntries(CATEGORIES.map(c => [c.id, c.budget])));
  const [editing, setEditing] = useState(null);

  const stats = CATEGORIES.map(cat => {
    const spent = expenses.filter(tx => tx.category === cat.id).reduce((s, tx) => s + tx.amount, 0);
    const budget = budgets[cat.id];
    const pct = budget > 0 ? Math.min(Math.round((spent / budget) * 100), 100) : 0;
    const status = pct >= 100 ? "over" : pct >= 80 ? "warning" : "ok";
    return { ...cat, budget, spent, pct, status, remaining: budget - spent };
  });

  const totalBudget = Object.values(budgets).reduce((s, v) => s + v, 0);
  const totalSpent = stats.reduce((s, c) => s + c.spent, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: tk.text, margin: 0, letterSpacing: "-0.03em" }}>Budget Planner</h2>
          <p style={{ fontSize: 13, color: tk.muted, margin: "4px 0 0" }}>Set and track category budgets</p>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 11, color: tk.muted, margin: 0 }}>Total Budget</p>
            <p style={{ fontSize: 20, fontWeight: 900, color: tk.accent, margin: "2px 0 0" }}>{fmt(totalBudget)}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 11, color: tk.muted, margin: 0 }}>Total Spent</p>
            <p style={{ fontSize: 20, fontWeight: 900, color: "#f43f5e", margin: "2px 0 0" }}>{fmt(totalSpent)}</p>
          </div>
        </div>
      </div>

      {/* Overall budget bar */}
      <div style={{ background: tk.surface, border: `1px solid ${tk.border}`, borderRadius: 20, padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: tk.text }}>Overall Budget Utilization</span>
          <span style={{ fontSize: 14, fontWeight: 800, color: tk.text }}>{Math.round((totalSpent / totalBudget) * 100)}%</span>
        </div>
        <div style={{ height: 12, borderRadius: 10, background: tk.border, overflow: "hidden", marginBottom: 10 }}>
          <div style={{ height: "100%", width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%`, borderRadius: 10, background: "linear-gradient(90deg, #6366f1, #a855f7)", transition: "width 1s ease" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 12, color: tk.muted }}>Spent: {fmt(totalSpent)}</span>
          <span style={{ fontSize: 12, color: tk.muted }}>Remaining: {fmt(Math.max(totalBudget - totalSpent, 0))}</span>
        </div>
      </div>

      {/* Category Budgets Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
        {stats.map(cat => (
          <div key={cat.id} style={{ background: tk.surface, border: `1px solid ${cat.status === "over" ? "#f43f5e40" : cat.status === "warning" ? "#f59e0b30" : tk.border}`, borderRadius: 20, padding: 22, transition: "all 0.2s" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: 14, background: cat.color + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{cat.icon}</div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 800, color: tk.text, margin: 0 }}>{cat.label}</p>
                  <p style={{ fontSize: 11, color: tk.muted, margin: "2px 0 0" }}>
                    {cat.status === "over" ? "⚠️ Over budget" : cat.status === "warning" ? "⚡ Approaching limit" : "✓ On track"}
                  </p>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                {editing === cat.id ? (
                  <input autoFocus defaultValue={cat.budget} type="number"
                    onBlur={e => { setBudgets(b => ({ ...b, [cat.id]: +e.target.value })); setEditing(null); }}
                    onKeyDown={e => { if (e.key === "Enter") e.target.blur(); }}
                    style={{ width: 80, textAlign: "right", padding: "4px 8px", borderRadius: 8, border: `1px solid ${cat.color}`, background: tk.surface2, color: tk.text, fontSize: 14, fontWeight: 800, outline: "none" }} />
                ) : (
                  <p onClick={() => setEditing(cat.id)} title="Click to edit"
                    style={{ fontSize: 16, fontWeight: 900, color: tk.text, margin: 0, cursor: "pointer", borderBottom: `2px dashed ${cat.color}40` }}>
                    {fmt(cat.budget)}
                  </p>
                )}
                <p style={{ fontSize: 10, color: tk.muted, margin: "2px 0 0" }}>budget</p>
              </div>
            </div>

            <div style={{ height: 8, borderRadius: 10, background: tk.border, overflow: "hidden", marginBottom: 10 }}>
              <div style={{ height: "100%", width: `${cat.pct}%`, borderRadius: 10,
                background: cat.status === "over" ? "#f43f5e" : cat.status === "warning" ? "#f59e0b" : cat.color,
                transition: "width 0.8s ease" }} />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, color: tk.muted }}>Spent: <b style={{ color: tk.text }}>{fmt(cat.spent)}</b></span>
              <span style={{ fontSize: 12, color: cat.remaining < 0 ? "#f43f5e" : tk.muted }}>
                {cat.remaining < 0 ? `Over by ${fmt(Math.abs(cat.remaining))}` : `Left: ${fmt(cat.remaining)}`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ANALYTICS PAGE ───────────────────────────────────────────────────────────
function AnalyticsPage({ transactions, dark: dk }) {
  const tk = t(dk);
  const expenses = transactions.filter(tx => tx.type === "expense");

  const catSpend = CATEGORIES.map(cat => {
    const spent = expenses.filter(tx => tx.category === cat.id).reduce((s, tx) => s + tx.amount, 0);
    return { name: cat.label, spent, budget: cat.budget, fill: cat.color, icon: cat.icon };
  }).sort((a, b) => b.spent - a.spent);

  const weeklyAvg = Math.round(expenses.reduce((s, t) => s + t.amount, 0) / 4);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: tk.text, margin: 0, letterSpacing: "-0.03em" }}>Analytics</h2>
        <p style={{ fontSize: 13, color: tk.muted, margin: "4px 0 0" }}>Deep insights into your spending patterns</p>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14 }}>
        {[
          { title: "Daily Avg", value: fmt(Math.round(expenses.reduce((s,t) => s+t.amount, 0) / 20)), icon: "📅", color: "#6366f1" },
          { title: "Weekly Avg", value: fmt(weeklyAvg), icon: "📊", color: "#8b5cf6" },
          { title: "Largest Expense", value: fmt(Math.max(...expenses.map(t => t.amount))), icon: "💸", color: "#f43f5e" },
          { title: "Transactions", value: expenses.length, icon: "🔢", color: "#10b981" },
        ].map(card => (
          <div key={card.title} style={{ background: tk.surface, border: `1px solid ${tk.border}`, borderRadius: 16, padding: "18px 20px" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 20 }}>{card.icon}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: tk.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>{card.title}</span>
            </div>
            <p style={{ fontSize: 22, fontWeight: 900, color: card.color, margin: 0, letterSpacing: "-0.03em" }}>{card.value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Bar Chart: Category Comparison */}
        <div style={{ background: tk.surface, border: `1px solid ${tk.border}`, borderRadius: 20, padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: tk.text, margin: "0 0 4px" }}>Spent vs Budget</h3>
          <p style={{ fontSize: 12, color: tk.muted, margin: "0 0 20px" }}>Category comparison</p>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={catSpend} margin={{ top: 0, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={dk ? "#1e1e30" : "#f0effe"} />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: tk.muted }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: tk.muted }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip dark={dk} />} />
                <Bar dataKey="budget" name="Budget" fill={dk ? "#2a2a4a" : "#e8e6f4"} radius={[4, 4, 0, 0]} />
                <Bar dataKey="spent" name="Spent" radius={[4, 4, 0, 0]}>
                  {catSpend.map((entry, index) => <Cell key={index} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Spend Line Chart */}
        <div style={{ background: tk.surface, border: `1px solid ${tk.border}`, borderRadius: 20, padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: tk.text, margin: "0 0 4px" }}>Daily Spending</h3>
          <p style={{ fontSize: 12, color: tk.muted, margin: "0 0 20px" }}>This week's pattern</p>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={DAILY_SPEND} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="dailyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={dk ? "#1e1e30" : "#f0effe"} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: tk.muted }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: tk.muted }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip dark={dk} />} />
                <Line type="monotone" dataKey="amount" name="Amount" stroke="#6366f1" strokeWidth={3}
                  dot={{ fill: "#6366f1", r: 5, strokeWidth: 2, stroke: dk ? "#0f0f1a" : "#fff" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Monthly Trend Full */}
      <div style={{ background: tk.surface, border: `1px solid ${tk.border}`, borderRadius: 20, padding: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 800, color: tk.text, margin: "0 0 4px" }}>6-Month Savings Trend</h3>
        <p style={{ fontSize: 12, color: tk.muted, margin: "0 0 20px" }}>Track your financial progress over time</p>
        <div style={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MONTHLY_TREND} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="savingsGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={dk ? "#1e1e30" : "#f0effe"} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: tk.muted }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: tk.muted }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip dark={dk} />} />
              <Area type="monotone" dataKey="savings" name="Savings" stroke="#10b981" strokeWidth={2.5} fill="url(#savingsGrad2)" dot={{ fill: "#10b981", r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ─── AI INSIGHTS PAGE ─────────────────────────────────────────────────────────
function AIInsightsPage({ transactions, dark: dk }) {
  const tk = t(dk);
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([
    { role: "ai", msg: "👋 Hi! I'm your AI financial assistant. Ask me anything about your spending, budgets, or savings goals." }
  ]);
  const [loading, setLoading] = useState(false);

  const typeColors = {
    warning: { bg: dk ? "#f59e0b12" : "#fffbeb", border: "#f59e0b30", tag: "#f59e0b", icon: "#f59e0b" },
    success: { bg: dk ? "#10b98112" : "#f0fdf4", border: "#10b98130", tag: "#10b981", icon: "#10b981" },
    info:    { bg: dk ? "#6366f112" : "#eef2ff", border: "#6366f130", tag: "#6366f1", icon: "#6366f1" },
    predict: { bg: dk ? "#a855f712" : "#faf5ff", border: "#a855f730", tag: "#a855f7", icon: "#a855f7" },
  };

  const mockResponses = [
    "Based on your spending data, you're on track to save ~$4,500 this month. Your biggest opportunity is reducing food expenses by meal prepping 3x per week.",
    "I notice you spend 42% more on weekends. Consider setting a daily weekend limit of $80 to stay within budget.",
    "Your subscription spending ($64/month) could be reduced by 30% by switching to a family plan and canceling unused services.",
    "At your current savings rate, you'll reach your $50k emergency fund goal by September 2026 — 4 months ahead of schedule! 🎉",
  ];

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput("");
    setChat(c => [...c, { role: "user", msg: userMsg }]);
    setLoading(true);
    setTimeout(() => {
      setChat(c => [...c, { role: "ai", msg: mockResponses[Math.floor(Math.random() * mockResponses.length)] }]);
      setLoading(false);
    }, 1200);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: tk.text, margin: 0, letterSpacing: "-0.03em" }}>AI Insights</h2>
        <p style={{ fontSize: 13, color: tk.muted, margin: "4px 0 0" }}>Personalized financial intelligence powered by AI</p>
      </div>

      {/* Insight Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
        {AI_INSIGHTS.map(insight => {
          const colors = typeColors[insight.type];
          return (
            <div key={insight.id} style={{ background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 20, padding: 22 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <div style={{ width: 42, height: 42, borderRadius: 14, background: colors.icon + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{insight.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <p style={{ fontSize: 13, fontWeight: 800, color: tk.text, margin: 0 }}>{insight.title}</p>
                    <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, background: colors.tag + "20", color: colors.tag, fontWeight: 700 }}>{insight.tag}</span>
                  </div>
                  <p style={{ fontSize: 12, color: tk.muted, margin: "0 0 14px", lineHeight: 1.6 }}>{insight.desc}</p>
                  <button style={{ fontSize: 12, color: colors.tag, background: "transparent", border: `1px solid ${colors.border}`, padding: "6px 14px", borderRadius: 8, cursor: "pointer", fontWeight: 700 }}>
                    {insight.action} →
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Prediction Chart */}
      <div style={{ background: tk.surface, border: `1px solid ${tk.border}`, borderRadius: 20, padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #6366f1, #a855f7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🔮</div>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: tk.text, margin: 0 }}>Predictive Spending Forecast</h3>
        </div>
        <p style={{ fontSize: 12, color: tk.muted, margin: "0 0 20px" }}>AI-projected expenses for the next 6 months based on your patterns</p>
        <div style={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={[
              ...MONTHLY_TREND.slice(-3),
              { month: "Mar", expenses: 2900, income: 7200, savings: 4300, projected: true },
              { month: "Apr", expenses: 3100, income: 7200, savings: 4100, projected: true },
              { month: "May", expenses: 2800, income: 7200, savings: 4400, projected: true },
            ]} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={dk ? "#1e1e30" : "#f0effe"} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: tk.muted }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: tk.muted }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip dark={dk} />} />
              <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#6366f1" strokeWidth={2} fill="url(#expGrad)" />
              <Area type="monotone" dataKey="savings" name="Savings" stroke="#a855f7" strokeWidth={2} strokeDasharray="5 3" fill="url(#forecastGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p style={{ fontSize: 11, color: tk.muted, textAlign: "right", margin: "10px 0 0" }}>Dashed lines indicate AI projections</p>
      </div>

      {/* AI Chat */}
      <div style={{ background: tk.surface, border: `1px solid ${tk.border}`, borderRadius: 20, overflow: "hidden" }}>
        <div style={{ padding: "18px 24px", borderBottom: `1px solid ${tk.border}`, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg, #6366f1, #a855f7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🤖</div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 800, color: tk.text, margin: 0 }}>Finova AI Assistant</p>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />
              <span style={{ fontSize: 11, color: "#10b981" }}>Online · Analyzing your finances</span>
            </div>
          </div>
        </div>
        <div style={{ padding: "20px 24px", minHeight: 180, maxHeight: 260, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
          {chat.map((msg, i) => (
            <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
              <div style={{ maxWidth: "75%", padding: "10px 16px", borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                background: msg.role === "user" ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : tk.surface2,
                border: msg.role === "ai" ? `1px solid ${tk.border}` : "none",
                color: msg.role === "user" ? "#fff" : tk.text, fontSize: 13, lineHeight: 1.6 }}>
                {msg.msg}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", gap: 6, padding: "12px 16px", background: tk.surface2, border: `1px solid ${tk.border}`, borderRadius: "18px 18px 18px 4px", width: "fit-content" }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: tk.accent, animation: "bounce 1s infinite", animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          )}
        </div>
        <div style={{ padding: "16px 20px", borderTop: `1px solid ${tk.border}`, display: "flex", gap: 10 }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder="Ask about your spending, savings goals, budget tips..."
            style={{ flex: 1, padding: "11px 16px", borderRadius: 12, border: `1px solid ${tk.border}`, background: tk.surface2, color: tk.text, fontSize: 13, outline: "none" }} />
          <button onClick={sendMessage}
            style={{ padding: "11px 20px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 13, boxShadow: "0 4px 14px #6366f140" }}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const { dark, toggle } = useTheme();
  const tk = t(dark);
  const [page, setPage] = useState("dashboard");
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [showAdd, setShowAdd] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const addTransaction = (tx) => setTransactions(prev => [tx, ...prev]);
  const deleteTransaction = (id) => setTransactions(prev => prev.filter(tx => tx.id !== id));

  const navItems = [
    { id: "dashboard",  label: "Dashboard",    icon: "⬡" },
    { id: "tracker",    label: "Transactions",  icon: "⟳" },
    { id: "budget",     label: "Budget",        icon: "◎" },
    { id: "analytics",  label: "Analytics",     icon: "∿" },
    { id: "insights",   label: "AI Insights",   icon: "✦" },
  ];

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Plus Jakarta Sans', 'DM Sans', 'Nunito', sans-serif; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #6366f140; border-radius: 10px; }
        @keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .page-enter { animation: fadeIn 0.3s ease; }
      `}</style>
      <div style={{ display: "flex", height: "100vh", background: tk.bg, overflow: "hidden", transition: "background 0.3s, color 0.3s" }}>

        {/* Sidebar */}
        <aside style={{ width: sidebarOpen ? 220 : 64, flexShrink: 0, background: tk.surface, borderRight: `1px solid ${tk.border}`, display: "flex", flexDirection: "column", transition: "width 0.3s ease", overflow: "hidden" }}>
          {/* Logo */}
          <div style={{ height: 64, display: "flex", alignItems: "center", gap: 12, padding: sidebarOpen ? "0 20px" : "0 14px", borderBottom: `1px solid ${tk.border}`, flexShrink: 0 }}>
            <div style={{ width: 36, height: 36, borderRadius: 12, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 14px #6366f140" }}>
              <span style={{ color: "#fff", fontSize: 16, fontWeight: 900 }}>F</span>
            </div>
            {sidebarOpen && (
              <div>
                <p style={{ fontSize: 14, fontWeight: 900, color: tk.text, letterSpacing: "-0.02em" }}>Finova</p>
                <p style={{ fontSize: 10, color: tk.muted, fontWeight: 600 }}>Smart Finance</p>
              </div>
            )}
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: "16px 10px", display: "flex", flexDirection: "column", gap: 4 }}>
            {navItems.map(item => (
              <button key={item.id} onClick={() => setPage(item.id)}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: sidebarOpen ? "10px 14px" : "10px 0", justifyContent: sidebarOpen ? "flex-start" : "center",
                  borderRadius: 12, border: "none", cursor: "pointer", transition: "all 0.15s",
                  background: page === item.id ? (dark ? "#6366f120" : "#eef2ff") : "transparent",
                  color: page === item.id ? tk.accent : tk.muted,
                  fontWeight: page === item.id ? 700 : 500 }}>
                <span style={{ fontSize: 18, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", width: 20 }}>{item.icon}</span>
                {sidebarOpen && <span style={{ fontSize: 13, whiteSpace: "nowrap" }}>{item.label}</span>}
                {sidebarOpen && page === item.id && <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: tk.accent }} />}
              </button>
            ))}
          </nav>

          {/* Add Button */}
          <div style={{ padding: "12px 10px 16px", borderTop: `1px solid ${tk.border}` }}>
            <button onClick={() => setShowAdd(true)}
              style={{ width: "100%", padding: "11px 0", borderRadius: 12, border: "none",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", cursor: "pointer",
                fontWeight: 700, fontSize: sidebarOpen ? 13 : 18, boxShadow: "0 4px 14px #6366f140", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              {sidebarOpen ? "+ Add Transaction" : "+"}
            </button>
          </div>

          {/* User */}
          {sidebarOpen && (
            <div style={{ padding: "0 10px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 12, background: tk.surface2 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg, #f43f5e, #a855f7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, color: "#fff", flexShrink: 0 }}>JD</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 12, fontWeight: 800, color: tk.text, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Jordan Davis</p>
                  <p style={{ fontSize: 10, color: tk.muted, margin: "1px 0 0" }}>Pro Plan</p>
                </div>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", flexShrink: 0 }} />
              </div>
            </div>
          )}
        </aside>

        {/* Main */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* Top Bar */}
          <header style={{ height: 64, display: "flex", alignItems: "center", gap: 12, padding: "0 28px", background: tk.surface, borderBottom: `1px solid ${tk.border}`, flexShrink: 0 }}>
            <button onClick={() => setSidebarOpen(s => !s)}
              style={{ width: 34, height: 34, borderRadius: 10, border: `1px solid ${tk.border}`, background: "transparent", cursor: "pointer", color: tk.muted, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>
              ☰
            </button>
            <div>
              <p style={{ fontSize: 14, fontWeight: 800, color: tk.text, margin: 0 }}>
                {navItems.find(n => n.id === page)?.label}
              </p>
              <p style={{ fontSize: 11, color: tk.muted, margin: 0 }}>February 2026</p>
            </div>

            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
              {/* Search */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 10, background: tk.surface2, border: `1px solid ${tk.border}`, color: tk.muted, fontSize: 12, cursor: "text" }}>
                <span>🔍</span>
                <span>Search...</span>
                <span style={{ padding: "2px 6px", borderRadius: 6, background: tk.border, fontSize: 10, marginLeft: 8 }}>⌘K</span>
              </div>

              {/* Notification bell */}
              <button style={{ width: 36, height: 36, borderRadius: 10, border: `1px solid ${tk.border}`, background: "transparent", cursor: "pointer", color: tk.muted, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", fontSize: 16 }}>
                🔔
                <div style={{ position: "absolute", top: 6, right: 6, width: 7, height: 7, borderRadius: "50%", background: "#f43f5e", border: `2px solid ${tk.surface}` }} />
              </button>

              {/* Dark mode toggle */}
              <button onClick={toggle}
                style={{ width: 36, height: 36, borderRadius: 10, border: `1px solid ${tk.border}`, background: "transparent", cursor: "pointer", color: tk.muted, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
                {dark ? "☀️" : "🌙"}
              </button>

              {/* Period */}
              <select style={{ padding: "7px 12px", borderRadius: 10, border: `1px solid ${tk.border}`, background: tk.surface2, color: tk.text, fontSize: 12, outline: "none", cursor: "pointer" }}>
                <option>Feb 2026</option>
                <option>Jan 2026</option>
              </select>
            </div>
          </header>

          {/* Page Content */}
          <main style={{ flex: 1, overflowY: "auto", padding: "28px", scrollBehavior: "smooth" }} className="page-enter" key={page}>
            {page === "dashboard" && <DashboardPage transactions={transactions} dark={dark} />}
            {page === "tracker"   && <ExpenseTrackerPage transactions={transactions} onDelete={deleteTransaction} dark={dark} />}
            {page === "budget"    && <BudgetPlannerPage transactions={transactions} dark={dark} />}
            {page === "analytics" && <AnalyticsPage transactions={transactions} dark={dark} />}
            {page === "insights"  && <AIInsightsPage transactions={transactions} dark={dark} />}
          </main>
        </div>
      </div>

      {showAdd && <AddTransactionModal onClose={() => setShowAdd(false)} onAdd={addTransaction} dark={dark} />}
    </>
  );
}