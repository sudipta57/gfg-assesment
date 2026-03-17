import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { FadeIn, Stagger, StaggerChild } from '../components/MotionElements';

const PRIMARY = '#2F8D46';

const revenueData = [
  { month: 'Jul', value: 42 },{ month: 'Aug', value: 58 },{ month: 'Sep', value: 47 },
  { month: 'Oct', value: 74 },{ month: 'Nov', value: 100 },{ month: 'Dec', value: 85 },
];
const regionData = [
  { name: 'North', value: 34 },{ name: 'South', value: 27 },{ name: 'East', value: 22 },{ name: 'West', value: 17 },
];
const COLORS = [PRIMARY, '#86efac', '#4ade80', '#22c55e'];
const conversionData = [
  { month: 'Jul', rate: 2.8 },{ month: 'Aug', rate: 3.0 },{ month: 'Sep', rate: 2.9 },
  { month: 'Oct', rate: 3.1 },{ month: 'Nov', rate: 3.2 },{ month: 'Dec', rate: 3.4 },
];
const topProducts = [
  { name: 'Cloud Suite Pro', rev: '$189,000', share: '45%', growth: '+18%' },
  { name: 'Enterprise License', rev: '$126,000', share: '30%', growth: '+12%' },
  { name: 'Analytics Add-on', rev: '$63,000', share: '15%', growth: '+5%' },
  { name: 'API Credits', rev: '$42,000', share: '10%', growth: '-2%' },
];

