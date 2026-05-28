import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../hooks/useAuth';
import '../styles/dashboard.css';

export const Dashboard: React.FC = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  if (!authContext) {
    return <div>Erro ao carregar contexto</div>;
  }

  const { user, logout } = authContext;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { id: 1, title: 'Avaliar Colegas', icon: '👥', path: '/feedback/colleagues', role: ['employee', 'manager', 'admin'] },
    { id: 2, title: 'Avaliar Gestores', icon: '📊', path: '/feedback/managers', role: ['employee'] },
    { id: 3, title: 'Meus Feedbacks', icon: '💬', path: '/my-feedbacks', role: ['employee', 'manager'] },
    { id: 4, title: 'Relatórios', icon: '📈', path: '/reports', role: ['manager', 'admin'] },
    { id: 5, title: 'Estatísticas', icon: '📉', path: '/statistics', role: ['manager', 'admin'] },
    { id: 6, title: 'Usuários', icon: '👤', path: '/users', role: ['admin'] },
  ];

  const visibleItems = menuItems.filter(item => item.role.includes(user?.role || ''));

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>🎯 SemisLua</h1>
          <div className="user-info">
            <span>Olá, <strong>{user?.name}</strong></span>
            <small>({user?.department || 'Não definido'})</small>
          </div>
        </div>
        <button onClick={handleLogout} className="logout-btn">Sair</button>
      </div>

      <div className="dashboard-content">
        <div className="welcome-card">
          <h2>Bem-vindo ao SemisLua!</h2>
          <p>Plataforma de feedback corporativo anônima para desenvolvimento contínuo</p>
        </div>

        <div className="menu-grid">
          {visibleItems.map(item => (
            <div 
              key={item.id} 
              className="menu-card"
              onClick={() => navigate(item.path)}
            >
              <div className="menu-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>→</p>
            </div>
          ))}
        </div>

        <div className="dashboard-info">
          <div className="info-card">
            <h3>📌 Informações de Conta</h3>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Departamento:</strong> {user?.department || 'Não definido'}</p>
            <p><strong>Tipo:</strong> {user?.role === 'employee' ? 'Funcionário' : user?.role === 'manager' ? 'Gestor' : 'Administrador'}</p>
          </div>

          <div className="info-card">
            <h3>💡 Dicas</h3>
            <ul>
              <li>Forneça feedback honesto e construtivo</li>
              <li>Todas as avaliações são anônimas</li>
              <li>Respeite as opiniões de seus colegas</li>
              <li>Use a escala de 1 a 5 para suas avaliações</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
