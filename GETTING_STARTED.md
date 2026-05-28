# 🚀 Como Executar a Aplicação Completa

## Pré-requisitos
- Node.js 16+ instalado
- npm ou yarn
- Git

## ⚙️ Configuração Inicial

### 1. Clonar o repositório
```bash
cd SemisLua
```

### 2. Instalar dependências do Backend
```bash
cd backend
npm install
cd ..
```

### 3. Instalar dependências do Frontend
```bash
cd frontend
npm install
cd ..
```

---

## 🏃 Executar a Aplicação

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

**Esperado:**
```
✓ Database initialized successfully
✓ Created 7 test users
✓ Created 4 test feedbacks
✓ Database seeding completed successfully!
✓ Server running on http://localhost:3000
✓ Environment: development
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

**Esperado:**
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

---

## 🔓 Fazer Login

### Dados de Teste

| Email | Senha | Tipo | Departamento |
|-------|-------|------|--------------|
| user@example.com | 123456 | Employee | TI |
| maria@example.com | 123456 | Employee | RH |
| pedro@example.com | 123456 | Manager | TI |
| admin@example.com | 123456 | Admin | Administração |
| carlos@example.com | 123456 | Employee | Vendas |
| ana@example.com | 123456 | Manager | Marketing |
| lucas@example.com | 123456 | Employee | TI |

### Passos
1. Abrir http://localhost:5173/login
2. Inserir email: `user@example.com`
3. Inserir senha: `123456`
4. Clicar em "Entrar"

---

## 🎯 Testar as Funcionalidades

### Sprint 1 ✅
- **Login (US01)**: Digite as credenciais e faça login
- **Dashboard (US02)**: Veja o menu dinâmico baseado no seu role
- **Navegação (US03)**: Clique nos cards do dashboard para navegar

### Sprint 2 ✅

#### Avaliar Colegas (US04)
1. No dashboard, clique em "👥 Avaliar Colegas"
2. Digite um nome para buscar (ex: "João")
3. Clique no card do colega
4. Preencha o formulário:
   - Selecione uma nota (1-5 stars)
   - Adicione um comentário (opcional)
   - Marque/desmarque "Manter feedback anônimo"
5. Clique "Enviar Feedback"

#### Avaliar Gestores (US05)
1. No dashboard, clique em "📊 Avaliar Gestores"
2. Veja a lista de gestores (Pedro, Ana)
3. Clique em um gestor
4. Preencha o formulário igual ao de colegas
5. Clique "Enviar Feedback"

#### Meus Feedbacks
1. No dashboard, clique em "💬 Meus Feedbacks"
2. Visualize:
   - Cards de estatísticas no topo
   - Abas de filtro (Todos / De Colegas / De Gestores)
   - Lista de feedbacks recebidos
   - Breakdown por tipo de feedback

---

## 🛠️ Endpoints da API (Testar com cURL/Postman)

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"123456"}'
```

### Enviar Feedback
```bash
curl -X POST http://localhost:3000/api/feedbacks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "evaluated_id": 2,
    "rating": 5,
    "comment": "Excelente trabalho!",
    "is_anonymous": true,
    "feedback_type": "colleague"
  }'
```

### Listar Usuários para Avaliar
```bash
curl http://localhost:3000/api/feedbacks/evaluable-users \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Ver Feedbacks Recebidos
```bash
curl http://localhost:3000/api/feedbacks/received \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Ver Estatísticas
```bash
curl http://localhost:3000/api/feedbacks/stats \
  -H "Authorization: Bearer SEU_TOKEN"
```

---

## 🐛 Troubleshooting

### Erro: "Port 3000 already in use"
```bash
# Matar processo na porta 3000
lsof -ti:3000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :3000   # Windows (depois kill o PID)
```

### Erro: "Cannot find module"
```bash
# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

### Banco de dados não está sendo criado
```bash
# Verificar arquivo de configuração .env
cat backend/.env

# Deve conter:
# DATABASE_PATH=./database.db
```

### Frontend não conecta com Backend
```bash
# Verificar se ambos os servidores estão rodando
# Backend: http://localhost:3000 (health check)
curl http://localhost:3000/health

# Frontend: http://localhost:5173
```

---

## 📊 Estrutura de Pastas

```
SemisLua/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.ts (US01)
│   │   │   └── feedbackController.ts (US04-06)
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   └── feedbackRoutes.ts
│   │   ├── middleware/
│   │   ├── database/
│   │   │   ├── connection.ts
│   │   │   ├── schema.sql
│   │   │   └── seed.ts
│   │   └── server.ts
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── PrivateRoute.tsx
│   │   │   ├── PagePlaceholder.tsx
│   │   │   └── FeedbackForm.tsx (US06)
│   │   ├── pages/
│   │   │   ├── Login.tsx (US01)
│   │   │   ├── Dashboard.tsx (US02)
│   │   │   ├── EvaluateColleagues.tsx (US04)
│   │   │   ├── EvaluateManagers.tsx (US05)
│   │   │   └── MyFeedbacks.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── hooks/
│   │   │   └── useAuth.tsx
│   │   ├── styles/
│   │   └── App.tsx
│   └── package.json
│
├── README.md
├── SPRINT2.md
└── .gitignore
```

---

## 📈 Progress das Sprints

### Sprint 1 ✅ (6 US)
- US01: Login com JWT
- US02: Dashboard dinâmico
- US03: Navegação com React Router

### Sprint 2 ✅ (3 US)
- US04: Avaliar Colegas
- US05: Avaliar Gestores
- US06: Enviar Feedback

### Sprint 3 ⏳ (3 US)
- US07: Visualizar Relatórios
- US08: Médias de Avaliação
- US09: Filtrar por Setor

---

## 💡 Dicas

1. **Usar diferentes usuários**: Teste login com Pedro (manager) para ver as diferenças no menu
2. **Testar anonimato**: Envie feedback com anonimato ativado e desativado
3. **Ver estatísticas**: Vá para "Meus Feedbacks" e veja as estatísticas agregadas
4. **Buscar colegas**: Use o campo de busca para filtrar por nome ou departamento
5. **Limite de feedback**: Tente enviar 2 feedbacks para a mesma pessoa no mesmo mês

---

## 📞 Suporte

Para dúvidas sobre o código, consulte:
- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)
- [SPRINT2.md](./SPRINT2.md)

---

**Versão**: 1.0.0  
**Data**: 28 de Maio de 2026  
**Status**: Sprint 2 Concluída ✅
