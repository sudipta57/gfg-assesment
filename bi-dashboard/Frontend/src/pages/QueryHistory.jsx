import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { FadeIn, Stagger, StaggerChild } from '../components/MotionElements';
import BackButton from '../components/BackButton';
import { useApp } from '../context/AppContext';

const PRIMARY = '#2F8D46';

const glassCard = {
  backdropFilter: 'blur(20px) saturate(180%)',
  backgroundColor: 'rgba(255,255,255,0.72)',
  border: '1px solid rgba(255,255,255,0.8)',
};

function Sidebar() {
  return (
    <aside className="w-64 hidden lg:flex flex-col p-5 shrink-0 h-full" style={{...glassCard, borderRight:'1px solid rgba(255,255,255,0.5)', backdropFilter:'blur(24px)'}}>
      <Link to="/" className="flex items-center gap-2 px-2 mb-6">
        <span className="material-symbols-outlined text-2xl" style={{color: PRIMARY}}>bar_chart</span>
        <span className="font-mono text-lg font-bold tracking-tighter text-slate-900">QueryIQ</span>
      </Link>
      <nav className="space-y-1 flex-1">
        <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-white/60 transition-colors">
          <span className="material-symbols-outlined text-lg">dashboard</span>
          <span className="text-sm font-medium">Dashboard</span>
        </Link>
        <Link to="/editor" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-white/60 transition-colors">
          <span className="material-symbols-outlined text-lg">edit_note</span>
          <span className="text-sm font-medium">Query Editor</span>
        </Link>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold" style={{backgroundColor:`${PRIMARY}12`, color:PRIMARY}}>
          <span className="material-symbols-outlined text-lg">history</span>
          <span className="text-sm">Query History</span>
        </div>
        <Link to="/saved" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-white/60 transition-colors">
          <span className="material-symbols-outlined text-lg">bookmark</span>
          <span className="text-sm font-medium">Saved Queries</span>
        </Link>
      </nav>
      <div className="mt-auto flex items-center gap-3 px-2">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border" style={{backgroundColor:`${PRIMARY}22`, color:PRIMARY, borderColor:`${PRIMARY}44`}}>JD</div>
        <div>
          <p className="text-xs font-bold">Alex Chen</p>
          <p className="text-[10px] text-slate-400">Sr. Data Analyst</p>
        </div>
      </div>
    </aside>
  );
}

export default function QueryHistory() {
  const navigate = useNavigate();
  const { queryHistory, setCurrentPrompt, setDashboardData } = useApp();
  const [search, setSearch] = useState('');
  const filtered = queryHistory.filter(h =>
    h.prompt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{background:'linear-gradient(135deg, #f0fdf4 0%, #f8f6f6 60%, #eff6ff 100%)'}}>
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* TOPBAR */}
        <div className="px-8 pt-6 pb-4 sticky top-0 z-10 flex items-center justify-between"
          style={{backdropFilter:'blur(20px) saturate(180%)', backgroundColor:'rgba(255,255,255,0.7)', borderBottom:'1px solid rgba(255,255,255,0.6)'}}>
          <div className="flex items-center gap-4">
            <BackButton />
            <div>
              <h1 className="text-2xl font-black tracking-tight text-[#1A1A1A]">Query History</h1>
              <p className="text-xs text-slate-400 mt-0.5">All your previously executed queries</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="material-symbols-outlined text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 text-base">search</span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl text-sm border border-slate-200 focus:outline-none focus:border-[#2F8D46] w-56"
                style={{backdropFilter:'blur(8px)', backgroundColor:'rgba(255,255,255,0.8)'}}
                placeholder="Search queries..."
              />
            </div>
          </div>
        </div>

        <div className="p-8 space-y-4">
          <FadeIn>
            <p className="text-xs text-slate-400 font-medium">{queryHistory.length} total · {filtered.length} shown</p>
          </FadeIn>

          <Stagger stagger={0.06} className="space-y-3">
            {filtered.map((h, index) => (
              <StaggerChild key={index}>
                <div
                  className="rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group cursor-pointer"
                  style={glassCard}
                  onClick={() => {
                    setDashboardData(h.dashboardData)
                    setCurrentPrompt(h.prompt)
                    navigate('/dashboard')
                  }}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                        style={{backgroundColor:`${PRIMARY}15`}}>
                        <span className="material-symbols-outlined text-base" style={{color:PRIMARY}}>
                          bar_chart
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 mb-1">
                          {h.dashboardData?.dashboard_title || h.prompt}
                        </p>
                        <code className="text-xs text-slate-400 font-mono block truncate">
                          {h.prompt}
                        </code>
                        <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">schedule</span>
                            {h.timestamp}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">bar_chart</span>
                            {h.dashboardData?.charts?.length || 0} charts
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Motion.button
                        whileHover={{scale:1.05}} whileTap={{scale:0.95}}
                        onClick={e => {
                          e.stopPropagation()
                          setCurrentPrompt(h.prompt)
                          navigate('/generating')
                        }}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors hover:border-[#2F8D46] hover:text-[#2F8D46]"
                        style={{borderColor:'rgba(0,0,0,0.1)'}}
                      >
                        Re-run
                      </Motion.button>
                      <Motion.button
                        whileHover={{scale:1.05}} whileTap={{scale:0.95}}
                        onClick={e => {
                          e.stopPropagation()
                          setDashboardData(h.dashboardData)
                          setCurrentPrompt(h.prompt)
                          navigate('/dashboard')
                        }}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white"
                        style={{backgroundColor:PRIMARY}}
                      >
                        View
                      </Motion.button>
                    </div>
                  </div>
                </div>
              </StaggerChild>
            ))}
          </Stagger>

          {queryHistory.length === 0 ? (
            <FadeIn>
              <div className="text-center py-20 text-slate-400">
                <span className="material-symbols-outlined text-5xl mb-4 block">history</span>
                <p className="font-medium mb-2">No queries yet</p>
                <p className="text-sm mb-6">Your query history will appear here after you generate a dashboard.</p>
                <Link to="/editor"
                  className="text-sm font-bold px-6 py-2.5 rounded-xl text-white inline-block"
                  style={{backgroundColor: PRIMARY}}>
                  Ask your first question
                </Link>
              </div>
            </FadeIn>
          ) : filtered.length === 0 ? (
            <FadeIn>
              <div className="text-center py-20 text-slate-400">
                <span className="material-symbols-outlined text-5xl mb-4 block">manage_search</span>
                <p className="font-medium">No queries match your search</p>
              </div>
            </FadeIn>
          ) : null}
        </div>
      </main>
    </div>
  );
}
