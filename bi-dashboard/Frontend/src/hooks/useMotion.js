/**
 * useReducedMotion — returns true if the user has requested reduced motion.
 * All animation systems in the app must respect this.
 */
import { useState, useEffect } from 'react';

export function useReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e) => setPrefersReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return prefersReduced;
}

/**
 * getPageVariants — returns framer-motion variants for page transitions.
 * Falls back to instant transitions (no motion) when reduced motion is preferred.
 * 
 * All values animate ONLY opacity + transform (y/scale) — GPU-accelerated.
 * Never animates width, height, margin, or padding.
 */
export function getPageVariants(prefersReduced) {
  if (prefersReduced) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit:    { opacity: 0 },
    };
  }
  return {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit:    { opacity: 0, y: -20 },
  };
}

/**
 * getFadeInVariants — for individual elements fading into view.
 * GPU-safe: only opacity + translateY.
 */
export function getFadeInVariants(prefersReduced, { delay = 0, y = 16 } = {}) {
  if (prefersReduced) {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.01 } },
    };
  }
  return {
    hidden: { opacity: 0, y },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] } },
  };
}

/**
 * getStaggerVariants — parent container that staggers its children in.
 */
export function getStaggerVariants(prefersReduced, { stagger = 0.08, delay = 0 } = {}) {
  if (prefersReduced) {
    return {
      hidden: {},
      visible: { transition: { staggerChildren: 0 } },
    };
  }
  return {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };
}

/**
 * childVariant — individual staggered child (GPU-safe).
 */
export const childVariant = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

export const childVariantReduced = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.01 } },
};
