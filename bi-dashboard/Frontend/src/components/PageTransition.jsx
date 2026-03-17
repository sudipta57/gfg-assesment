import { motion } from 'framer-motion';
import { useReducedMotion, getPageVariants } from '../hooks/useMotion';

export default function PageTransition({ pathname, children }) {
  const prefersReduced = useReducedMotion();
  const variants = getPageVariants(prefersReduced);

  return (
    <motion.div
      key={pathname}
      initial={variants.initial}
      animate={variants.animate}
      exit={variants.exit}
      transition={{ duration: prefersReduced ? 0.01 : 0.3, ease: 'easeOut' }}
      style={{ width: '100%', minHeight: '100%' }}
    >
      {children}
    </motion.div>
  );
}
