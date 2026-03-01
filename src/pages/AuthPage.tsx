/* ═══════════════════════════════════════════════════════════════
   AuthPage — Email + Password login / signup with motion
   ═══════════════════════════════════════════════════════════════ */
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2 } from 'lucide-react';
import { MotionInput } from '../components/motion/MotionInput';
import { MotionButton } from '../components/motion/MotionButton';
import { MotionCard } from '../components/motion/MotionCard';
import {
  staggerContainer,
  staggerItem,
  spring,
  slideUpVariants,
  shakeVariants,
} from '../design-system/motion';

type AuthMode = 'signin' | 'signup';

interface Props {
  onSignIn: (email: string, password: string) => Promise<boolean>;
  onSignUp: (email: string, password: string, name: string) => Promise<boolean>;
  error: string | null;
  clearError: () => void;
  loading: boolean;
}

export const AuthPage: React.FC<Props> = ({
  onSignIn,
  onSignUp,
  error,
  clearError,
  loading,
}) => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [validationError, setValidationError] = useState('');

  const switchMode = useCallback(
    (newMode: AuthMode) => {
      setMode(newMode);
      setValidationError('');
      clearError();
    },
    [clearError],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setValidationError('');
      clearError();

      if (!email.trim()) {
        setValidationError('Please enter your email');
        return;
      }
      if (password.length < 6) {
        setValidationError('Password must be at least 6 characters');
        return;
      }
      if (mode === 'signup' && !name.trim()) {
        setValidationError('Please enter your name');
        return;
      }

      if (mode === 'signin') {
        await onSignIn(email.trim(), password);
      } else {
        const ok = await onSignUp(email.trim(), password, name.trim());
        if (ok) {
          // Auto-sign in after successful signup
          await onSignIn(email.trim(), password);
        }
      }
    },
    [email, password, name, mode, onSignIn, onSignUp, clearError],
  );

  const displayError = validationError || error;

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-950 px-4">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        {/* ── Brand ── */}
        <motion.div variants={staggerItem} className="text-center mb-8">
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={spring.delight}
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent-500 mb-4"
          >
            <Sparkles className="w-7 h-7 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-surface-900 dark:text-white">
            StudyFlow
          </h1>
          <p className="text-sm text-surface-500 mt-1">
            Your calm, focused productivity companion
          </p>
        </motion.div>

        {/* ── Auth Card ── */}
        <motion.div variants={staggerItem}>
          <MotionCard className="p-6">
            {/* Tab switcher */}
            <div className="relative flex mb-6 bg-surface-100 dark:bg-surface-800 rounded-lg p-1">
              {(['signin', 'signup'] as AuthMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  className={`
                    relative flex-1 py-2 text-sm font-medium rounded-md
                    transition-colors duration-150 z-10
                    ${
                      mode === m
                        ? 'text-accent-600 dark:text-accent-400'
                        : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'
                    }
                  `}
                >
                  {m === 'signin' ? 'Sign In' : 'Sign Up'}
                  {mode === m && (
                    <motion.div
                      layoutId="auth-tab-indicator"
                      className="absolute inset-0 bg-white dark:bg-surface-700 rounded-md shadow-sm -z-10"
                      transition={spring.responsive}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {mode === 'signup' && (
                  <motion.div
                    key="name-field"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MotionInput
                      label="Full name"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setValidationError('');
                      }}
                      type="text"
                      autoComplete="name"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <MotionInput
                label="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setValidationError('');
                  clearError();
                }}
                type="email"
                autoComplete="email"
              />

              <MotionInput
                label="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setValidationError('');
                  clearError();
                }}
                type="password"
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              />

              {/* Error message */}
              <AnimatePresence>
                {displayError && (
                  <motion.div
                    variants={shakeVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="p-3 rounded-lg bg-danger-50 dark:bg-danger-500/10 border border-danger-200 dark:border-danger-500/20"
                  >
                    <p className="text-xs text-danger-600 dark:text-danger-400">
                      {displayError}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit button */}
              <MotionButton
                type="submit"
                variant="primary"
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : mode === 'signin' ? (
                  'Sign In'
                ) : (
                  'Create Account'
                )}
              </MotionButton>
            </form>

            {/* Footer hint */}
            <p className="mt-4 text-center text-xs text-surface-400">
              {mode === 'signin' ? (
                <>
                  Dont have an account?{' '}
                  <button
                    onClick={() => switchMode('signup')}
                    className="text-accent-500 hover:text-accent-600 font-medium"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    onClick={() => switchMode('signin')}
                    className="text-accent-500 hover:text-accent-600 font-medium"
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          </MotionCard>
        </motion.div>

        {/* Bottom tagline */}
        <motion.p
          variants={staggerItem}
          className="mt-6 text-center text-xs text-surface-400"
        >
          Built for students, by students.
        </motion.p>
      </motion.div>
    </div>
  );
};
