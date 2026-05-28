import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../hooks/useAuth';
import { reportsService } from '../services/api';
import { PagePlaceholder } from '../components/PagePlaceholder';
import '../styles/reports.css';

interface Employee {
  id: number;
  name: string;
  department: string;
  feedback_count: number;
  average_rating: number;
  positive_count?: number;
  negative_count?: number;
}

interface DepartmentStats {
  department: string;
  total_employees: number;
  employees_evaluated: number;
  total_feedbacks: number;
  average_rating: number;
  positive_count?: number;
  negative_count?: number;
}

interface GeneralStats {
  users_evaluated: number;
  total_feedbacks: number;
  average_rating: number;
  lowest_rating: number;
  highest_rating: number;
}

export const Reports: React.FC = () => {
  const authContext = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState<'overview' | 'department' | 'comparison'>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [generalStats, setGeneralStats] = useState<GeneralStats | null>(null);
  const [topRated, setTopRated] = useState<Employee[]>([]);
  const [needImprovement, setNeedImprovement] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Array<{ department: string }>>([]);
  const [selectedDept, setSelectedDept] = useState<string>('');
  const [deptStats, setDeptStats] = useState<DepartmentStats | null>(null);
  const [deptEmployees, setDeptEmployees] = useState<Employee[]>([]);
  const [comparison, setComparison] = useState<DepartmentStats[]>([]);

  if (!authContext) {
    return <div>Erro ao carregar contexto</div>;
  }

  const { user } = authContext;

  // Verificar se é gestor ou admin
  if (user?.role !== 'manager' && user?.role !== 'admin') {
    return (
      <PagePlaceholder
        title="Acesso Negado"
        icon="🔐"
        description="Apenas gestores e administradores podem visualizar relatórios"
      />
    );
  }

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Carregar dados gerais
      const overallRes = await reportsService.getOverallReport();
      setGeneralStats(overallRes.data.general);
      setTopRated(overallRes.data.top_rated);
      setNeedImprovement(overallRes.data.need_improvement);

      // Carregar departamentos
      const deptsRes = await reportsService.getDepartments();
      setDepartments(deptsRes.data);
      if (deptsRes.data.length > 0) {
        const firstDept = deptsRes.data[0].department;
        setSelectedDept(firstDept);
        await loadDepartmentReport(firstDept);
      }

      // Carregar comparação
      const compRes = await reportsService.getDepartmentsComparison();
      setComparison(compRes.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar relatórios');
    } finally {
      setIsLoading(false);
    }
  };

  const loadDepartmentReport = async (dept: string) => {
    try {
      setSelectedDept(dept);
      const deptRes = await reportsService.getDepartmentReport(dept);
      setDeptStats(deptRes.data.department_stats);
      setDeptEmployees(deptRes.data.employees);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar relatório');
    }
  };

  const getRatingColor = (rating: number): string => {
    if (rating <= 2) return '#e74c3c';
    if (rating <= 3) return '#f39c12';
    return '#27ae60';
  };

  if (isLoading) {
    return <div className="loading">Carregando relatórios...</div>;
  }

  return (
    <div className="reports-page">
      <div className="reports-header">
        <h1>📈 Relatórios de Desempenho</h1>
        <p>Acompanhe o desempenho da equipe com dados analíticos</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Abas */}
      <div className="report-tabs">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Visão Geral
        </button>
        <button
          className={`tab-btn ${activeTab === 'department' ? 'active' : ''}`}
          onClick={() => setActiveTab('department')}
        >
          Por Departamento
        </button>
        <button
          className={`tab-btn ${activeTab === 'comparison' ? 'active' : ''}`}
          onClick={() => setActiveTab('comparison')}
        >
          Comparação
        </button>
      </div>

      <div className="report-content">
        {/* OVERVIEW */}
        {activeTab === 'overview' && generalStats && (
          <div className="overview-section">
            {/* Stats Cards */}
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total de Funcionários Avaliados</h3>
                <p className="stat-value">{generalStats.users_evaluated}</p>
              </div>
              <div className="stat-card">
                <h3>Total de Feedbacks</h3>
                <p className="stat-value">{generalStats.total_feedbacks}</p>
              </div>
              <div className="stat-card">
                <h3>Média Geral</h3>
                <p
                  className="stat-value"
                  style={{ color: getRatingColor(generalStats.average_rating) }}
                >
                  {generalStats.average_rating.toFixed(2)}
                  <span className="stat-unit">/5</span>
                </p>
              </div>
              <div className="stat-card">
                <h3>Intervalo de Notas</h3>
                <p className="stat-value">
                  {generalStats.lowest_rating} - {generalStats.highest_rating}
                </p>
              </div>
            </div>

            {/* Top Rated */}
            <div className="section-container">
              <h2>⭐ Melhores Avaliados</h2>
              <div className="employees-list">
                {topRated.slice(0, 5).map(emp => (
                  <div key={emp.id} className="employee-card">
                    <div className="employee-header">
                      <h4>{emp.name}</h4>
                      <div
                        className="rating-badge"
                        style={{ backgroundColor: getRatingColor(emp.average_rating) }}
                      >
                        {emp.average_rating.toFixed(1)}
                      </div>
                    </div>
                    <p className="employee-dept">{emp.department}</p>
                    <small>{emp.feedback_count} feedback(s)</small>
                  </div>
                ))}
              </div>
            </div>

            {/* Need Improvement */}
            <div className="section-container">
              <h2>📌 Precisam de Melhoria</h2>
              <div className="employees-list">
                {needImprovement.slice(0, 5).map(emp => (
                  <div key={emp.id} className="employee-card alert">
                    <div className="employee-header">
                      <h4>{emp.name}</h4>
                      <div
                        className="rating-badge"
                        style={{ backgroundColor: getRatingColor(emp.average_rating) }}
                      >
                        {emp.average_rating.toFixed(1)}
                      </div>
                    </div>
                    <p className="employee-dept">{emp.department}</p>
                    <small>{emp.feedback_count} feedback(s)</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* DEPARTMENT */}
        {activeTab === 'department' && (
          <div className="department-section">
            <div className="dept-selector">
              <label>Selecione Departamento:</label>
              <select value={selectedDept} onChange={(e) => loadDepartmentReport(e.target.value)}>
                {departments.map(dept => (
                  <option key={dept.department} value={dept.department}>
                    {dept.department}
                  </option>
                ))}
              </select>
            </div>

            {deptStats && (
              <>
                <div className="dept-stats-grid">
                  <div className="stat-card">
                    <h3>Total de Funcionários</h3>
                    <p className="stat-value">{deptStats.total_employees}</p>
                  </div>
                  <div className="stat-card">
                    <h3>Avaliados</h3>
                    <p className="stat-value">{deptStats.employees_evaluated}</p>
                  </div>
                  <div className="stat-card">
                    <h3>Total de Feedbacks</h3>
                    <p className="stat-value">{deptStats.total_feedbacks}</p>
                  </div>
                  <div className="stat-card">
                    <h3>Média do Departamento</h3>
                    <p
                      className="stat-value"
                      style={{ color: getRatingColor(deptStats.average_rating) }}
                    >
                      {deptStats.average_rating.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="section-container">
                  <h2>Funcionários</h2>
                  <div className="employees-list">
                    {deptEmployees.map(emp => (
                      <div key={emp.id} className="employee-card">
                        <div className="employee-header">
                          <h4>{emp.name}</h4>
                          <div
                            className="rating-badge"
                            style={{ backgroundColor: getRatingColor(emp.average_rating) }}
                          >
                            {emp.average_rating.toFixed(1)}
                          </div>
                        </div>
                        <div className="employee-details">
                          <span>Feedbacks: {emp.feedback_count}</span>
                          <span className="positive">✓ {emp.positive_count || 0}</span>
                          <span className="negative">✗ {emp.negative_count || 0}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* COMPARISON */}
        {activeTab === 'comparison' && (
          <div className="comparison-section">
            <h2>📊 Comparação entre Departamentos</h2>
            <div className="comparison-table">
              <table>
                <thead>
                  <tr>
                    <th>Departamento</th>
                    <th>Funcionários</th>
                    <th>Avaliados</th>
                    <th>Feedbacks</th>
                    <th>Média</th>
                    <th>Positivos</th>
                    <th>Críticos</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map(dept => (
                    <tr key={dept.department}>
                      <td className="dept-name">{dept.department}</td>
                      <td>{dept.total_employees}</td>
                      <td>{dept.employees_evaluated}</td>
                      <td>{dept.total_feedbacks}</td>
                      <td>
                        <span style={{ color: getRatingColor(dept.average_rating) }}>
                          {dept.average_rating.toFixed(2)}
                        </span>
                      </td>
                      <td className="positive">{dept.positive_count || 0}</td>
                      <td className="negative">{dept.negative_count || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
