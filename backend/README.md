# SemisLua Backend - US01 Login

## Estrutura do Projeto

```
backend/
├── src/
│   ├── controllers/      # Lógica de negócio
│   ├── routes/          # Endpoints da API
│   ├── middleware/      # Autenticação e tratamento de erros
│   ├── database/        # Conexão e schema SQL
│   ├── types/           # Interfaces TypeScript
│   └── server.ts        # Entry point
├── package.json
├── tsconfig.json
└── .env.example
```

## Endpoints Implementados

### 🔐 Authentication Routes

| Método | Endpoint | Descrição | Requer Auth |
|--------|----------|-----------|-------------|
| **POST** | `/api/auth/register` | Registrar novo usuário | ❌ |
| **POST** | `/api/auth/login` | Fazer login | ❌ |
| **GET** | `/api/auth/profile` | Buscar perfil do usuário | ✅ |
| **PUT** | `/api/auth/profile` | Atualizar perfil | ✅ |
| **DELETE** | `/api/auth/logout` | Fazer logout | ✅ |
| **DELETE** | `/api/auth/account` | Deletar conta | ✅ |

### 💬 Feedback Routes (Sprint 2)

| Método | Endpoint | Descrição | Requer Auth |
|--------|----------|-----------|-------------|
| **POST** | `/api/feedbacks` | Enviar feedback | ✅ |
| **GET** | `/api/feedbacks/evaluable-users` | Listar usuários para avaliar | ✅ |
| **GET** | `/api/feedbacks/received` | Listar feedbacks recebidos | ✅ |
| **GET** | `/api/feedbacks/stats` | Estatísticas de feedback | ✅ |
| **PUT** | `/api/feedbacks/:feedbackId` | Atualizar feedback | ✅ |
| **DELETE** | `/api/feedbacks/:feedbackId` | Deletar feedback | ✅ |

## Banco de Dados (SQL)

Tabelas criadas:
- **users** - Usuários do sistema
- **sessions** - Sessões de autenticação
- **feedbacks** - Avaliações (para próximos sprints)

## Como Usar

### 1. Instalar dependências
```bash
cd backend
npm install
```

### 2. Configurar variáveis de ambiente
```bash
cp .env.example .env
```

### 3. Rodar em desenvolvimento
```bash
npm run dev
```

### 4. Testar os endpoints

#### 📝 Registrar
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"123456","name":"João Silva","department":"TI"}'
```

#### 🔓 Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"123456"}'
```

#### 👤 Buscar Perfil (com token)
```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

#### ✏️ Atualizar Perfil
```bash
curl -X PUT http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{"name":"João Silva Atualizado","department":"RH"}'
```

#### 🚪 Logout
```bash
curl -X DELETE http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

#### 🗑️ Deletar Conta
```bash
curl -X DELETE http://localhost:3000/api/auth/account \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## Tecnologias Utilizadas

- **Express.js** - Framework web
- **TypeScript** - Tipagem segura
- **SQLite** - Banco de dados
- **bcryptjs** - Hash de senhas
- **jsonwebtoken** - Autenticação JWT
- **CORS** - Controle de acesso

---

✅ **US01 Concluída!** Pronto para testar e integrar com o frontend.
