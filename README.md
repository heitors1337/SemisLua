# SemisLua - Plataforma de Feedback para Funcionários

O SemisLua é uma plataforma de feedback corporativo que permite que funcionários avaliem colegas e gestores de forma anônima. O objetivo é promover um ambiente organizacional mais transparente, incentivando o desenvolvimento profissional e a melhoria contínua das equipes.

## 🎯 Objetivo

Desenvolver um sistema que:

- Permita avaliações anônimas entre funcionários
- Gere relatórios de desempenho
- Auxilie empresas na tomada de decisões

## 📁 Estrutura do Projeto

```
SemisLua/
├── backend/           # API Rest (Node.js + TypeScript)
├── frontend/          # Interface web (React + TypeScript)
├── README.md          # Este arquivo
└── .gitignore
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js 16+ e npm
- Git

### Backend (Terminal 1)
```bash
cd backend
npm install
npm run dev
# Servidor rodando em http://localhost:3000
```

### Frontend (Terminal 2)
```bash
cd frontend
npm install
npm run dev
# Aplicação rodando em http://localhost:5173
```

### Dados de Teste
Email: `user@example.com`
Senha: `123456`

## 📊 Progress

| Sprint | ID | User Story | Status |
|--------|-----|-----------|--------|
| 1 | US01 | Login | ✅ Concluído |
| 1 | US02 | Dashboard | ✅ Concluído |
| 1 | US03 | Navegação | ✅ Concluído |
| 2 | US04 | Avaliar Colegas | ✅ Concluído |
| 2 | US05 | Avaliar Gestores | ✅ Concluído |
| 2 | US06 | Enviar Feedback | ✅ Concluído |
| 3 | US07 | Visualizar Relatórios | ⏳ Próximo |
| 3 | US08 | Médias de Avaliação | ⏳ Próximo |
| 3 | US09 | Filtrar por Setor | ⏳ Próximo |

## 📚 Documentação

- [Backend README](./backend/README.md) - API e endpoints
- [Frontend README](./frontend/README.md) - UI e componentes

## 🏗️ Arquitetura

### Backend (Sprint 1 - US01)
- ✅ Express.js com TypeScript
- ✅ Autenticação JWT
- ✅ SQLite com tabelas (users, sessions, feedbacks)
- ✅ Endpoints: POST (login, register), GET (profile), PUT (update), DELETE (logout, account)

### Backend (Sprint 2 - US04, US05, US06)
- ✅ Controller de feedback com lógica avançada
- ✅ Sistema de avaliações anônimas
- ✅ Validações: sem auto-avaliação, limite 1 feedback/mês por pessoa
- ✅ Estatísticas de feedback
- ✅ Endpoints: POST (send), GET (evaluable, received, stats), PUT (update), DELETE

### Frontend (Sprint 1 - US02/US03)
- ✅ React com TypeScript
- ✅ React Router para navegação
- ✅ Context API para autenticação
- ✅ Componentes: Login, Dashboard, PagePlaceholder
- ✅ Estilos responsivos com CSS puro

### Frontend (Sprint 2 - US04/US05/US06)
- ✅ Páginas: EvaluateColleagues, EvaluateManagers, MyFeedbacks
- ✅ Componente FeedbackForm reutilizável
- ✅ Sistema de busca e filtro de usuários
- ✅ Visualização de estatísticas de feedback
- ✅ Abas de filtro por tipo de feedback

## 🔐 Segurança

- Senhas com bcryptjs
- Tokens JWT com expiração
- CORS configurado
- Rotas privadas protegidas

## 🧾 Backlog 

| Prioridade | Sprint  | ID | User Story | Descrição |
|------------|----------|------------|-----------|--------|
|  Alta | Sprint 1  | US01 | Como usuário, quero fazer login | Para acessar a plataforma com segurança |
|  Alta | Sprint 1  | US02 | Como usuário, quero acessar o dashboard | Para visualizar as opções do sistema |
|  Alta | Sprint 1  | US03 | Como usuário, quero navegar entre telas | Para utilizar a plataforma facilmente |
|  Alta | Sprint 2  | US04 | Como funcionário, quero avaliar colegas anonimamente | Para fornecer feedback honesto |
|  Alta | Sprint 2  | US05 | Como funcionário, quero avaliar gestores | Para contribuir com melhorias na liderança |
|  Alta | Sprint 2  | US06 | Como usuário, quero enviar feedback | Para registrar minha avaliação |
|  Média | Sprint 3 | US07 | Como gestor, quero visualizar relatórios | Para acompanhar o desempenho da equipe |
|  Média | Sprint 3 | US08 | Como usuário, quero ver médias de avaliação | Para entender o desempenho geral |
|  Baixa | Sprint 3 | US09 | Como gestor, quero filtrar por setor | Para análises mais específicas |
