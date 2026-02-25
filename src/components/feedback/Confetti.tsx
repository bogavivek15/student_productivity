/* Confetti — Micro confetti celebration for streaks and milestones */
import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  show: boolean;
  particleCount?: number;
}

const colors = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4', '#a855f7'];

export const Confetti: React.FC<Props> = ({ show, particleCount = 24 }) => {
  const particles = useMemo(
    () =>
      Array.from({ length: particleCount }).map((_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 300,
        y: -(100 + Math.random() * 150),
        rotate: Math.random() * 720 - 360,
        scale: 0.4 + Math.random() * 0.8,
        color: colors[i % colors.length],
        delay: Math.random() * 0.3,
      })),
    [particleCount],
  );

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 0 }}
              animate={{
                opacity: [1, 1, 0],
                x: p.x,
                y: p.y,
                rotate: p.rotate,
                scale: p.scale,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 1.2,
                delay: p.delay,
                ease: [0.2, 0.8, 0.4, 1],
              }}
              className="absolute w-2.5 h-2.5 rounded-sm"
              style={{ backgroundColor: p.color }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};
