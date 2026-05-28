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

export const EvaluateColleagues: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const response = await feedbackService.getEvaluableUsers();
      setUsers(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar usuários');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.department && user.department.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (!selectedUser) {
    return (
      <div className="evaluate-page">
        <div className="evaluate-header">
          <h1>👥 Avaliar Colegas</h1>
          <p>Forneça feedback honesto e construtivo para seus colegas de trabalho</p>
        </div>

        <div className="evaluate-content">
          <div className="search-box">
            <input
              type="text"
              placeholder="Buscar colega por nome ou departamento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          {isLoading ? (
            <div className="loading">Carregando colegas...</div>
          ) : filteredUsers.length === 0 ? (
            <PagePlaceholder
              title="Nenhum colega encontrado"
              icon="🔍"
              description="Tente ajustar sua busca"
            />
          ) : (
            <div className="users-grid">
              {filteredUsers.map(user => (
                <div
                  key={user.id}
                  className="user-card"
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="user-avatar">👤</div>
                  <h3>{user.name}</h3>
                  <p className="user-dept">{user.department || 'Sem departamento'}</p>
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
        <h1>👥 Avaliar Colegas</h1>
      </div>

      <div className="evaluate-content form-container">
        <FeedbackForm
          evaluatedId={selectedUser.id}
          evaluatedName={selectedUser.name}
          feedbackType="colleague"
          onSuccess={() => {
            setSelectedUser(null);
            loadUsers();
          }}
        />
      </div>
    </div>
  );
};
