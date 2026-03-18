import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FadeIn, Stagger, StaggerChild, MotionButton } from '../components/MotionElements';

const PRIMARY = '#2F8D46';

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    { icon: 'chat', title: 'Natural Language Querying', desc: 'Type complex analytical questions and get immediate answers without knowing a single SQL command.' },
    { icon: 'insights', title: 'Smart Chart Selection', desc: 'Our AI identifies whether a bar, line, pie, or scatter plot best represents your findings automatically.' },
    { icon: 'upload_file', title: 'CSV Upload', desc: 'Instantly analyze standalone data files or connect directly to your production database with zero friction.' },
    { icon: 'forum', title: 'Chat Follow-ups', desc: 'Iterate on your findings. "Now show me that by month" or "Filter for the EMEA region only."' },
    { icon: 'bolt', title: 'Real-time Rendering', desc: 'Low-latency processing ensures your dashboards update as fast as you can think of questions.' },
    { icon: 'verified_user', title: 'Hallucination Guard', desc: 'Verified logic checks ensure the AI-generated SQL is accurate to your schema and data types.' },
  ];

  const steps = [
    { step: '1', title: 'Ask in Plain English', desc: "Type your query just like you're talking to a teammate. No syntax errors, no complexity." },
    { step: '2', title: 'AI Queries Data', desc: 'Our engine translates your prompt into optimized SQL and fetches real-time data securely.' },
    { step: '3', title: 'Dashboard Renders Instantly', desc: 'The best chart for your data is automatically selected and rendered in a beautiful dashboard.' },
  ];

  return (
    <div className="bg-[#f8f6f6] text-[#1A1A1A] min-h-screen">
      {/* HEADER */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-[#f8f6f6]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <span className="material-symbols-outlined text-3xl font-bold" style={{ color: PRIMARY }}>bar_chart</span>
              <span className="font-mono text-xl font-bold tracking-tighter text-slate-900">QueryIQ</span>
            </Link>
            <nav className="hidden md:flex items-center gap-8">

              <Link to="/upload" className="text-sm font-medium hover:text-[#2F8D46] transition-colors">Upload</Link>
              <Link to="/editor" className="text-sm font-medium hover:text-[#2F8D46] transition-colors">Editor</Link>
              <Link to="/dashboard" className="text-sm font-medium hover:text-[#2F8D46] transition-colors">Dashboard</Link>
            </nav>

          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:gap-16">
            <div className="lg:w-3/5 space-y-8">
              <FadeIn delay={0}>
                <div className="inline-flex items-center px-3 py-1 rounded-full border text-sm font-semibold" style={{ backgroundColor: `${PRIMARY}1A`, borderColor: `${PRIMARY}33`, color: PRIMARY }}>
                  AI-Powered BI Tool
                </div>
              </FadeIn>
              <FadeIn delay={0.1}>
                <h1 className="text-5xl lg:text-7xl font-black leading-tight tracking-tight text-slate-900">
                  Turn Plain English Into <span style={{ color: PRIMARY }}>Instant Dashboards</span>
                </h1>
              </FadeIn>
              <FadeIn delay={0.2}>
                <p className="text-xl text-slate-600 max-w-2xl">
                  Stop writing SQL. QueryIQ connects to your data and builds professional visualizations in seconds.
                </p>
              </FadeIn>
              <FadeIn delay={0.3}>
                <div className="flex flex-wrap gap-4">
                  <MotionButton onClick={() => navigate('/upload')} className="text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg" style={{ backgroundColor: PRIMARY }}>
                    Get Started Free
                  </MotionButton>
                  <MotionButton onClick={() => navigate('/editor')} className="border-2 border-slate-300 hover:border-[#2F8D46] text-slate-700 px-8 py-4 rounded-xl font-bold text-lg transition-colors">
                    View Demo
                  </MotionButton>
                </div>
              </FadeIn>
            </div>
            <FadeIn delay={0.2} className="hidden lg:block lg:w-2/5 mt-12 lg:mt-0">
              <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 overflow-hidden">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="rounded-lg border p-4" style={{ backgroundColor: `${PRIMARY}0D`, borderColor: `${PRIMARY}4D` }}>
                    <p className="text-sm font-mono" style={{ color: PRIMARY }}>"Show me monthly sales growth for the last quarter by region"</p>
                  </div>
                  <div className="h-40 bg-slate-50 rounded-lg flex items-end justify-between p-4 gap-2">
                    {[50, 75, 100, 65, 85, 90].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, backgroundColor: PRIMARY, opacity: h / 100 + 0.3 }}></div>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn><h2 className="text-3xl font-bold text-center mb-16">How It Works</h2></FadeIn>
          <Stagger className="grid md:grid-cols-3 gap-12" stagger={0.12}>
            {steps.map(({ step, title, desc }) => (
              <StaggerChild key={step}>
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full text-white flex items-center justify-center text-2xl font-bold" style={{ backgroundColor: PRIMARY }}>{step}</div>
                  <h3 className="text-xl font-bold">{title}</h3>
                  <p className="text-slate-600">{desc}</p>
                </div>
              </StaggerChild>
            ))}
          </Stagger>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 bg-[#1A1A1A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="mb-16">
              <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
              <p className="text-slate-400 text-lg">Everything you need to master your data analytics workflow.</p>
            </div>
          </FadeIn>
          <Stagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" stagger={0.07}>
            {features.map(({ icon, title, desc }) => (
              <StaggerChild key={title}>
                <div className="bg-slate-800/40 p-8 rounded-xl border border-slate-700 hover:border-[#2F8D46] transition-colors group h-full">
                  <span className="material-symbols-outlined text-4xl mb-4 block group-hover:scale-110 transition-transform" style={{ color: PRIMARY }}>{icon}</span>
                  <h3 className="text-xl font-bold mb-2">{title}</h3>
                  <p className="text-slate-400">{desc}</p>
                </div>
              </StaggerChild>
            ))}
          </Stagger>
        </div>
      </section>

      {/* EXAMPLES */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn><h2 className="text-3xl font-bold mb-12 text-center">Try These Examples</h2></FadeIn>
          <Stagger className="grid md:grid-cols-3 gap-6" stagger={0.1}>
            {[
              { n: '01', q: '"Show me monthly sales trends for the last 12 months, stacked by category."' },
              { n: '02', q: '"Which product category has the highest churn rate in Q3 compared to last year?"' },
              { n: '03', q: '"Compare YoY growth of active subscribers across our top 5 cities."' },
            ].map(({ n, q }) => (
              <StaggerChild key={n}>
                <div className="p-6 rounded-lg bg-white border-l-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer" style={{ borderColor: PRIMARY }} onClick={() => navigate('/editor')}>
                  <code className="font-mono text-sm block mb-2" style={{ color: PRIMARY }}>Query #{n}</code>
                  <p className="font-mono text-slate-700">{q}</p>
                </div>
              </StaggerChild>
            ))}
          </Stagger>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#1A1A1A] text-slate-300 py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-2xl font-bold" style={{ color: PRIMARY }}>bar_chart</span>
                <span className="font-mono text-xl font-bold text-white tracking-tighter">QueryIQ</span>
              </div>
              <p className="text-sm leading-relaxed max-w-xs">Empowering teams to make data-driven decisions using natural language and advanced AI.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Quick Links</h4>
              <ul className="space-y-4 text-sm">
                <li><Link to="/upload" className="hover:text-[#2F8D46] transition-colors">CSV Upload</Link></li>
                <li><Link to="/editor" className="hover:text-[#2F8D46] transition-colors">SQL Editor</Link></li>
                <li><Link to="/dashboard" className="hover:text-[#2F8D46] transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Connect</h4>
              <ul className="space-y-4 text-sm">
                <li><a className="flex items-center gap-2 hover:text-[#2F8D46] transition-colors" href="#"><span className="material-symbols-outlined text-lg">alternate_email</span>Contact Support</a></li>
                <li><a className="flex items-center gap-2 hover:text-[#2F8D46] transition-colors" href="#"><span className="material-symbols-outlined text-lg">hub</span>Developer API</a></li>
                <li><a className="flex items-center gap-2 hover:text-[#2F8D46] transition-colors" href="#"><span className="material-symbols-outlined text-lg">group</span>Join Community</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
            <p>© 2024 QueryIQ Analytics. All rights reserved.</p>
            <div className="flex gap-6">
              <a className="hover:text-white transition-colors" href="#">Twitter</a>
              <a className="hover:text-white transition-colors" href="#">LinkedIn</a>
              <a className="hover:text-white transition-colors" href="#">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
