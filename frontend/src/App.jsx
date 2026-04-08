import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import CRM from './pages/crm/CRM';
import Dashboard from './pages/dashboard/Dashboard';
import FinancialCalculator from './pages/calculator/FinancialCalculator';
import MessageGenerator from './pages/messages/MessageGenerator';
import Finance from './pages/finance/Finance';
import Insights from './pages/insights/Insights';
import Settings from './pages/settings/Settings';

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
    className="h-full min-h-0 min-w-0 w-full"
  >
    {children}
  </motion.div>
);

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
            <Route path="/mensagens" element={<PageTransition><MessageGenerator /></PageTransition>} />
            <Route path="/calculadora" element={<PageTransition><FinancialCalculator /></PageTransition>} />
            <Route path="/finance" element={<PageTransition><Finance /></PageTransition>} />
            <Route path="/insights" element={<PageTransition><Insights /></PageTransition>} />
            
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
