import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useMediaQuery } from './hooks/useMediaQuery';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import CRM from './pages/crm/CRM';
import Dashboard from './pages/dashboard/Dashboard';
import FinancialCalculator from './pages/calculator/FinancialCalculator';
import Insights from './pages/insights/Insights';
import Integrations from './pages/integrations/Integrations';
import Settings from './pages/settings/Settings';

function PageTransition({ children }) {
  const reduceMotion = useReducedMotion();
  const isMobileViewport = useMediaQuery('(max-width: 767.98px)');
  /** Mobile: sem animação de entrada/saída — menos trabalho de composição na rolagem. */
  const instant = Boolean(reduceMotion || isMobileViewport);
  return (
    <motion.div
      initial={{ opacity: instant ? 1 : 0, y: instant ? 0 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: instant ? 1 : 0, y: instant ? 0 : -10 }}
      transition={{ duration: instant ? 0 : 0.22, ease: 'easeOut' }}
      className="h-full min-h-0 min-w-0 w-full"
    >
      {children}
    </motion.div>
  );
}

function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
            <Route path="/crm" element={<PageTransition><CRM /></PageTransition>} />
            <Route path="/calculadora" element={<PageTransition><FinancialCalculator /></PageTransition>} />
            <Route path="/insights" element={<PageTransition><Insights /></PageTransition>} />
            <Route path="/integracoes" element={<PageTransition><Integrations /></PageTransition>} />
            <Route path="/mensagens" element={<Navigate to="/dashboard" replace />} />
            <Route path="/finance" element={<Navigate to="/dashboard" replace />} />
            
            {/* Fallbacks/Aliases */}
            <Route path="/settings" element={<PageTransition><Settings /></PageTransition>} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>

        {/* Global Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
