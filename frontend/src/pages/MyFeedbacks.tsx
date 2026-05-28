import React, { useState, useEffect } from 'react';
import { feedbackService } from '../services/api';
import '../styles/my-feedbacks.css';

interface Feedback {
  id: number;
  rating: number;
  comment?: string;
  feedback_type: string;
  created_at: string;
  evaluator_name: string;
}

interface Stats {
  total_feedbacks: number;
  average_rating: number;
  lowest_rating: number;
  highest_rating: number;
  positive_count: number;
  negative_count: number;
  by_type: Array<{ feedback_type: string; count: number; average: number }>;
}

export const MyFeedbacks: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'colleagues' | 'managers'>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [feedbacksRes, statsRes] = await Promise.all([
        feedbackService.getReceivedFeedbacks(),
        feedbackService.getFeedbackStats()
      ]);
      setFeedbacks(feedbacksRes.data);
      setStats(statsRes.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar feedbacks');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredFeedbacks = feedbacks.filter(f => {
    if (activeTab === 'all') return true;
    if (activeTab === 'colleagues') return f.feedback_type === 'colleague';
    if (activeTab === 'managers') return f.feedback_type === 'manager';
    return true;
  });

  const getRatingColor = (rating: number): string => {
    if (rating <= 2) return '#e74c3c';
    if (rating <= 3) return '#f39c12';
    return '#27ae60';
  };

  const getRatingLabel = (rating: number): string => {
    if (rating === 1) return 'Insatisfatório';
    if (rating === 2) return 'Ruim';
    if (rating === 3) return 'Neutro';
    if (rating === 4) return 'Bom';
    return 'Excelente';
  };

  if (isLoading) {
    return <div className="loading">Carregando feedbacks...</div>;
  }

  return (
    <div className="my-feedbacks">
      <div className="feedbacks-header">
        <h1>💬 Meus Feedbacks</h1>
        <p>Visualize os feedbacks que você recebeu de seus colegas e gestores</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Estatísticas */}
      {stats && stats.total_feedbacks > 0 && (
        <div className="stats-container">
          <div className="stat-card">
            <h3>Total de Feedbacks</h3>
            <p className="stat-value">{stats.total_feedbacks}</p>
          </div>
          <div className="stat-card">
            <h3>Média de Avaliação</h3>
            <p className="stat-value" style={{ color: getRatingColor(stats.average_rating) }}>
              {stats.average_rating.toFixed(1)}
              <span className="stat-unit">/5</span>
            </p>
          </div>
          <div className="stat-card">
            <h3>Feedbacks Positivos</h3>
            <p className="stat-value" style={{ color: '#27ae60' }}>
              {stats.positive_count}
              <span className="stat-unit">✓</span>
            </p>
          </div>
          <div className="stat-card">
            <h3>Feedbacks Críticos</h3>
            <p className="stat-value" style={{ color: '#e74c3c' }}>
              {stats.negative_count}
              <span className="stat-unit">!</span>
            </p>
          </div>
        </div>
      )}

      {/* Abas de filtro */}
      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          Todos ({feedbacks.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'colleagues' ? 'active' : ''}`}
          onClick={() => setActiveTab('colleagues')}
        >
          De Colegas ({feedbacks.filter(f => f.feedback_type === 'colleague').length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'managers' ? 'active' : ''}`}
          onClick={() => setActiveTab('managers')}
        >
          De Gestores ({feedbacks.filter(f => f.feedback_type === 'manager').length})
        </button>
      </div>

      {/* Lista de feedbacks */}
      {filteredFeedbacks.length === 0 ? (
        <div className="empty-state">
          <p>📭 Nenhum feedback recebido ainda</p>
          <small>Peça aos seus colegas para avaliarem você!</small>
        </div>
      ) : (
        <div className="feedbacks-list">
          {filteredFeedbacks.map(feedback => (
            <div key={feedback.id} className="feedback-card">
              <div className="feedback-header">
                <div className="feedback-info">
                  <h4>
                    {feedback.feedback_type === 'colleague' ? '👥 Colega' : '👔 Gestor'}
                  </h4>
                  <small>{feedback.evaluator_name}</small>
                </div>
                <div className="rating-badge" style={{ backgroundColor: getRatingColor(feedback.rating) }}>
                  <span>{feedback.rating}</span>
                </div>
              </div>

              <div className="rating-description">
                {getRatingLabel(feedback.rating)}
              </div>

              {feedback.comment && (
                <div className="feedback-comment">
                  <p>"{feedback.comment}"</p>
                </div>
              )}

              <div className="feedback-date">
                {new Date(feedback.created_at).toLocaleDateString('pt-BR')}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Por tipo de feedback */}
      {stats && stats.by_type && stats.by_type.length > 0 && (
        <div className="breakdown-section">
          <h3>📊 Breakdown por Tipo</h3>
          <div className="breakdown-grid">
            {stats.by_type.map(item => (
              <div key={item.feedback_type} className="breakdown-card">
                <h4>{item.feedback_type === 'colleague' ? '👥 De Colegas' : '👔 De Gestores'}</h4>
                <p className="breakdown-count">{item.count} feedback{item.count !== 1 ? 's' : ''}</p>
                <p className="breakdown-avg">
                  Média: <strong>{item.average.toFixed(1)}</strong>/5
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
