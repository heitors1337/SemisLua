import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { PrivateRoute } from './components/PrivateRoute';
import { PagePlaceholder } from './components/PagePlaceholder';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { EvaluateColleagues } from './pages/EvaluateColleagues';
import { EvaluateManagers } from './pages/EvaluateManagers';
import { MyFeedbacks } from './pages/MyFeedbacks';
import './styles/global.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          {/* US02 - Dashboard (implemented) */}
          {/* US03 - Navigation between screens (routing implemented) */}

          {/* US04 - Avaliar Colegas */}
          <Route
            path="/feedback/colleagues"
            element={
              <PrivateRoute>
                <EvaluateColleagues />
              </PrivateRoute>
            }
          />

          {/* US05 - Avaliar Gestores */}
          <Route
            path="/feedback/managers"
            element={
              <PrivateRoute>
                <EvaluateManagers />
              </PrivateRoute>
            }
          />

          {/* US06 - Enviar feedback (implementado no formulário) */}
          {/* US - Meus Feedbacks */}
          <Route
            path="/my-feedbacks"
            element={
              <PrivateRoute>
                <MyFeedbacks />
              </PrivateRoute>
            }
          />

          {/* Placeholder pages for future sprints */}
          <Route
            path="/reports"
            element={
              <PrivateRoute>
                <PagePlaceholder 
                  title="Relatórios" 
                  icon="📈"
                  description="Gere e visualize relatórios de desempenho"
                />
              </PrivateRoute>
            }
          />

          <Route
            path="/statistics"
            element={
              <PrivateRoute>
                <PagePlaceholder 
                  title="Estatísticas" 
                  icon="📉"
                  description="Análise detalhada de métricas e estatísticas"
                />
              </PrivateRoute>
            }
          />

          <Route
            path="/users"
            element={
              <PrivateRoute>
                <PagePlaceholder 
                  title="Gerenciar Usuários" 
                  icon="👤"
                  description="Administre usuários da plataforma"
                />
              </PrivateRoute>
            }
          />

          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
