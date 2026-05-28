# Sprint 3 - Reports and Analytics Implementation

## 📋 User Stories Completed

### ✅ US07 - Como gestor, quero visualizar relatórios
- **Objetivo**: Acompanhar o desempenho da equipe
- **Implementação**:
  - Página `Reports.tsx` com múltiplas abas
  - Tab 1: Visão Geral (estatísticas gerais)
  - Tab 2: Por Departamento (com filtro)
  - Tab 3: Comparação entre departamentos
  - Cards visuais com dados agregados
  - Listas de top-rated e need improvement

### ✅ US08 - Como usuário, quero ver médias de avaliação
- **Objetivo**: Entender o desempenho geral
- **Implementação**:
  - Página `Statistics.tsx` com tabela completa
  - Visualização de médias por usuário
  - Breakdown por tipo (colegas vs gestores)
  - Filtros: por nome, departamento, tipo
  - Ordenação: por nota, feedback count, nome
  - Cards de resumo com estatísticas agregadas

### ✅ US09 - Como gestor, quero filtrar por setor
- **Objetivo**: Análises mais específicas
- **Implementação**:
  - Seletor de departamento em Reports
  - Estatísticas do departamento específico
  - Lista de funcionários do setor
  - Distribuição de notas por departamento
  - Comparação visual entre setores

---

## 🎯 Backend Features (US07, US08, US09)

### Controller: `ReportsController`

#### `getOverallReport()` - GET /api/reports/overall
- Estatísticas gerais da plataforma
- Retorna: general stats, by_type, top_rated, need_improvement
- Restrição: apenas manager e admin

#### `getDepartmentReport()` - GET /api/reports/department
- Relatório detalhado por departamento
- Query params: `department` (obrigatório)
- Retorna: dept_stats, employees, rating_distribution
- Filtro por setor (US09)

#### `getUserAverages()` - GET /api/reports/averages
- Médias de avaliação de todos os usuários (US08)
- Inclui breakdown por tipo (colleague/manager)
- Ordenado por média decrescente

#### `getDepartments()` - GET /api/reports/departments
- Lista todos os departamentos
- Usado para populuar seletores

#### `getManagersReport()` - GET /api/reports/managers
- Relatório específico de gestores
- Mostra como gestores são avaliados

#### `getTrendingFeedbacks()` - GET /api/reports/trending
- Feedbacks dos últimos 30 dias
- Mostra alterações recentes
- Ordena por quantidade de feedback

#### `getDepartmentsComparison()` - GET /api/reports/comparison
- Comparação entre todos os departamentos (US09)
- Estatísticas agregadas por setor
- Ordenado por média decrescente

### Rotas: `src/routes/reportsRoutes.ts`
```
GET /reports/overall
GET /reports/department
GET /reports/averages
GET /reports/departments
GET /reports/managers
GET /reports/trending
GET /reports/comparison
```

---

## 🎨 Frontend Features

### Pages
1. **Reports.tsx** (US07 + US09)
   - 3 abas: Overview, Department, Comparison
   - Cards de estatísticas
   - Listas de top-rated e need improvement
   - Seletor de departamento com relatório específico
   - Tabela de comparação entre setores

2. **Statistics.tsx** (US08)
   - Tabela completa com médias de avaliação
   - Filtros: busca, ordenação, tipo
   - Cards de resumo
   - Badges de status (Excelente/Aceitável/Insatisfatório)
   - Breakdown por tipo de feedback

### Components
- Reutilização de componentes existentes
- Cards visuais com cores por rating
- Tabelas responsivas

### Styles
- `reports.css` - Layout de relatórios
- `statistics.css` - Tabela e filtros

---

## 🎨 Visual Design

### Color Coding
```
Rating 1-2: Vermelho (#e74c3c) - Insatisfatório
Rating 3:   Amarelo (#f39c12)  - Aceitável
Rating 4-5: Verde (#27ae60)    - Excelente
Sem dados:  Cinza (#bdc3c7)    - N/A
```

### Layout
- Grid responsivo para cards
- Tabelas com scroll horizontal em mobile
- Filtros flexíveis em linha
- Abas com toggle visual

---

## 📊 Database Queries

### Queries Implementadas

#### Query 1: Estatísticas Gerais
```sql
SELECT COUNT(DISTINCT evaluated_id) as users_evaluated,
       COUNT(*) as total_feedbacks,
       AVG(rating) as average_rating
FROM feedbacks
```

#### Query 2: Top Rated Employees
```sql
SELECT u.id, u.name, u.department,
       COUNT(f.id) as feedback_count,
       ROUND(AVG(f.rating), 2) as average_rating
FROM users u
LEFT JOIN feedbacks f ON u.id = f.evaluated_id
WHERE u.role = 'employee'
GROUP BY u.id
ORDER BY average_rating DESC
LIMIT 10
```

