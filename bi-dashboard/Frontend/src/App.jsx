import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './components/PageTransition';
import LandingPage   from './pages/LandingPage';
import CsvUpload     from './pages/CsvUpload';
import Editor        from './pages/Editor';
import Generating    from './pages/Generating';
import Dashboard     from './pages/Dashboard';
import QueryHistory  from './pages/QueryHistory';
import SavedQueries  from './pages/SavedQueries';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"          element={<PageTransition pathname="/"><LandingPage /></PageTransition>} />
        <Route path="/upload"    element={<PageTransition pathname="/upload"><CsvUpload /></PageTransition>} />
        <Route path="/editor"    element={<PageTransition pathname="/editor"><Editor /></PageTransition>} />
        <Route path="/generating" element={<PageTransition pathname="/generating"><Generating /></PageTransition>} />
        <Route path="/dashboard" element={<PageTransition pathname="/dashboard"><Dashboard /></PageTransition>} />
        <Route path="/history"   element={<PageTransition pathname="/history"><QueryHistory /></PageTransition>} />
        <Route path="/saved"     element={<PageTransition pathname="/saved"><SavedQueries /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
