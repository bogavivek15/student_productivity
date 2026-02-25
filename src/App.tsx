/* ═══════════════════════════════════════════════════════════════
   App.tsx — Root application shell
   Auth-gated: shows AuthPage for guests, app shell for students
   Mobile-first: bottom nav on mobile, sidebar on desktop
   ═══════════════════════════════════════════════════════════════ */
import React, { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';

/* Layout */
import { MotionSidebar } from './components/layout/MotionSidebar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { Header } from './components/layout/Header';

/* Pages */
import { DashboardPage } from './pages/DashboardPage';
import { TasksPage } from './pages/TasksPage';
import { CalendarPage } from './pages/CalendarPage';
import { SettingsPage } from './pages/SettingsPage';
import { AuthPage } from './pages/AuthPage';

/* Feedback */
import { ToastContainer } from './components/feedback/ToastContainer';
import { Confetti } from './components/feedback/Confetti';

/* Motion wrapper */
import { AnimatedPageWrapper } from './components/motion/AnimatedPageWrapper';
import { SkeletonLoader } from './components/motion/SkeletonLoader';

/* Hooks */
import { useAuth } from './hooks/useAuth';
import { useAppData } from './hooks/useAppData';
import type { RouteId } from './data/types';

const App: React.FC = () => {
  /* ── Auth state ── */
  const {
    session,
    user: authUser,
    loading: authLoading,
    error: authError,
    signUp,
    signIn,
    signOut,
    clearError,
  } = useAuth();

  /* ── Navigation state ── */
  const [route, setRoute] = useState<RouteId>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  /* ── Data from Supabase (scoped to current user) ── */
  const {
    tasks,
    stats,
    user,
    loading: dataLoading,
    toasts,
    addTask,
    changeTaskStatus,
    deleteTask,
    setUser,
    addToast,
    dismissToast,
  } = useAppData(authUser?.id ?? null);

  /* ── Confetti for streak milestones ── */
  const [showConfetti, setShowConfetti] = useState(false);

  /* ── Search handler: navigate to tasks page with search query ── */
  const [searchQuery, setSearchQuery] = useState('');
  const handleSearchSelect = useCallback((taskId: string) => {
    setRoute('tasks');
    setSearchQuery('');
  }, []);

  /* ── Full-screen loading on initial auth check ── */
  if (authLoading && !session) {
    return (
      <div className="flex items-center justify-center h-screen bg-surface-50 dark:bg-surface-950">
        <div className="w-64">
          <SkeletonLoader rows={4} />
        </div>
      </div>
    );
  }

  /* ── Not signed in → Auth page ── */
  if (!session) {
    return (
      <AuthPage
        onSignIn={signIn}
        onSignUp={signUp}
        error={authError}
        clearError={clearError}
        loading={authLoading}
      />
    );
  }

  /* ── Page renderer ── */
  const renderPage = () => {
    if (dataLoading) {
      return (
        <div className="p-4 sm:p-6 max-w-3xl mx-auto">
          <SkeletonLoader rows={6} />
        </div>
      );
    }

    switch (route) {
      case 'dashboard':
        return <DashboardPage tasks={tasks} stats={stats} user={user} />;
      case 'tasks':
        return (
          <TasksPage
            tasks={tasks}
            onAdd={addTask}
            onStatusChange={changeTaskStatus}
            onDelete={deleteTask}
            addToast={addToast}
          />
        );
      case 'calendar':
        return <CalendarPage tasks={tasks} />;
      case 'settings':
        return <SettingsPage user={user} onUpdateProfile={setUser} />;
      default:
        return <DashboardPage tasks={tasks} stats={stats} user={user} />;
    }
  };

  return (
    <div className="flex h-screen bg-surface-50 dark:bg-surface-950 text-surface-900 dark:text-surface-100 overflow-hidden">
      {/* Sidebar — hidden on mobile */}
      <div className="hidden md:block">
        <MotionSidebar
          currentRoute={route}
          onNavigate={setRoute}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((p) => !p)}
          onLogout={signOut}
        />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <Header
          userName={user.name}
          streak={user.streak}
          email={authUser?.email}
          tasks={tasks}
          onSearchSelect={handleSearchSelect}
          onNavigateToTasks={() => setRoute('tasks')}
        />

        {/* Page content with animated transitions */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden pb-16 md:pb-0">
          <AnimatePresence mode="wait">
            <AnimatedPageWrapper key={route} pageKey={route}>
              {renderPage()}
            </AnimatedPageWrapper>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile bottom nav — visible only on mobile */}
      <MobileBottomNav
        currentRoute={route}
        onNavigate={setRoute}
        onLogout={signOut}
      />

      {/* Overlays */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      <Confetti show={showConfetti} />
    </div>
  );
};

export default App;
