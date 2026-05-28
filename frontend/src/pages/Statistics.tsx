import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../hooks/useAuth';
import { reportsService } from '../services/api';
import '../styles/statistics.css';

interface UserAverage {
  id: number;
  name: string;
  department: string;
  role: string;
  feedback_count: number;
  average_rating: number;
  colleague_feedbacks: number;
  colleague_avg: number;
  manager_feedbacks: number;
  manager_avg: number;
}

export const Statistics: React.FC = () => {
  const authContext = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [averages, setAverages] = useState<UserAverage[]>([]);
  const [filteredAverages, setFilteredAverages] = useState<UserAverage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'feedback_count' | 'name'>('rating');
  const [filterRole, setFilterRole] = useState<'all' | 'employee' | 'manager'>('all');

  if (!authContext) {
    return <div>Erro ao carregar contexto</div>;
  }

  useEffect(() => {
    loadAverages();
  }, []);

  useEffect(() => {
    filterAndSortData();
  }, [averages, searchTerm, sortBy, filterRole]);

  const loadAverages = async () => {
    try {
      setIsLoading(true);
      const response = await reportsService.getUserAverages();
      setAverages(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar estatísticas');
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortData = () => {
    let filtered = averages.filter(user => {
      const matchSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.department && user.department.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchRole = filterRole === 'all' || user.role === filterRole;
      
      return matchSearch && matchRole;
    });

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'rating') {
        return b.average_rating - a.average_rating;
      } else if (sortBy === 'feedback_count') {
        return b.feedback_count - a.feedback_count;
      } else {
        return a.name.localeCompare(b.name);
      }
    });

    setFilteredAverages(filtered);
  };

  const getRatingColor = (rating: number): string => {
    if (rating === 0) return '#bdc3c7';
    if (rating <= 2) return '#e74c3c';
    if (rating <= 3) return '#f39c12';
    return '#27ae60';
  };

  const getRatingLabel = (rating: number): string => {
    if (rating === 0) return 'Sem dados';
    if (rating <= 2) return 'Insatisfatório';
    if (rating <= 3) return 'Aceitável';
    return 'Excelente';
  };

  if (isLoading) {
    return <div className="loading">Carregando estatísticas...</div>;
  }

  return (
    <div className="statistics-page">
      <div className="statistics-header">
        <h1>📊 Estatísticas de Avaliação</h1>
        <p>Visualize as médias de avaliação de todos os usuários</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Filtros */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar por nome ou departamento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
            <option value="rating">Ordenar por: Nota</option>
            <option value="feedback_count">Ordenar por: Feedback Count</option>
            <option value="name">Ordenar por: Nome</option>
          </select>

          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value as any)}>
            <option value="all">Todos os Tipos</option>
            <option value="employee">Apenas Funcionários</option>
            <option value="manager">Apenas Gestores</option>
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="summary-cards">
        <div className="summary-card">
          <h3>Total de Usuários Avaliados</h3>
          <p className="summary-value">{filteredAverages.length}</p>
        </div>
        <div className="summary-card">
          <h3>Média Geral</h3>
          <p className="summary-value" style={{
            color: getRatingColor(filteredAverages.length > 0 
              ? filteredAverages.reduce((a, b) => a + b.average_rating, 0) / filteredAverages.length 
              : 0)
          }}>
            {filteredAverages.length > 0 
              ? (filteredAverages.reduce((a, b) => a + b.average_rating, 0) / filteredAverages.length).toFixed(2)
              : 'N/A'}
          </p>
        </div>
        <div className="summary-card">
          <h3>Total de Feedbacks</h3>
          <p className="summary-value">
            {filteredAverages.reduce((a, b) => a + b.feedback_count, 0)}
          </p>
        </div>
      </div>

      {/* Tabela de Estatísticas */}
      <div className="statistics-table-container">
        <table className="statistics-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Tipo</th>
              <th>Departamento</th>
              <th className="rating-col">
                Nota
                <br />
                <small>Geral</small>
              </th>
              <th className="rating-col">
                Feedbacks
                <br />
                <small>Total</small>
              </th>
              <th className="rating-col">
                Colegas
                <br />
                <small>Nota</small>
              </th>
              <th className="rating-col">
                Gestores
                <br />
                <small>Nota</small>
              </th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredAverages.map(user => (
              <tr key={user.id}>
                <td className="user-name">{user.name}</td>
                <td className="user-role">
                  {user.role === 'employee' ? '👥 Funcionário' : '👔 Gestor'}
                </td>
                <td>{user.department || 'N/A'}</td>
                <td>
                  <div className="rating-cell">
                    <div
                      className="rating-dot"
                      style={{ backgroundColor: getRatingColor(user.average_rating) }}
                    />
                    <span>{user.average_rating.toFixed(2)}</span>
                  </div>
                </td>
                <td>
                  <span className="feedback-count">{user.feedback_count}</span>
                </td>
                <td>
                  {user.colleague_feedbacks > 0 ? (
                    <div className="rating-cell">
                      <div
                        className="rating-dot"
                        style={{ backgroundColor: getRatingColor(user.colleague_avg) }}
                      />
                      <span>{user.colleague_avg.toFixed(2)}</span>
                    </div>
                  ) : (
                    <span className="no-data">—</span>
                  )}
                </td>
                <td>
                  {user.manager_feedbacks > 0 ? (
                    <div className="rating-cell">
                      <div
                        className="rating-dot"
                        style={{ backgroundColor: getRatingColor(user.manager_avg) }}
                      />
                      <span>{user.manager_avg.toFixed(2)}</span>
                    </div>
                  ) : (
                    <span className="no-data">—</span>
                  )}
                </td>
                <td>
                  <span className={`status-badge ${user.average_rating >= 4 ? 'good' : user.average_rating >= 3 ? 'ok' : 'alert'}`}>
                    {getRatingLabel(user.average_rating)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredAverages.length === 0 && (
        <div className="empty-state">
          <p>📭 Nenhum resultado encontrado</p>
          <small>Tente ajustar seus filtros</small>
        </div>
      )}
    </div>
  );
};