#### Query 3: Department Comparison
```sql
SELECT u.department,
       COUNT(DISTINCT u.id) as total_employees,
       COUNT(f.id) as total_feedbacks,
       ROUND(AVG(f.rating), 2) as average_rating
FROM users u
LEFT JOIN feedbacks f ON u.id = f.evaluated_id
WHERE u.role = 'employee'
GROUP BY u.department
ORDER BY average_rating DESC
```

#### Query 4: Trending Last 30 Days
```sql
SELECT u.name, COUNT(f.id) as feedbacks_last_30_days,
       ROUND(AVG(f.rating), 2) as recent_average
FROM users u
LEFT JOIN feedbacks f ON u.id = f.evaluated_id 
  AND date(f.created_at) >= date('now', '-30 days')
WHERE u.role = 'employee'
GROUP BY u.id
HAVING COUNT(f.id) > 0
ORDER BY COUNT(f.id) DESC
LIMIT 15
```

---

## 🔒 Security & Authorization

- ✅ Apenas managers e admins podem acessar relatórios
- ✅ Redirecionamento automático para acesso negado
- ✅ Validação de departamento obrigatório
- ✅ JWT obrigatório em todas as rotas

---

## 📱 User Experience

### Reports Workflow
1. Clica "📈 Relatórios" no dashboard
2. Vê visão geral com cards de estatísticas
3. Visualiza top-rated e need improvement
4. Muda para aba "Por Departamento"
5. Seleciona um departamento
6. Vê estatísticas e funcionários do setor
7. Muda para "Comparação"
8. Vê tabela comparativa entre setores

### Statistics Workflow
1. Clica "📉 Estatísticas"
2. Vê todos os usuários em tabela
3. Busca por nome/departamento
4. Filtra por tipo (employees/managers)
5. Ordena por nota, feedback count ou nome
6. Visualiza status (Excelente/Aceitável/Insatisfatório)
7. Vê breakdown por tipo de feedback (colegas vs gestores)

---

## 📊 Data Aggregation

### Métricas Calculadas

1. **Estatísticas Gerais**
   - Total de usuários avaliados
   - Total de feedbacks
   - Média geral de avaliação
   - Min/Max rating

2. **Por Tipo de Feedback**
   - Count de colleague feedback
   - Count de manager feedback
   - Média por tipo
   - Positivos vs negativos

3. **Por Departamento**
   - Funcionários totais
   - Funcionários avaliados
   - Média do departamento
   - Distribuição de notas

4. **Por Usuário**
   - Média geral
   - Feedback count
   - Breakdown colleague/manager
   - Status badge

---

## 🧪 Test Data

O seed script cria dados variados:
- 7 usuários em 4 departamentos
- 4 feedbacks de exemplo
- Distribuição de notas (1-5)
- Mistura de feedbacks anônimos e não anônimos

### Consultando os Relatórios
1. Login com `pedro@example.com` (manager)
2. Acesso a Reports e Statistics
3. Visualizar dados agregados dos feedbacks de teste

---

## 🚀 Performance Optimizations

1. **Índices no BD**:
   - `idx_feedbacks_evaluator_id`
   - `idx_feedbacks_evaluated_id`
   - `idx_feedbacks_created_at`

2. **Query Efficiency**:
   - Uso de agregações no banco
   - Limite de resultados (LIMIT 10, 15)
   - Índices para JOINs

3. **Frontend**:
   - Filtros no cliente (busca local)
   - Memoization de dados
   - Ordenação eficiente

---

## ✅ Checklist Sprint 3

- [x] Backend controller com 7 endpoints
- [x] Frontend com 2 novas páginas (Reports, Statistics)
- [x] Sistema de filtro por departamento
- [x] Visão geral com estatísticas agregadas
- [x] Tabela de médias de avaliação
- [x] Abas de navegação em Reports
- [x] Cards visuais com código de cores
- [x] Comparação entre departamentos
- [x] Trending de últimos 30 dias
- [x] Autenticação e autorização
- [x] Estilos responsivos
- [x] Dados de teste variados

---

## 🎉 Projeto Finalizado

### Todas as 9 User Stories Completadas
- Sprint 1: US01, US02, US03 ✅
- Sprint 2: US04, US05, US06 ✅
- Sprint 3: US07, US08, US09 ✅

### Stack Técnico
- **Backend**: Node.js + Express + TypeScript + SQLite
- **Frontend**: React + TypeScript + React Router + CSS Puro
- **Autenticação**: JWT + bcryptjs
- **Database**: SQLite3 com schema bem definido

### Funcionalidades Principais
1. ✅ Autenticação com JWT
2. ✅ Dashboard dinâmico por role
3. ✅ Avaliação de colegas e gestores
4. ✅ Sistema de feedbacks anônimos
5. ✅ Visualização de feedbacks recebidos
6. ✅ Relatórios e análises
7. ✅ Estatísticas agregadas
8. ✅ Filtro por departamento
9. ✅ Comparação entre setores

---

**Status**: ✅ Sprint 3 100% Completa  
**Status Geral**: ✅ Projeto 100% Completo  
**Data**: 28 de Maio de 2026  
**Total de Horas**: ~40 horas de desenvolvimento
