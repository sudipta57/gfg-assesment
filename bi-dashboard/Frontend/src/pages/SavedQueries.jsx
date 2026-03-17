import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FadeIn, Stagger, StaggerChild } from '../components/MotionElements';
import BackButton from '../components/BackButton';

const PRIMARY = '#2F8D46';

const glassCard = {
  backdropFilter: 'blur(20px) saturate(180%)',
  backgroundColor: 'rgba(255,255,255,0.72)',
  border: '1px solid rgba(255,255,255,0.8)',
};

const SAVED = [
  { id: 1, query: 'SELECT DATE_FORMAT(sale_date,\'%Y-%m\') as month, region, SUM(revenue) FROM sales GROUP BY month, region ORDER BY month;', label: 'Monthly revenue by region', tags: ['Finance', 'Regional'], savedAt: 'Mar 15', uses: 12, icon: 'trending_up' },
  { id: 2, query: 'SELECT customer_id, SUM(order_total) as ltv FROM orders GROUP BY customer_id ORDER BY ltv DESC LIMIT 10;', label: 'Top 10 customers by LTV', tags: ['CRM', 'Revenue'], savedAt: 'Mar 14', uses: 8, icon: 'star' },
  { id: 3, query: 'SELECT DATE_FORMAT(created_at,\'%Y-%W\') as week, COUNT(*) as active_users FROM users WHERE last_active > NOW() - INTERVAL 7 DAY GROUP BY week;', label: 'Weekly active users trend', tags: ['Product', 'Engagement'], savedAt: 'Mar 12', uses: 5, icon: 'people' },
  { id: 4, query: 'SELECT team_id, DATE(created_at) as day, COUNT(*) as tickets FROM support_tickets GROUP BY team_id, day ORDER BY day DESC;', label: 'Support ticket volume by team', tags: ['Ops', 'Support'], savedAt: 'Mar 10', uses: 3, icon: 'support_agent' },
  { id: 5, query: 'SELECT product_id, COUNT(*) as churned, COUNT(*)*100.0/(SELECT COUNT(*) FROM subscriptions) as rate FROM subscriptions WHERE status=\'churned\' AND QUARTER(end_date)=3 GROUP BY product_id;', label: 'Churn rate Q3 by product', tags: ['Product', 'Retention'], savedAt: 'Mar 8', uses: 7, icon: 'data_loss_prevention' },
  { id: 6, query: 'SELECT region, product_category, SUM(units_sold) as units, SUM(revenue) as revenue, AVG(unit_price) as avg_price FROM sales WHERE YEAR(sale_date)=2024 GROUP BY region, product_category;', label: 'Regional product performance 2024', tags: ['Finance', 'Sales'], savedAt: 'Mar 5', uses: 4, icon: 'leaderboard' },
];

const TAG_COLORS = {
  Finance: '#2F8D46', Revenue: '#16a34a', Regional: '#0284c7', CRM: '#7c3aed',
  Product: '#d97706', Engagement: '#ea580c', Ops: '#0891b2', Support: '#dc2626',
  Retention: '#9333ea', Sales: '#059669',
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
        <Link to="/history" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-white/60 transition-colors">
          <span className="material-symbols-outlined text-lg">history</span>
          <span className="text-sm font-medium">Query History</span>
        </Link>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold" style={{backgroundColor:`${PRIMARY}12`, color:PRIMARY}}>
          <span className="material-symbols-outlined text-lg">bookmark</span>
          <span className="text-sm">Saved Queries</span>
        </div>
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

export default function SavedQueries() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState(null);

  const allTags = [...new Set(SAVED.flatMap(s => s.tags))];
  const filtered = SAVED.filter(s => {
    const matchSearch = !search || s.label.toLowerCase().includes(search.toLowerCase());
    const matchTag = !activeTag || s.tags.includes(activeTag);
    return matchSearch && matchTag;
  });

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
              <h1 className="text-2xl font-black tracking-tight text-[#1A1A1A]">Saved Queries</h1>
              <p className="text-xs text-slate-400 mt-0.5">Your curated library of reusable queries</p>
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
                placeholder="Search saved..."
              />
            </div>
          </div>
        </div>

        <div className="p-8 space-y-6">
          {/* TAG FILTERS */}
          <FadeIn>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTag(null)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${!activeTag ? 'text-white border-transparent' : 'bg-white border-slate-200 text-slate-500 hover:border-[#2F8D46]'}`}
                style={!activeTag ? {backgroundColor: PRIMARY} : {}}
              >All</button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(t => t === tag ? null : tag)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${activeTag === tag ? 'text-white border-transparent' : 'bg-white border-slate-200 text-slate-500 hover:border-[#2F8D46]'}`}
                  style={activeTag === tag ? {backgroundColor: TAG_COLORS[tag] || PRIMARY} : {}}
                >{tag}</button>
              ))}
            </div>
          </FadeIn>

          {/* QUERY CARDS */}
          <Stagger stagger={0.07} className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {filtered.map(s => (
              <StaggerChild key={s.id}>
                <div
                  className="rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all group cursor-pointer flex flex-col gap-4 h-full"
                  style={glassCard}
                  onClick={() => navigate('/editor')}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{backgroundColor:`${PRIMARY}15`}}>
                      <span className="material-symbols-outlined text-base" style={{color:PRIMARY}}>{s.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 mb-1 group-hover:text-[#2F8D46] transition-colors">{s.label}</p>
                      <p className="text-[11px] text-slate-400">Saved {s.savedAt} · Used {s.uses} times</p>
                    </div>
                    <motion.button whileHover={{scale:1.1}} className="text-slate-300 hover:text-amber-400 transition-colors" onClick={e => e.stopPropagation()}>
                      <span className="material-symbols-outlined text-lg" style={{fontVariationSettings:"'FILL' 1"}}>bookmark</span>
                    </motion.button>
                  </div>

                  {/* SQL Preview — Mac dark style */}
                  <div className="rounded-xl overflow-hidden" style={{backgroundColor:'#13131f'}}>
                    <div className="flex items-center gap-1.5 px-3 py-2" style={{backgroundColor:'#1e1e2e', borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                      <div className="w-2 h-2 rounded-full bg-[#ff5f57]" /><div className="w-2 h-2 rounded-full bg-[#febc2e]" /><div className="w-2 h-2 rounded-full bg-[#28c840]" />
                      <span className="ml-2 text-[10px] font-mono text-slate-500">query.sql</span>
                    </div>
                    <p className="px-4 py-3 font-mono text-[11px] leading-relaxed text-[#a8d8b9] line-clamp-2">{s.query}</p>
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex flex-wrap gap-1.5">
                      {s.tags.map(tag => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full font-semibold text-white" style={{backgroundColor: TAG_COLORS[tag] || PRIMARY}}>{tag}</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}} onClick={e => { e.stopPropagation(); navigate('/editor'); }}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white" style={{backgroundColor:PRIMARY}}>
                        Run
                      </motion.button>
                    </div>
                  </div>
                </div>
              </StaggerChild>
            ))}
          </Stagger>

          {filtered.length === 0 && (
            <FadeIn>
              <div className="text-center py-20 text-slate-400">
                <span className="material-symbols-outlined text-5xl mb-4 block">bookmark_remove</span>
                <p className="font-medium">No saved queries match your filter</p>
              </div>
            </FadeIn>
          )}
        </div>
      </main>
    </div>
  );
}
