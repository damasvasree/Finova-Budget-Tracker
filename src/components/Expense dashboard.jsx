
import { useState, useEffect, useRef } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const spendingData = [
  { month: "Aug", expenses: 3200, budget: 4500, savings: 1300 },
  { month: "Sep", expenses: 3800, budget: 4500, savings: 700 },
  { month: "Oct", expenses: 2900, budget: 4500, savings: 1600 },
  { month: "Nov", expenses: 4100, budget: 4500, savings: 400 },
  { month: "Dec", expenses: 5200, budget: 5000, savings: -200 },
  { month: "Jan", expenses: 3600, budget: 4500, savings: 900 },
  { month: "Feb", expenses: 2750, budget: 4500, savings: 1750 },
];

const categoryData = [
  { name: "Housing", value: 1400, color: "#6366f1" },
  { name: "Food", value: 620, color: "#8b5cf6" },
  { name: "Transport", value: 310, color: "#a78bfa" },
  { name: "Utilities", value: 180, color: "#c4b5fd" },
  { name: "Leisure", value: 240, color: "#ddd6fe" },
];

const transactions = [
  { id: 1, name: "Whole Foods Market", category: "Groceries", amount: -128.4, date: "Today, 2:30 PM", icon: "🛒" },
  { id: 2, name: "Netflix Premium", category: "Entertainment", amount: -22.99, date: "Today, 9:00 AM", icon: "🎬" },
  { id: 3, name: "Salary Deposit", category: "Income", amount: 5800.0, date: "Feb 20, 8:00 AM", icon: "💼" },
  { id: 4, name: "Uber Eats", category: "Food & Dining", amount: -34.75, date: "Feb 19, 7:45 PM", icon: "🍕" },
  { id: 5, name: "Apple Subscription", category: "Technology", amount: -14.99, date: "Feb 19, 12:00 PM", icon: "📱" },
  { id: 6, name: "Planet Fitness", category: "Health", amount: -24.99, date: "Feb 18, 6:00 AM", icon: "🏋️" },
];

const aiInsights = [
  {
    id: 1,
    title: "Spending Anomaly Detected",
    desc: "Your dining expenses are 34% higher than last month. Consider meal prepping to save ~$180/month.",
    type: "warning",
    icon: "⚡",
  },
  {
    id: 2,
    title: "Savings Goal On Track",
    desc: "At current rate, you'll hit your $10k emergency fund by April 2026. You're 2 weeks ahead of schedule.",
    type: "success",
    icon: "🎯",
  },
  {
    id: 3,
    title: "Subscription Audit",
    desc: "You're paying for 7 subscriptions totaling $142/month. 2 appear unused based on activity patterns.",
    type: "info",
    icon: "🔍",
  },
];

const navItems = [
  { icon: "◈", label: "Dashboard", active: true },
  { icon: "◎", label: "Transactions", active: false },
  { icon: "◉", label: "Budgets", active: false },
  { icon: "◈", label: "Analytics", active: false },
  { icon: "◎", label: "Goals", active: false },
  { icon: "◉", label: "Investments", active: false },
];

function AnimatedNumber({ value, prefix = "", suffix = "", decimals = 0 }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 1200;
    const step = (end - start) / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { start = end; clearInterval(timer); }
      setDisplay(start);
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{prefix}{display.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</span>;
}

const CustomTooltip = ({ active, payload, label, dark }) => {
  if (active && payload && payload.length) {
    return (
      <div className={`rounded-xl p-3 shadow-xl border text-xs ${dark ? "bg-gray-900 border-gray-700 text-gray-100" : "bg-white border-gray-200 text-gray-800"}`}>
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>{p.name}: ${p.value.toLocaleString()}</p>
        ))}
      </div>
    );
  }
  return null;
};