// Shared glass card style
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
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{backgroundColor: `${PRIMARY}1A`, color: PRIMARY}}>
          <span className="material-symbols-outlined text-lg">dashboard</span>
          <span className="text-sm font-bold">Dashboard</span>
        </div>
        <Link to="/editor" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-white/60 transition-colors">
          <span className="material-symbols-outlined text-lg">analytics</span>
          <span className="text-sm font-medium">Deep Analysis</span>
        </Link>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-white/60 transition-colors cursor-pointer">
          <span className="material-symbols-outlined text-lg">history</span>
          <span className="text-sm font-medium">Query History</span>
        </div>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-white/60 transition-colors cursor-pointer">
          <span className="material-symbols-outlined text-lg">bookmark</span>
          <span className="text-sm font-medium">Saved Queries</span>
        </div>
      </nav>

      <div className="mt-auto space-y-4">
        <div className="p-4 rounded-xl" style={{backgroundColor: `${PRIMARY}0D`, border:`1px solid ${PRIMARY}22`}}>
          <p className="text-xs font-bold mb-1" style={{color: PRIMARY}}>PRO PLAN</p>
          <p className="text-[11px] text-slate-500 mb-3">85% of monthly tokens used.</p>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div className="h-full w-[85%] rounded-full" style={{backgroundColor: PRIMARY}}></div>
          </div>
        </div>
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border" style={{backgroundColor: `${PRIMARY}22`, color: PRIMARY, borderColor: `${PRIMARY}44`}}>JD</div>
          <div>
            <p className="text-xs font-bold">Alex Chen</p>
            <p className="text-[10px] text-slate-400">Sr. Data Analyst</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default function Dashboard() {
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'I\'ve analyzed your data. North region leads revenue at 34%, showing strong recovery since Q3. The spike in December coincides with the "Pro" tier rollout.' },
    { role: 'user', text: 'What caused the spike in December?' },
    { role: 'ai', text: 'The December spike was primarily driven by a 24% increase in Enterprise renewals and the successful launch of Cloud Suite Pro in the North region.' },
  ]);

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setMessages(m => [...m, { role: 'user', text: userMsg }]);
    setChatInput('');
    setTimeout(() => setMessages(m => [...m, { role: 'ai', text: `Analyzing "${userMsg}"... based on the data, I can see a clear pattern here.` }]), 1000);
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{background: 'linear-gradient(135deg, #f0fdf4 0%, #f8f6f6 60%, #eff6ff 100%)'}}>
      <Sidebar />

      <div className="flex-1 flex overflow-hidden">
        {/* MAIN CONTENT */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto custom-scrollbar">
          {/* GLASS TOPBAR */}
          <div
            className="px-8 pt-6 pb-4 sticky top-0 z-10 flex items-center justify-between"
            style={{backdropFilter:'blur(20px) saturate(180%)', backgroundColor:'rgba(255,255,255,0.7)', borderBottom:'1px solid rgba(255,255,255,0.6)'}}
          >
            <div>
              <h1 className="text-2xl font-black tracking-tight text-[#1A1A1A]">Your Dashboard</h1>
              <p className="text-xs text-slate-400 mt-0.5">Results for: <span className="font-mono italic text-slate-500">"monthly sales trend by region"</span></p>
            </div>
            <motion.div
              initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} transition={{delay:0.3}}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold"
              style={{backgroundColor:`${PRIMARY}15`, color:PRIMARY, border:`1px solid ${PRIMARY}30`}}
            >
              <span className="material-symbols-outlined text-sm" style={{fontVariationSettings:"'FILL' 1"}}>check_circle</span>
              Dashboard ready! Analysis complete.
            </motion.div>
          </div>

          <div className="p-8 grid grid-cols-1 xl:grid-cols-2 gap-8">

            {/* REVENUE BAR */}
            <StaggerChild>
              <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:0.4,delay:0.05}} className="p-6 rounded-2xl shadow-lg h-full" style={glassCard}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-slate-500 text-xs uppercase tracking-wider">Revenue Growth</h3>
                    <p className="text-3xl font-black mt-1" style={{color: PRIMARY}}>$420,400</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">+12.5%</span>
                </div>
                <p className="text-xs text-slate-400 mb-4">vs last period</p>
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData} barSize={28}>
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize:11, fill:'#9CA3AF'}} />
                      <Tooltip cursor={{fill:'rgba(47,141,70,0.06)'}} contentStyle={{borderRadius:12, border:'none', boxShadow:'0 8px 32px rgba(0,0,0,0.12)', backdropFilter:'blur(8px)', background:'rgba(255,255,255,0.9)'}} />
                      <Bar dataKey="value" fill={PRIMARY} radius={[6,6,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <a href="#" className="text-xs font-bold mt-3 block" style={{color: PRIMARY}}>Drill down →</a>
              </motion.div>
            </StaggerChild>

            {/* REGIONAL PIE */}
            <StaggerChild>
              <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:0.4,delay:0.12}} className="p-6 rounded-2xl shadow-lg h-full" style={glassCard}>
                <div className="mb-2">
                  <h3 className="font-bold text-slate-500 text-xs uppercase tracking-wider">Regional Breakdown</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Market share distribution</p>
                </div>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={regionData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                        {regionData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{borderRadius:12, border:'none', boxShadow:'0 8px 32px rgba(0,0,0,0.12)', background:'rgba(255,255,255,0.9)'}} formatter={v => `${v}%`} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{fontSize:12}} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <a href="#" className="text-xs font-bold mt-2 block" style={{color: PRIMARY}}>Drill down →</a>
              </motion.div>
            </StaggerChild>

            {/* CONVERSION LINE — full width */}
            <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:0.4,delay:0.2}} className="xl:col-span-2 p-6 rounded-2xl shadow-lg" style={glassCard}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-slate-500 text-xs uppercase tracking-wider">Conversion Rate</h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-3xl font-black" style={{color: PRIMARY}}>3.2%</p>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">+0.4%</span>
                  </div>
                </div>
                <a href="#" className="text-xs font-bold" style={{color: PRIMARY}}>Drill down →</a>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={conversionData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize:11, fill:'#9CA3AF'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize:11, fill:'#9CA3AF'}} domain={[2.5, 3.6]} tickFormatter={v => `${v}%`} />
                    <Tooltip contentStyle={{borderRadius:12, border:'none', boxShadow:'0 8px 32px rgba(0,0,0,0.12)', background:'rgba(255,255,255,0.9)'}} formatter={v => `${v}%`} />
                    <Line type="monotone" dataKey="rate" stroke={PRIMARY} strokeWidth={3} dot={{r:4, fill:PRIMARY, strokeWidth:0}} activeDot={{r:6}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* TOP PRODUCTS TABLE — full width */}
            <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:0.4,delay:0.28}} className="xl:col-span-2 p-6 rounded-2xl shadow-lg" style={glassCard}>
              <div className="flex justify-between items-start mb-5">
                <div>
                  <h3 className="font-bold text-slate-500 text-xs uppercase tracking-wider">Top Performing Products</h3>
                  <p className="text-xs text-slate-400 mt-0.5">By revenue contribution</p>
                </div>
                <a href="#" className="text-xs font-bold" style={{color: PRIMARY}}>Drill down →</a>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-slate-400 uppercase tracking-wider border-b border-slate-100">
                      <th className="text-left pb-3 font-semibold">Product</th>
                      <th className="text-right pb-3 font-semibold">Revenue</th>
                      <th className="text-right pb-3 font-semibold">Share</th>
                      <th className="text-right pb-3 font-semibold">Growth</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {topProducts.map((p, i) => (
                      <tr key={i} className="hover:bg-green-50/40 transition-colors">
                        <td className="py-3.5 font-medium text-slate-800">{p.name}</td>
                        <td className="py-3.5 text-right font-mono text-slate-600">{p.rev}</td>
                        <td className="py-3.5 text-right text-slate-400">{p.share}</td>
                        <td className="py-3.5 text-right">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${p.growth.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>{p.growth}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

          </div>
        </main>

        {/* GLASS CHAT PANEL */}
        <motion.div
          initial={{opacity:0, x:40}} animate={{opacity:1, x:0}} transition={{duration:0.4, delay:0.2}}
          className="w-80 flex flex-col shrink-0"
          style={{...glassCard, borderLeft:'1px solid rgba(255,255,255,0.5)'}}
        >
          <div className="p-4 flex items-center justify-between" style={{borderBottom:'1px solid rgba(0,0,0,0.06)'}}>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-lg" style={{color: PRIMARY}}>smart_toy</span>
              <span className="text-sm font-bold text-slate-800">QueryIQ AI Analyst</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider" style={{backgroundColor:`${PRIMARY}18`, color:PRIMARY}}>v2.4</span>
          </div>

          <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-4">
            {messages.map((m, i) => (
              <motion.div key={i} initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} transition={{delay: i*0.05}} className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : ''}`}>
                {m.role === 'ai' && (
                  <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{backgroundColor:`${PRIMARY}1A`}}>
                    <span className="material-symbols-outlined text-sm" style={{color:PRIMARY}}>smart_toy</span>
                  </div>
                )}
                <div
                  className="max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed"
                  style={m.role === 'user'
                    ? {backgroundColor: PRIMARY, color:'white', borderTopRightRadius:4}
                    : {backdropFilter:'blur(8px)', backgroundColor:'rgba(255,255,255,0.7)', border:'1px solid rgba(255,255,255,0.8)', color:'#374151', borderTopLeftRadius:4}
                  }
                >
                  {m.text}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="p-4" style={{borderTop:'1px solid rgba(0,0,0,0.06)'}}>
            <div className="relative">
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                className="w-full rounded-xl pl-4 pr-10 py-3 text-sm focus:outline-none transition-all"
                style={{backdropFilter:'blur(8px)', backgroundColor:'rgba(255,255,255,0.7)', border:'1px solid rgba(255,255,255,0.8)', boxShadow:'inset 0 1px 4px rgba(0,0,0,0.05)'}}
                placeholder="Ask a follow-up question..."
              />
              <button onClick={sendMessage} className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors" style={{color:PRIMARY}}>
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
