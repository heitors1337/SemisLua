import React, { useState, useEffect } from 'react';
import { PagePlaceholder } from '../components/PagePlaceholder';
import { FeedbackForm } from '../components/FeedbackForm';
import { feedbackService } from '../services/api';
import '../styles/evaluate-page.css';

interface User {
  id: number;
  name: string;
  department?: string;
  role: string;
}

export const EvaluateManagers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    loadManagers();
  }, []);

  const loadManagers = async () => {
    try {
      setIsLoading(true);
      const response = await feedbackService.getEvaluableUsers('managers');
      setUsers(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar gestores');
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedUser) {
    return (
      <div className="evaluate-page">
        <div className="evaluate-header">
          <h1>📊 Avaliar Gestores</h1>
          <p>Contribua com melhorias na liderança fornecendo feedback anônimo</p>
        </div>

        <div className="evaluate-content">
          {error && <div className="error-message">{error}</div>}

          {isLoading ? (
            <div className="loading">Carregando gestores...</div>
          ) : users.length === 0 ? (
            <PagePlaceholder
              title="Nenhum gestor encontrado"
              icon="👤"
              description="Não há gestores disponíveis para avaliar"
            />
          ) : (
            <div className="users-grid">
              {users.map(user => (
                <div
                  key={user.id}
                  className="user-card manager"
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="user-avatar">👔</div>
                  <h3>{user.name}</h3>
                  <p className="user-dept">{user.department || 'Sem departamento'}</p>
                  <p className="user-role">Gestor</p>
                  <button className="evaluate-btn">Avaliar</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="evaluate-page">
      <div className="evaluate-header">
        <button className="back-btn" onClick={() => setSelectedUser(null)}>
          ← Voltar
        </button>
        <h1>📊 Avaliar Gestores</h1>
      </div>

      <div className="evaluate-content form-container">
        <FeedbackForm
          evaluatedId={selectedUser.id}
          evaluatedName={selectedUser.name}
          feedbackType="manager"
          onSuccess={() => {
            setSelectedUser(null);
            loadManagers();
          }}
        />
      </div>
    </div>
  );
};