export default function ExpenseDashboard() {
  const [dark, setDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeNav, setActiveNav] = useState(0);

  const bg = dark ? "bg-[#0a0a0f]" : "bg-[#f4f3f8]";
  const card = dark ? "bg-[#13131a] border-[#1e1e2e]" : "bg-white border-gray-100";
  const text = dark ? "text-gray-100" : "text-gray-900";
  const muted = dark ? "text-gray-400" : "text-gray-500";
  const border = dark ? "border-[#1e1e2e]" : "border-gray-100";

  return (
    <div className={`min-h-screen ${bg} ${text} flex font-sans transition-colors duration-300`}
      style={{ fontFamily: "'Inter', 'Outfit', 'Nunito', sans-serif" }}>

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-60" : "w-16"} flex-shrink-0 flex flex-col border-r ${border} ${dark ? "bg-[#0d0d14]" : "bg-white"} transition-all duration-300 ease-in-out z-20`}>
        {/* Logo */}
        <div className={`h-16 flex items-center gap-3 px-4 border-b ${border}`}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-bold">F</span>
          </div>
          {sidebarOpen && (
            <div>
              <p className="text-sm font-bold tracking-tight">Finova</p>
              <p className={`text-[10px] ${muted}`}>Budget & Expenses</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-1">
          {navItems.map((item, i) => (
            <button
              key={i}
              onClick={() => setActiveNav(i)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 text-sm font-medium group
                ${activeNav === i
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/20"
                  : `${muted} hover:${dark ? "bg-[#1a1a26]" : "bg-gray-50"} hover:text-current`
                }`}
            >
              <span className="text-base w-5 flex-shrink-0 text-center">{item.icon}</span>
              {sidebarOpen && <span className="truncate">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* User */}
        {sidebarOpen && (
          <div className={`p-3 border-t ${border}`}>
            <div className={`flex items-center gap-3 p-2 rounded-lg ${dark ? "bg-[#1a1a26]" : "bg-gray-50"}`}>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">JD</div>
              <div className="min-w-0">
                <p className="text-xs font-semibold truncate">Jordan Davis</p>
                <p className={`text-[10px] ${muted} truncate`}>Pro Plan</p>
              </div>
              <div className="ml-auto w-2 h-2 bg-emerald-400 rounded-full flex-shrink-0"></div>
            </div>
          </div>
        )}
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top Navbar */}
        <header className={`h-16 flex items-center gap-4 px-6 border-b ${border} ${dark ? "bg-[#0d0d14]" : "bg-white"} flex-shrink-0`}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className={`p-2 rounded-lg ${dark ? "hover:bg-[#1e1e2e]" : "hover:bg-gray-100"} transition-colors`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div>
            <p className="font-bold text-sm">Good morning, Jordan 👋</p>
            <p className={`text-xs ${muted}`}>Here's your financial overview for February 2026</p>
          </div>

          <div className="ml-auto flex items-center gap-3">
            {/* Search */}
            <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs ${dark ? "bg-[#1a1a26] text-gray-400" : "bg-gray-100 text-gray-400"}`}>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Search...</span>
              <span className={`ml-2 px-1 rounded text-[10px] ${dark ? "bg-[#2a2a3e]" : "bg-white"}`}>⌘K</span>
            </div>

            {/* Notification */}
            <button className={`relative p-2 rounded-lg ${dark ? "hover:bg-[#1e1e2e]" : "hover:bg-gray-100"} transition-colors`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDark(!dark)}
              className={`p-2 rounded-lg ${dark ? "hover:bg-[#1e1e2e]" : "hover:bg-gray-100"} transition-colors`}
            >
              {dark
                ? <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              }
            </button>

            {/* Period Select */}
            <select className={`text-xs px-3 py-1.5 rounded-lg border ${dark ? "bg-[#1a1a26] border-[#2a2a3e] text-gray-300" : "bg-white border-gray-200 text-gray-600"} outline-none cursor-pointer`}>
              <option>Feb 2026</option>
              <option>Jan 2026</option>
              <option>Dec 2025</option>
            </select>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            {/* Total Expense */}
            <div className={`rounded-2xl border p-5 ${card} relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-rose-500/10 to-transparent rounded-2xl"></div>
              <div className="flex items-start justify-between mb-3">
                <div className={`text-xs font-medium uppercase tracking-widest ${muted}`}>Total Expenses</div>
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  </svg>
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">$<AnimatedNumber value={2750} decimals={0} /></div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-medium">↓ 12.4%</span>
                <span className={`text-xs ${muted}`}>vs last month</span>
              </div>
            </div>

            {/* Budget Left */}
            <div className={`rounded-2xl border p-5 ${card} relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-violet-500/10 to-transparent rounded-2xl"></div>
              <div className="flex items-start justify-between mb-3">
                <div className={`text-xs font-medium uppercase tracking-widest ${muted}`}>Budget Left</div>
                <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">$<AnimatedNumber value={1750} decimals={0} /></div>
              <div className="mt-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className={muted}>$2,750 / $4,500</span>
                  <span className="text-violet-500 font-medium">61%</span>
                </div>
                <div className={`h-1.5 rounded-full ${dark ? "bg-[#2a2a3e]" : "bg-gray-100"}`}>
                  <div className="h-1.5 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500" style={{ width: "61%" }}></div>
                </div>
              </div>
            </div>

            {/* Savings */}
            <div className={`rounded-2xl border p-5 ${card} relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-2xl"></div>
              <div className="flex items-start justify-between mb-3">
                <div className={`text-xs font-medium uppercase tracking-widest ${muted}`}>Total Savings</div>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">$<AnimatedNumber value={8420} decimals={0} /></div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-medium">↑ 8.2%</span>
                <span className={`text-xs ${muted}`}>vs last month</span>
              </div>
            </div>

            {/* Net Worth */}
            <div className="rounded-2xl border p-5 bg-gradient-to-br from-violet-600 to-indigo-700 border-violet-500/30 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 70% 30%, rgba(255,255,255,0.3) 0%, transparent 60%)" }}></div>
              <div className="flex items-start justify-between mb-3 relative">
                <div className="text-xs font-medium uppercase tracking-widest text-violet-200">Net Worth</div>
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1 relative">$<AnimatedNumber value={47350} decimals={0} /></div>
              <div className="flex items-center gap-1.5 relative">
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 text-white font-medium">↑ 3.1%</span>
                <span className="text-xs text-violet-200">this quarter</span>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
            {/* Area Chart */}
            <div className={`xl:col-span-2 rounded-2xl border p-5 ${card}`}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-bold text-sm">Spending Overview</h3>
                  <p className={`text-xs ${muted} mt-0.5`}>Expenses vs Budget — last 7 months</p>
                </div>
                <div className="flex gap-3 text-xs">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-violet-500 inline-block"></span><span className={muted}>Expenses</span></span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-indigo-400/40 inline-block"></span><span className={muted}>Budget</span></span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-400 inline-block"></span><span className={muted}>Savings</span></span>
                </div>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={spendingData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="budGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#818cf8" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="savGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={dark ? "#1e1e2e" : "#f0f0f5"} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: dark ? "#6b7280" : "#9ca3af" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: dark ? "#6b7280" : "#9ca3af" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip dark={dark} />} />
                    <Area type="monotone" dataKey="budget" name="Budget" stroke="#818cf8" strokeWidth={1.5} strokeDasharray="4 2" fill="url(#budGrad)" />
                    <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#7c3aed" strokeWidth={2} fill="url(#expGrad)" dot={{ fill: "#7c3aed", r: 3 }} />
                    <Area type="monotone" dataKey="savings" name="Savings" stroke="#34d399" strokeWidth={2} fill="url(#savGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart */}
            <div className={`rounded-2xl border p-5 ${card}`}>
              <div className="mb-4">
                <h3 className="font-bold text-sm">Spend by Category</h3>
                <p className={`text-xs ${muted} mt-0.5`}>February 2026</p>
              </div>
              <div className="h-36 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                      {categoryData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip dark={dark} />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-2">
                {categoryData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></span>
                      <span className={muted}>{item.name}</span>
                    </div>
                    <span className="font-semibold">${item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Row: Transactions + AI Insights */}
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
            {/* Transactions */}
            <div className={`xl:col-span-3 rounded-2xl border ${card}`}>
              <div className={`flex items-center justify-between p-5 border-b ${border}`}>
                <div>
                  <h3 className="font-bold text-sm">Recent Transactions</h3>
                  <p className={`text-xs ${muted} mt-0.5`}>Your latest activity</p>
                </div>
                <button className="text-xs text-violet-500 hover:text-violet-400 font-medium transition-colors">View all →</button>
              </div>
              <div className="divide-y divide-inherit">
                {transactions.map((tx) => (
                  <div key={tx.id} className={`flex items-center gap-3 px-5 py-3.5 hover:${dark ? "bg-[#1a1a26]" : "bg-gray-50"} transition-colors`}>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0 ${dark ? "bg-[#1e1e2e]" : "bg-gray-50"}`}>
                      {tx.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{tx.name}</p>
                      <p className={`text-xs ${muted} truncate`}>{tx.category} · {tx.date}</p>
                    </div>
                    <span className={`text-sm font-bold flex-shrink-0 ${tx.amount > 0 ? "text-emerald-500" : dark ? "text-gray-200" : "text-gray-800"}`}>
                      {tx.amount > 0 ? "+" : ""}${Math.abs(tx.amount).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Insights */}
            <div className={`xl:col-span-2 rounded-2xl border ${card} flex flex-col`}>
              <div className={`flex items-center justify-between p-5 border-b ${border}`}>
                <div>
                  <h3 className="font-bold text-sm flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-[10px] text-white font-bold">AI</span>
                    Smart Insights
                  </h3>
                  <p className={`text-xs ${muted} mt-0.5`}>Powered by Finova AI</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-emerald-500">Live</span>
                </div>
              </div>
              <div className="flex-1 p-4 space-y-3 overflow-auto">
                {aiInsights.map((insight) => {
                  const colors = {
                    warning: { bg: dark ? "bg-amber-500/10" : "bg-amber-50", border: "border-amber-500/20", text: "text-amber-500" },
                    success: { bg: dark ? "bg-emerald-500/10" : "bg-emerald-50", border: "border-emerald-500/20", text: "text-emerald-500" },
                    info: { bg: dark ? "bg-indigo-500/10" : "bg-indigo-50", border: "border-indigo-500/20", text: "text-indigo-500" },
                  }[insight.type];
                  return (
                    <div key={insight.id} className={`rounded-xl border p-3.5 ${colors.bg} ${colors.border}`}>
                      <div className="flex items-start gap-2.5">
                        <span className="text-lg flex-shrink-0 mt-0.5">{insight.icon}</span>
                        <div>
                          <p className={`text-xs font-semibold mb-1 ${colors.text}`}>{insight.title}</p>
                          <p className={`text-xs leading-relaxed ${dark ? "text-gray-400" : "text-gray-600"}`}>{insight.desc}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Ask AI */}
                <div className={`rounded-xl border p-3.5 ${dark ? "border-[#2a2a3e] bg-[#1a1a26]" : "border-gray-100 bg-gray-50"}`}>
                  <p className={`text-xs font-medium mb-2 ${muted}`}>Ask Finova AI</p>
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${dark ? "bg-[#13131a] border border-[#2a2a3e]" : "bg-white border border-gray-200"}`}>
                    <input
                      className={`flex-1 bg-transparent text-xs outline-none ${dark ? "text-gray-300 placeholder-gray-600" : "text-gray-600 placeholder-gray-400"}`}
                      placeholder="How can I save more this month?"
                    />
                    <button className="w-6 h-6 rounded-md bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}