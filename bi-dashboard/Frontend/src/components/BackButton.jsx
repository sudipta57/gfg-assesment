import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function BackButton({ className = '' }) {
  const navigate = useNavigate();
  return (
    <motion.button
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      onClick={() => navigate(-1)}
      className={`group relative flex items-center justify-center w-9 h-9 rounded-xl overflow-hidden ${className}`}
      style={{
        background: 'rgba(255,255,255,0.65)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.9)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8)',
      }}
      title="Go back"
    >
      {/* Hover fill */}
      <motion.span
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl"
        style={{ background: 'linear-gradient(135deg, rgba(47,141,70,0.12), rgba(47,141,70,0.06))' }}
      />
      {/* Arrow icon */}
      <motion.span
        className="material-symbols-outlined text-[20px] relative z-10 text-slate-500 group-hover:text-[#2F8D46] transition-colors"
        animate={{}}
        whileHover={{ x: -1 }}
        style={{ fontVariationSettings: "'wght' 350" }}
      >
        chevron_left
      </motion.span>
    </motion.button>
  );
}

