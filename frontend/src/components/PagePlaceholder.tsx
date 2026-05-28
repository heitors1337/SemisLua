import React from 'react';
import '../styles/page-placeholder.css';

interface PagePlaceholderProps {
  title: string;
  icon: string;
  description: string;
}

export const PagePlaceholder: React.FC<PagePlaceholderProps> = ({ title, icon, description }) => {
  return (
    <div className="placeholder-container">
      <div className="placeholder-content">
        <div className="placeholder-icon">{icon}</div>
        <h1>{title}</h1>
        <p>{description}</p>
        <div className="coming-soon">Em Desenvolvimento</div>
      </div>
    </div>
  );
};
