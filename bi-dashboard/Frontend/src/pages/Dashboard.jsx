import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import BackButton from '../components/BackButton';
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useApp } from '../context/AppContext';

const PRIMARY = '#2F8D46';

const glassCard = {
  backdropFilter: 'blur(20px) saturate(180%)',
  backgroundColor: 'rgba(255,255,255,0.72)',
  border: '1px solid rgba(255,255,255,0.8)',
};

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar() {
  return (
    <aside className="w-64 hidden lg:flex flex-col p-5 shrink-0 h-full"
      style={{ ...glassCard, borderRight: '1px solid rgba(255,255,255,0.5)', backdropFilter: 'blur(24px)' }}>
      <Link to="/" className="flex items-center gap-2 px-2 mb-6">
        <span className="material-symbols-outlined text-2xl" style={{ color: PRIMARY }}>bar_chart</span>
        <span className="font-mono text-lg font-bold tracking-tighter text-slate-900">QueryIQ</span>
      </Link>

      <nav className="space-y-1 flex-1">
        {/* Active */}
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
          style={{ backgroundColor: `${PRIMARY}1A`, color: PRIMARY }}>
          <span className="material-symbols-outlined text-lg">dashboard</span>
          <span className="text-sm font-bold">Dashboard</span>
        </div>

        <Link to="/editor"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-white/60 transition-colors">
          <span className="material-symbols-outlined text-lg">edit_note</span>
          <span className="text-sm font-medium">Query Editor</span>
        </Link>

        <Link to="/history"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-white/60 transition-colors">
          <span className="material-symbols-outlined text-lg">history</span>
          <span className="text-sm font-medium">Query History</span>
        </Link>

        <Link to="/saved"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-white/60 transition-colors">
          <span className="material-symbols-outlined text-lg">bookmark</span>
          <span className="text-sm font-medium">Saved Queries</span>
        </Link>
      </nav>

      <div className="mt-auto space-y-4">
        <div className="p-4 rounded-xl" style={{ backgroundColor: `${PRIMARY}0D`, border: `1px solid ${PRIMARY}22` }}>
          <p className="text-xs font-bold mb-1" style={{ color: PRIMARY }}>PRO PLAN</p>
          <p className="text-[11px] text-slate-500 mb-3">85% of monthly tokens used.</p>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div className="h-full w-[85%] rounded-full" style={{ backgroundColor: PRIMARY }} />
          </div>
        </div>
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border"
            style={{ backgroundColor: `${PRIMARY}22`, color: PRIMARY, borderColor: `${PRIMARY}44` }}>JD</div>
          <div>
            <p className="text-xs font-bold">Alex Chen</p>
            <p className="text-[10px] text-slate-400">Sr. Data Analyst</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { dashboardData, currentPrompt, setCurrentPrompt, setDashboardData, setError } = useApp();
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([]);

  if (!dashboardData) {
    return (
      <div className="flex h-screen items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #f8f6f6 60%, #eff6ff 100%)' }}>
        <div className="text-center">
          <span className="material-symbols-outlined text-5xl mb-4 block" style={{ color: PRIMARY }}>dashboard</span>
          <p className="text-slate-500 mb-4">No dashboard data yet.</p>
          <Link to="/editor" className="font-bold text-sm" style={{ color: PRIMARY }}>
            ← Go ask a question
          </Link>
        </div>
      </div>
    );
  }

  const { dashboard_title, summary, charts = [], raw_sql } = dashboardData;
  const COLORS = ['#2F8D46', '#86efac', '#4ade80', '#22c55e', '#16a34a', '#bbf7d0'];

  const renderChart = (chart, index) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.08 }}
        className="p-6 rounded-2xl shadow-lg"
        style={glassCard}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-slate-500 text-xs uppercase tracking-wider">
              {chart.title}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">{chart.description}</p>
          </div>
        </div>

        <div className="h-56">
          {chart.chart_type === 'bar' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chart.data} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey={chart.x_key} axisLine={false} tickLine={false}
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  tickFormatter={v => typeof v === 'string' && v.length > 10 ? v.slice(0, 10) + '…' : v} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: 'none',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                    background: 'rgba(255,255,255,0.95)' }}
                  formatter={v => [`${Number(v).toLocaleString()}`, '']} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                {chart.y_keys.map((key, i) => (
                  <Bar key={key} dataKey={key} fill={COLORS[i % COLORS.length]}
                    radius={[6, 6, 0, 0]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          )}

          {(chart.chart_type === 'line' || chart.chart_type === 'area') && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chart.data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey={chart.x_key} axisLine={false} tickLine={false}
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  tickFormatter={v => typeof v === 'string' && v.length > 7 ? v.slice(0, 7) : v} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: 'none',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                    background: 'rgba(255,255,255,0.95)' }}
                  formatter={v => [`${Number(v).toLocaleString()}`, '']} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                {chart.y_keys.map((key, i) => (
                  <Line key={key} type="monotone" dataKey={key}
                    stroke={COLORS[i % COLORS.length]} strokeWidth={3}
                    dot={{ r: 3, fill: COLORS[i % COLORS.length], strokeWidth: 0 }}
                    activeDot={{ r: 5 }} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          )}

          {chart.chart_type === 'pie' && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chart.data} cx="50%" cy="50%"
                  innerRadius={50} outerRadius={80}
                  paddingAngle={3}
                  dataKey={chart.y_keys[0]}
                  nameKey={chart.x_key}>
                  {chart.data.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: 'none',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                    background: 'rgba(255,255,255,0.95)' }}
                  formatter={v => [`${Number(v).toLocaleString()}`, '']} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          )}

          {chart.chart_type === 'scatter' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chart.data} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey={chart.x_key} axisLine={false} tickLine={false}
                  tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                <YAxis axisLine={false} tickLine={false}
                  tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: 'none',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                    background: 'rgba(255,255,255,0.95)' }} />
                {chart.y_keys.map((key, i) => (
                  <Bar key={key} dataKey={key} fill={COLORS[i % COLORS.length]}
                    radius={[4, 4, 0, 0]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="mt-4 flex items-start gap-2 p-3 rounded-xl"
          style={{ backgroundColor: `${PRIMARY}0D` }}>
          <span className="material-symbols-outlined text-sm mt-0.5" style={{ color: PRIMARY }}>
            lightbulb
          </span>
          <p className="text-xs text-slate-600">{chart.insight}</p>
        </div>
      </motion.div>
    );
  };

  const sendMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setMessages(m => [...m, { role: 'user', text: userMsg }]);
    setChatInput('');
    const followUpPrompt = `Previous question was: "${currentPrompt}". 
        The user is now asking a follow-up: "${userMsg}". 
        Apply this as a filter or modification to the existing analysis.`;
    try {
      setMessages(m => [...m, { role: 'ai', text: '⏳ Analyzing...' }]);
      const response = await fetch('http://localhost:8000/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: followUpPrompt, session_id: 'default' })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Error');
      setDashboardData(data);
      setCurrentPrompt(userMsg);
      setMessages(m => [
        ...m.slice(0, -1),
        { role: 'ai', text: `✅ Dashboard updated! ${data.summary}` }
      ]);
    } catch (err) {
      setError(err.message || 'Error');
      setMessages(m => [
        ...m.slice(0, -1),
        { role: 'ai', text: `❌ ${err.message}` }
      ]);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #f8f6f6 60%, #eff6ff 100%)' }}>
      <Sidebar />

      <div className="flex-1 flex overflow-hidden">
        {/* MAIN CONTENT */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto custom-scrollbar">
          {/* GLASS TOPBAR */}
          <div className="px-8 pt-6 pb-4 sticky top-0 z-10 flex items-center justify-between"
            style={{ backdropFilter: 'blur(20px) saturate(180%)', backgroundColor: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.6)' }}>
            <div className="flex items-center gap-4">
              <BackButton />
              <div>
                <h1 className="text-2xl font-black tracking-tight text-[#1A1A1A]">{dashboard_title || 'Your Dashboard'}</h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Results for: <span className="font-mono italic text-slate-500">"{currentPrompt}"</span>
                </p>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold"
              style={{ backgroundColor: `${PRIMARY}15`, color: PRIMARY, border: `1px solid ${PRIMARY}30` }}>
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              Dashboard ready! Analysis complete.
            </motion.div>
          </div>

          <div className="p-8 space-y-6">

            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="p-5 rounded-2xl shadow-sm"
              style={{ ...glassCard, borderLeft: `4px solid ${PRIMARY}` }}>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined mt-0.5" style={{ color: PRIMARY }}>
                  summarize
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-1"
                    style={{ color: PRIMARY }}>Executive Summary</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{summary}</p>
                </div>
              </div>
            </motion.div>

            <details className="group">
              <summary className="cursor-pointer text-xs font-bold text-slate-400
                uppercase tracking-widest hover:text-slate-600 transition-colors
                flex items-center gap-2 select-none">
                <span className="material-symbols-outlined text-sm">code</span>
                View Generated SQL
              </summary>
              <div className="mt-2 p-4 rounded-xl bg-slate-900 overflow-x-auto">
                <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap">
                  {raw_sql}
                </pre>
              </div>
            </details>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {charts.map((chart, index) => {
                const isWide = charts.length % 2 !== 0 && index === charts.length - 1;
                return (
                  <div key={chart.chart_id}
                    className={isWide ? 'xl:col-span-2' : ''}>
                    {renderChart(chart, index)}
                  </div>
                );
              })}
            </div>

          </div>
        </main>

        {/* GLASS CHAT PANEL */}
        <motion.div
          initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
          className="w-80 flex flex-col shrink-0"
          style={{ ...glassCard, borderLeft: '1px solid rgba(255,255,255,0.5)' }}>
          <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-lg" style={{ color: PRIMARY }}>smart_toy</span>
              <span className="text-sm font-bold text-slate-800">QueryIQ AI Analyst</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
              style={{ backgroundColor: `${PRIMARY}18`, color: PRIMARY }}>v2.4</span>
          </div>

          <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-4">
            {messages.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : ''}`}>
                {m.role === 'ai' && (
                  <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: `${PRIMARY}1A` }}>
                    <span className="material-symbols-outlined text-sm" style={{ color: PRIMARY }}>smart_toy</span>
                  </div>
                )}
                <div className="max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed"
                  style={m.role === 'user'
                    ? { backgroundColor: PRIMARY, color: 'white', borderTopRightRadius: 4 }
                    : { backdropFilter: 'blur(8px)', backgroundColor: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.8)', color: '#374151', borderTopLeftRadius: 4 }
                  }>
                  {m.text}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="p-4" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
            <div className="relative">
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                className="w-full rounded-xl pl-4 pr-10 py-3 text-sm focus:outline-none transition-all"
                style={{ backdropFilter: 'blur(8px)', backgroundColor: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.8)', boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.05)' }}
                placeholder="Ask a follow-up question..."
              />
              <button onClick={sendMessage} className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors" style={{ color: PRIMARY }}>
                <span className="material-symbols-outlined text-lg">send</span>
              </button>
            </div>
            <p className="text-[10px] text-center text-slate-400 mt-2">Powered by QueryIQ Advanced Reasoning</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
