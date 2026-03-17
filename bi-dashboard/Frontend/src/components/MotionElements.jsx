/**
 * FadeIn — wraps any element/section to animate it into view on mount or scroll.
 * Uses whileInView so elements inside long pages animate as user scrolls to them.
 * GPU-safe: only opacity + translateY.
 */
import { motion } from 'framer-motion';
import { useReducedMotion, getFadeInVariants, getStaggerVariants, childVariant, childVariantReduced } from '../hooks/useMotion';

export function FadeIn({ children, delay = 0, y = 16, className = '', once = true }) {
  const prefersReduced = useReducedMotion();
  const variants = getFadeInVariants(prefersReduced, { delay, y });

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}

/**
 * Stagger — parent container that staggers children in sequence.
 * Each direct child wrapped in <StaggerChild> will animate one by one.
 */
export function Stagger({ children, stagger = 0.08, delay = 0, className = '', once = true }) {
  const prefersReduced = useReducedMotion();
  const variants = getStaggerVariants(prefersReduced, { stagger, delay });

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}

/**
 * StaggerChild — individual item inside a <Stagger> parent.
 */
export function StaggerChild({ children, className = '' }) {
  const prefersReduced = useReducedMotion();
  const variant = prefersReduced ? childVariantReduced : childVariant;

  return (
    <motion.div className={className} variants={variant}>
      {children}
    </motion.div>
  );
}

/**
 * MotionButton — a button with scale on hover/tap.
 * GPU-safe: only uses transform:scale.
 */
export function MotionButton({ children, className = '', style = {}, onClick, disabled = false, type = 'button' }) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={style}
      whileHover={prefersReduced ? {} : { scale: 1.03 }}
      whileTap={prefersReduced ? {} : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    >
      {children}
    </motion.button>
  );
}
