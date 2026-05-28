# SemisLua Frontend

Frontend da plataforma de feedback corporativo SemisLua, desenvolvido com **React** e **TypeScript**.

## 📋 Funcionalidades Implementadas

### US01 - Login ✅
- Página de login com autenticação JWT
- Persistência de sessão
- Proteção com token Bearer

### US02 - Dashboard ✅
- Visualização personalizada do dashboard
- Menu dinâmico baseado no tipo de usuário
- Exibição de informações de conta
- Dicas de uso da plataforma

### US03 - Navegação entre Telas ✅
- Roteamento com React Router
- Navegação intuitiva entre páginas
- Proteção de rotas privadas
- Redirecionamento automático

### US04 - Avaliar Colegas ✅
- Listar todos os colegas
- Buscar colegas por nome/departamento
- Formulário de avaliação com escala 1-5
- Feedback anônimo opcional
- Limite de 1 feedback por colega/mês

### US05 - Avaliar Gestores ✅
- Listar gestores disponíveis
- Formulário de avaliação para gestores
- Feedback anônimo obrigatório
- Contribuir para melhoria de liderança

### US06 - Enviar Feedback ✅
- Componente FeedbackForm reutilizável
- Sistema de notas visuais
- Campo de comentário com limite
- Confirmação de envio
- Validações de segurança (sem auto-avaliação)

## 🚀 Começando

### Instalação
```bash
cd frontend
npm install
```

### Rodar em desenvolvimento
```bash
npm run dev
```
A aplicação abrirá em `http://localhost:5173`

### Build para produção
```bash
npm run build
```

## 📁 Estrutura do Projeto

```
src/
├── components/        # Componentes reutilizáveis
│   ├── PrivateRoute.tsx       # Proteção de rotas
│   └── PagePlaceholder.tsx    # Placeholder para páginas futuras
├── pages/            # Páginas da aplicação
│   ├── Login.tsx              # Página de login
│   └── Dashboard.tsx          # Dashboard (US02)
├── services/         # Comunicação com API
│   └── api.ts                 # Cliente HTTP com Axios
├── hooks/           # Custom hooks
│   └── useAuth.tsx            # Context de autenticação
├── types/           # Tipos TypeScript
│   └── index.ts
├── styles/          # Estilos CSS
│   ├── global.css
│   ├── login.css
│   ├── dashboard.css
│   └── page-placeholder.css
├── App.tsx          # Roteamento principal
└── main.tsx         # Entry point
```

## 🔑 Funcionalidades de Autenticação

- Login com JWT
- Persistência de sessão no localStorage
- Logout automático
- Proteção de rotas privadas
- Carregamento automático do perfil

## 📱 Navegação

| Rota | Descrição | Requer Auth |
|------|-----------|------------|
| `/login` | Página de login | ❌ |
| `/dashboard` | Dashboard principal | ✅ |
| `/feedback/colleagues` | Avaliar colegas (US04) | ✅ |
| `/feedback/managers` | Avaliar gestores (US05) | ✅ |
| `/my-feedbacks` | Meus feedbacks recebidos | ✅ |
| `/reports` | Relatórios | ✅ |
| `/statistics` | Estatísticas | ✅ |
| `/users` | Gerenciar usuários | ✅ |

## 🎨 Design

- Interface moderna e responsiva
- Gradient colorido (roxo/azul)
- Componentes visuais intuitivos
- Suporte mobile (breakpoint em 768px)

## 🔗 Integração com Backend

A aplicação se conecta ao backend em `http://localhost:3000/api`

### Endpoints utilizados (US01)
- `POST /api/auth/login` - Autenticação
- `GET /api/auth/profile` - Buscar perfil

---

✅ **US02 e US03 Concluídas!**
