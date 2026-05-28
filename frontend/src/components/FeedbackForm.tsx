import React, { useState } from 'react';
import { feedbackService } from '../services/api';
import '../styles/feedback-form.css';

interface FeedbackFormProps {
  evaluatedId: number;
  evaluatedName: string;
  feedbackType: 'colleague' | 'manager';
  onSuccess?: () => void;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({
  evaluatedId,
  evaluatedName,
  feedbackType,
  onSuccess
}) => {
  const [rating, setRating] = useState(3);
  const [comment, setComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await feedbackService.sendFeedback(
        evaluatedId,
        rating,
        comment,
        isAnonymous,
        feedbackType
      );

      setSuccess(true);
      setComment('');
      setRating(3);
      
      setTimeout(() => {
        setSuccess(false);
        if (onSuccess) onSuccess();
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao enviar feedback');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="feedback-form">
      <h3>Avaliar: <strong>{evaluatedName}</strong></h3>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nota (1-5)</label>
          <div className="rating-selector">
            {[1, 2, 3, 4, 5].map(value => (
              <button
                key={value}
                type="button"
                className={`rating-btn ${rating === value ? 'active' : ''}`}
                onClick={() => setRating(value)}
              >
                {value}
              </button>
            ))}
          </div>
          <div className="rating-display">
            <span>{'⭐'.repeat(rating)}</span>
            <span className="rating-text">
              {rating === 1 && 'Insatisfatório'}
              {rating === 2 && 'Ruim'}
              {rating === 3 && 'Neutro'}
              {rating === 4 && 'Bom'}
              {rating === 5 && 'Excelente'}
            </span>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="comment">Comentário (opcional)</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Deixe um comentário construtivo..."
            rows={4}
            maxLength={500}
          />
          <small>{comment.length}/500</small>
        </div>

        <div className="form-group checkbox">
          <input
            id="anonymous"
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
          />
          <label htmlFor="anonymous">
            🔒 Manter feedback anônimo
          </label>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">✓ Feedback enviado com sucesso!</div>}

        <button type="submit" disabled={isLoading} className="submit-btn">
          {isLoading ? 'Enviando...' : 'Enviar Feedback'}
        </button>
      </form>
    </div>
  );
};
