import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '../hooks/useMotion';
import BackButton from '../components/BackButton';
import { useApp } from '../context/AppContext';

const PRIMARY = '#2F8D46';

const STEPS = [
  { label: 'Understanding natural language query...' },
  { label: 'Generating optimized SQL schema...' },
  { label: 'Fetching data from warehouse...' },
  { label: 'Selecting best chart types...' },
  { label: 'Rendering dashboard...' },
];

export default function Generating() {
  const navigate = useNavigate();
  const prefersReduced = useReducedMotion();
  const { currentPrompt, setDashboardData, setError, setIsLoading, addToHistory } = useApp();
  const API_BASE = 'http://localhost:8000';
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Guard: if no prompt, go back to editor
    if (!currentPrompt || !currentPrompt.trim()) {
      navigate('/editor');
      return;
    }

    setIsLoading(true);
    setError(null);

    // Step animation timer — keep exactly as before
    let step = 0;
    const sTimer = setInterval(() => {
      step++;
      setActiveStep(s => Math.min(s + 1, STEPS.length - 1));
      if (step >= STEPS.length - 1) clearInterval(sTimer);
    }, 650);

    // Progress bar animation — keep exactly as before
    const pTimer = setInterval(() => {
      setProgress(p => {
        if (p >= 90) { clearInterval(pTimer); return 90; }
        return p + 1.8;
      });
    }, 55);
    // Note: progress only goes to 90 automatically,
    // it will jump to 100 when API call completes

    // API call
    const fetchDashboard = async () => {
      try {
        const response = await fetch(`${API_BASE}/query`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: currentPrompt,
            session_id: 'default'
          })
        });

        const data = await response.json();

        if (!response.ok) {
          // API returned an error (422, 500, etc.)
          throw new Error(data.detail || 'Failed to generate dashboard');
        }

        // Success
        setDashboardData(data);
        addToHistory(currentPrompt, data);
        setProgress(100);

        // Small delay so user sees 100% before navigating
        setTimeout(() => {
          setIsLoading(false);
          navigate('/dashboard');
        }, 600);

      } catch (err) {
        setError(err.message || 'Something went wrong');
        setIsLoading(false);
        setProgress(0);
        // Navigate back to editor with a small delay
        setTimeout(() => navigate('/editor'), 2000);
      } finally {
        clearInterval(sTimer);
        clearInterval(pTimer);
      }
    };

    fetchDashboard();

    // Cleanup
    return () => {
      clearInterval(sTimer);
      clearInterval(pTimer);
    };
  }, [currentPrompt, navigate]);

  return (
    <div className="flex flex-col min-h-screen" style={{background: 'linear-gradient(135deg, #f0fdf4 0%, #f8f6f6 50%, #eff6ff 100%)'}}>
      {/* GLASS HEADER */}
      <header className="sticky top-0 z-50 w-full border-b border-white/40" style={{backdropFilter: 'blur(20px) saturate(180%)', backgroundColor: 'rgba(255,255,255,0.7)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <BackButton />
              <Link to="/" className="flex items-center gap-2">
                <span className="material-symbols-outlined text-3xl font-bold" style={{color: PRIMARY}}>bar_chart</span>
                <span className="font-mono text-xl font-bold tracking-tighter text-slate-900">QueryIQ</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-slate-500 hover:text-[#2F8D46] transition-colors"><span className="material-symbols-outlined">notifications</span></button>
              <div className="h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm border" style={{backgroundColor: `${PRIMARY}22`, color: PRIMARY, borderColor: `${PRIMARY}44`}}>JD</div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-6 py-16 gap-8 justify-center">
        <motion.div initial={prefersReduced ? {} : {opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.4}}>
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{color: PRIMARY}}>Processing</p>
          <h1 className="text-4xl font-black tracking-tight text-[#1A1A1A] mb-1">Generating Dashboard</h1>
          <p className="text-slate-500 font-mono text-sm truncate max-w-lg">
            "{currentPrompt || 'Processing your query...'}"
          </p>
        </motion.div>

        {/* GLASS STEP CARD */}
        <motion.div
          initial={prefersReduced ? {} : {opacity:0, y:24}}
          animate={{opacity:1, y:0}}
          transition={{duration:0.4, delay:0.15}}
          style={{
            backdropFilter: 'blur(24px) saturate(180%)',
            backgroundColor: 'rgba(255,255,255,0.65)',
            border: '1px solid rgba(255,255,255,0.7)',
            borderLeft: `5px solid ${PRIMARY}`,
          }}
          className="rounded-2xl shadow-xl p-8"
        >
          <ul className="space-y-4 font-mono text-sm">
            {STEPS.map((step, i) => {
              const isDone = i < activeStep;
              const isActive = i === activeStep;
              const isPending = i > activeStep;
              return (
                <motion.li
                  key={i}
                  initial={prefersReduced ? {} : {opacity:0, x:-10}}
                  animate={{opacity: isPending ? 0.35 : 1, x: 0}}
                  transition={{duration:0.3, delay: i * 0.1}}
                  className="flex items-center gap-3"
                >
                  <AnimatePresence mode="wait">
                    {isDone && (
                      <motion.span key="done" initial={{scale:0}} animate={{scale:1}} className="material-symbols-outlined text-lg" style={{color: PRIMARY, fontVariationSettings:"'FILL' 1"}}>check_circle</motion.span>
                    )}
                    {isActive && (
                      <motion.span key="active" className="material-symbols-outlined text-lg loading-spinner" style={{color: PRIMARY}}>sync</motion.span>
                    )}
                    {isPending && (
                      <motion.span key="pending" className="material-symbols-outlined text-lg text-slate-300">circle</motion.span>
                    )}
                  </AnimatePresence>
                  <span className={isDone ? 'text-slate-400 line-through' : isActive ? 'text-[#1A1A1A] font-semibold' : 'text-slate-400'}>{step.label}</span>
                </motion.li>
              );
            })}
          </ul>

          {/* PROGRESS */}
          <div className="mt-8">
            <div className="flex justify-between text-xs text-slate-400 mb-2">
              <span>Processing query</span>
              <span>{Math.min(Math.round(progress), 100)}%</span>
            </div>
            <div className="h-2 w-full rounded-full overflow-hidden" style={{backgroundColor: 'rgba(0,0,0,0.08)'}}>
              <motion.div
                className="h-full rounded-full"
                animate={{width: `${Math.min(progress, 100)}%`}}
                transition={{duration: 0.1, ease: 'linear'}}
                style={{backgroundColor: PRIMARY}}
              />
            </div>
          </div>
        </motion.div>

        {/* PRO TIP — glass */}
        <motion.div
          initial={prefersReduced ? {} : {opacity:0, y:16}}
          animate={{opacity:1, y:0}}
          transition={{duration:0.4, delay:0.3}}
          className="flex gap-3 p-5 rounded-2xl"
          style={{backdropFilter:'blur(16px)', backgroundColor:'rgba(255,255,255,0.55)', border:'1px solid rgba(255,255,255,0.6)'}}
        >
          <span className="material-symbols-outlined text-amber-500 mt-0.5">lightbulb</span>
          <div>
            <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">Pro Tip</p>
            <p className="text-sm text-slate-600">You can specify chart types you prefer, like <em>"Use a heat map for regional sales"</em> to get more precise results.</p>
          </div>
        </motion.div>
      </main>

      <footer className="py-6 border-t border-white/50 text-center text-xs text-slate-400">
        © 2024 QueryIQ Analytics Engine. v2.4.1-stable &nbsp;·&nbsp;
        <a href="#" className="hover:text-[#2F8D46]">Documentation</a> &nbsp;·&nbsp;
        <a href="#" className="hover:text-[#2F8D46]">Privacy</a>
      </footer>
    </div>
  );
}
