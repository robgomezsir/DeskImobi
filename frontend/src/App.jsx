import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import CRM from './pages/crm/CRM';
import Dashboard from './pages/dashboard/Dashboard';
import FinancialCalculator from './pages/calculator/FinancialCalculator';
import MessageGenerator from './pages/messages/MessageGenerator';

// Placeholder components
const Dashboard = () => <div className="space-y-4">
  <h2 className="text-3xl font-display font-bold">Dashboard</h2>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="glass p-6 rounded-2xl h-32 flex flex-col justify-center">
      <p className="text-gray-400 text-sm">Leads Totais</p>
      <p className="text-4xl font-display font-bold">124</p>
    </div>
    <div className="glass p-6 rounded-2xl h-32 flex flex-col justify-center">
      <p className="text-gray-400 text-sm">Conversões</p>
      <p className="text-4xl font-display font-bold">18</p>
    </div>
    <div className="glass p-6 rounded-2xl h-32 bg-primary-600/10 border-primary-600/20 flex flex-col justify-center">
      <p className="text-primary-400 text-sm font-semibold">Mensagens IA</p>
      <p className="text-4xl font-display font-bold">42</p>
    </div>
  </div>
</div>;

const CRM = () => <div className="space-y-4">
  <h2 className="text-3xl font-display font-bold">CRM Clientes</h2>
  <div className="glass p-12 rounded-3xl border-dashed flex flex-col items-center justify-center text-gray-500">
    <p>O módulo de CRM está sendo preparado.</p>
  </div>
</div>;

const Login = () => <div className="min-h-screen flex items-center justify-center bg-dark-950 p-4">
  <div className="w-full max-w-md glass p-8 rounded-3xl space-y-6">
    <div className="text-center space-y-2">
      <h1 className="text-3xl font-display font-bold">ImobiFlow<span className="text-primary-500">AI</span></h1>
      <p className="text-gray-400">Entre na sua conta para continuar</p>
    </div>
    <div className="space-y-4">
      <input type="email" placeholder="E-mail" className="input-field" />
      <input type="password" placeholder="Senha" className="input-field" />
      <button className="btn btn-primary w-full py-3 h-12 text-lg">Entrar</button>
    </div>
    <div className="text-center text-sm text-gray-400">
      Não tem conta? <a href="#" className="text-primary-500 font-semibold hover:underline">Solicite acesso</a>
    </div>
  </div>
</div>;

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/crm" element={<CRM />} />
          <Route path="/mensagens" element={<MessageGenerator />} />
          <Route path="/calculadora" element={<FinancialCalculator />} />
          <Route path="/calculator" element={<div className="text-3xl font-display font-bold">Calculadora de Fluxo</div>} />
          <Route path="/generator" element={<div className="text-3xl font-display font-bold">Gerador de Mensagens IA</div>} />
          <Route path="/insights" element={<div className="text-3xl font-display font-bold">Insights de IA</div>} />
          <Route path="/settings" element={<div className="text-3xl font-display font-bold">Configurações</div>} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
