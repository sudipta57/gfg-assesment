import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FadeIn, Stagger, StaggerChild, MotionButton } from '../components/MotionElements';

const PRIMARY = '#2F8D46';

function Sidebar() {
  return (
    <aside className="w-64 border-r border-slate-200 hidden lg:flex flex-col p-4 gap-2 bg-white h-full shrink-0">
      <Link to="/" className="flex items-center gap-2 px-3 mb-4">
        <span className="material-symbols-outlined text-2xl" style={{color: PRIMARY}}>bar_chart</span>
        <span className="font-mono text-lg font-bold tracking-tighter text-slate-900">QueryIQ</span>
      </Link>
      <div className="flex items-center gap-3 px-3 py-2 rounded-xl mb-2" style={{backgroundColor: `${PRIMARY}1A`, color: PRIMARY}}>
        <span className="material-symbols-outlined">dashboard</span>
        <p className="text-sm font-bold">Dashboard</p>
      </div>
      <Link to="/editor" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-xl cursor-pointer">
        <span className="material-symbols-outlined">analytics</span>
        <p className="text-sm font-medium">Deep Analysis</p>
      </Link>
      <div className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-xl cursor-pointer">
        <span className="material-symbols-outlined">history</span>
        <p className="text-sm font-medium">Query History</p>
      </div>
      <div className="mt-auto">
        <div className="p-4 rounded-xl border" style={{backgroundColor: `${PRIMARY}0D`, borderColor: `${PRIMARY}22`}}>
          <p className="text-xs font-bold mb-1" style={{color: PRIMARY}}>PRO PLAN</p>
          <p className="text-[11px] text-slate-500 mb-3">85% of monthly tokens used.</p>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div className="h-full w-[85%] rounded-full" style={{backgroundColor: PRIMARY}}></div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default function Editor() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('-- Write your SQL query here...\nSELECT * FROM main_production.sales\nLIMIT 100;');

  const suggestions = ['Show me monthly sales trend', 'Top products by revenue', 'Churn rate by region Q1', 'User growth YoY'];

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8f6f6]">
      <Sidebar />
      <main className="flex-1 flex flex-col bg-[#f8f6f6] overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <span>Workspace</span>
            <span>/</span>
            <span className="font-semibold text-[#1A1A1A]">SQL Editor</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg"><span className="material-symbols-outlined">settings</span></button>
            <div className="h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold border" style={{backgroundColor: `${PRIMARY}22`, color: PRIMARY, borderColor: `${PRIMARY}44`}}>JD</div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <FadeIn>
              <div>
                <h2 className="text-2xl font-bold text-[#1A1A1A] mb-1">Query Editor</h2>
                <p className="text-slate-500 text-sm">Write SQL or use the AI assistant to fetch data from your warehouse.</p>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border-b border-slate-200">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider ml-2">query.sql</span>
                </div>
                <textarea
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  className="w-full h-64 p-6 font-mono text-sm resize-none bg-white focus:ring-0 border-none outline-none text-slate-800"
                  spellCheck={false}
                />
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Quick Starts</p>
                <Stagger className="flex flex-wrap gap-2" stagger={0.05}>
                  {suggestions.map(s => (
                    <StaggerChild key={s}>
                      <button
                        onClick={() => setQuery(`-- ${s}\nSELECT * FROM main_production.sales LIMIT 100;`)}
                        className="px-4 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-semibold hover:border-[#2F8D46] hover:text-[#2F8D46] transition-colors shadow-sm"
                      >{s}</button>
                    </StaggerChild>
                  ))}
                </Stagger>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="flex justify-end">
                <MotionButton
                  onClick={() => navigate('/generating')}
                  disabled={!query.trim()}
                  className="text-white font-bold py-3 px-10 rounded-xl flex items-center gap-3 shadow-lg disabled:opacity-40"
                  style={{backgroundColor: PRIMARY}}
                >
                  <span className="material-symbols-outlined">play_arrow</span>
                  Run Query
                </MotionButton>
              </div>
            </FadeIn>
          </div>
        </div>
      </main>
    </div>
  );
}
