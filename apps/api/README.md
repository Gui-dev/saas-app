# SaaS API

[![Fastify](https://img.shields.io/badge/Fastify-5.6.1-black?logo=fastify)](https://www.fastify.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![OpenAPI](https://img.shields.io/badge/OpenAPI-3.0-green?logo=openapi-initiative)](./)
[![JWT](https://img.shields.io/badge/Auth-JWT-orange?logo=jsonwebtokens)](./)

> API RESTful multi-tenant com autenticação JWT, controle de acesso baseado em funções (RBAC) e arquitetura modular.

---

## 📚 Documentação Interativa

A documentação completa e interativa está disponível via Scalar quando a API está rodando:

```
http://localhost:3333/docs
```

---

## 🌐 URL Base

```
http://localhost:3333
```

---

## 🔐 Autenticação

A API utiliza **JWT (JSON Web Token)** para autenticação. Inclua o token no header de todas as requisições protegidas:

```http
Authorization: Bearer {seu-token-jwt}
```

### Obtendo um Token

1. Crie uma conta via `POST /users`
2. Autentique-se via `POST /sessions/password` ou `POST /sessions/github`
3. Use o token retornado nas requisições subsequentes

---

## 📋 Códigos de Status HTTP

| Código | Descrição |
|--------|-----------|
| `200` | Sucesso - Requisição processada com sucesso |
| `201` | Criado - Recurso criado com sucesso |
| `204` | Sem Conteúdo - Operação realizada com sucesso (sem retorno) |
| `400` | Requisição Inválida - Dados de entrada inválidos |
| `401` | Não Autorizado - Token ausente ou inválido |
| `403` | Proibido - Sem permissão para acessar o recurso |
| `404` | Não Encontrado - Recurso não existe |
| `409` | Conflito - Conflito de dados (ex: email já existe) |
| `422` | Entidade Não Processável - Erro de validação |
| `500` | Erro Interno - Erro no servidor |

---

## 👥 Permissões (RBAC)

A API implementa controle de acesso baseado em funções com três níveis:

| Função | Permissões |
|--------|------------|
| `ADMIN` | Acesso total à organização e seus recursos |
| `MEMBER` | Acesso limitado - pode visualizar e criar projetos |
| `BILLING` | Acesso apenas às informações de cobrança |

---

## 📖 Endpoints

### 🔑 Autenticação

#### Criar Conta
```http
POST /users
```

Cria uma nova conta de usuário.

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "password": "senha123"
}
```

**Resposta (201):**
```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

#### Autenticar com Email/Senha
```http
POST /sessions/password
```

Autentica um usuário e retorna o token JWT.

**Body:**
```json
{
  "email": "joao@exemplo.com",
  "password": "senha123"
}
```

**Resposta (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

#### Autenticar com GitHub
```http
POST /sessions/github
```

Autentica um usuário via OAuth do GitHub.

**Body:**
```json
{
  "code": "github-oauth-code"
}
```

**Resposta (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

#### Obter Perfil
```http
GET /profile
```

Retorna os dados do usuário autenticado.

**Headers:**
```http
Authorization: Bearer {token}
```

**Resposta (200):**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "João Silva",
    "email": "joao@exemplo.com",
    "avatarUrl": "https://example.com/avatar.jpg"
  }
}
```

---

#### Solicitar Recuperação de Senha
```http
POST /password/recover
```

Solicita um token de recuperação de senha.

**Body:**
```json
{
  "email": "joao@exemplo.com"
}
```

**Resposta (201):** `null`

---

#### Resetar Senha
```http
POST /password/reset
```

Redefine a senha usando o código de recuperação.

**Body:**
```json
{
  "code": "recovery-code",
  "password": "novaSenha123"
}
```

**Resposta (204):** `null`

---

### 🏢 Organizações

#### Listar Organizações
```http
GET /organizations
```

Retorna todas as organizações que o usuário participa.

**Headers:**
```http
Authorization: Bearer {token}
```

**Resposta (200):**
```json
{
  "organizations": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Minha Empresa",
      "slug": "minha-empresa",
      "avatarUrl": "https://example.com/logo.jpg",
      "role": "ADMIN"
    }
  ]
}
```

---

#### Criar Organização
```http
POST /organizations
```

Cria uma nova organização.

**Headers:**
```http
Authorization: Bearer {token}
```

**Body:**
```json
{
  "name": "Minha Empresa",
  "domain": "minhaempresa.com",
  "shouldAttachUsersByDomain": false
}
```

**Resposta (201):**
```json
{
  "organizationId": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

#### Obter Detalhes da Organização
```http
GET /organizations/:slug
```

Retorna os detalhes de uma organização específica.

**Headers:**
```http
Authorization: Bearer {token}
```

**Parâmetros:**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `slug` | string | Slug único da organização |

**Resposta (200):**
```json
{
  "organization": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "ownerId": "550e8400-e29b-41d4-a716-446655440001",
    "name": "Minha Empresa",
    "slug": "minha-empresa",
    "domain": "minhaempresa.com",
    "shouldAttachUsersByDomain": false,
    "avatarUrl": "https://example.com/logo.jpg",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

#### Atualizar Organização
```http
PUT /organizations/:slug
```

Atualiza os dados de uma organização. **Requer permissão ADMIN.**

**Headers:**
```http
Authorization: Bearer {token}
```

**Parâmetros:**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `slug` | string | Slug da organização |

**Body:**
```json
{
  "name": "Nova Nome da Empresa",
  "domain": "novaempresa.com",
  "shouldAttachUsersByDomain": true
}
```

**Resposta (204):** `null`

---

#### Transferir Propriedade
```http
PATCH /organizations/:slug/owner
```

Transfere a propriedade da organização para outro usuário. **Requer permissão ADMIN.**

**Headers:**
```http
Authorization: Bearer {token}
```

**Parâmetros:**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `slug` | string | Slug da organização |

**Body:**
```json
{
  "transferToUserId": "550e8400-e29b-41d4-a716-446655440002"
}
```

**Resposta (204):** `null`

---

#### Encerrar Organização
```http
DELETE /organizations/:slug
```

Remove uma organização permanentemente. **Requer permissão ADMIN.**

**Headers:**
```http
Authorization: Bearer {token}
```

**Parâmetros:**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `slug` | string | Slug da organização |

**Resposta (204):** `null`

---

#### Obter Membro da Organização
```http
GET /organizations/:slug/membership
```

Retorna os dados de associação do usuário à organização.

**Headers:**
```http
Authorization: Bearer {token}
```

**Parâmetros:**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `slug` | string | Slug da organização |

**Resposta (200):**
```json
{
  "membership": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "organizationId": "550e8400-e29b-41d4-a716-446655440001",
    "userId": "550e8400-e29b-41d4-a716-446655440002",
    "role": "ADMIN"
  }
}
```

---

### 👥 Membros

#### Listar Membros
```http
GET /organizations/:slug/members
```

Retorna todos os membros de uma organização. **Requer permissão de ver usuários.**

**Headers:**
```http
Authorization: Bearer {token}
```

**Parâmetros:**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `slug` | string | Slug da organização |

**Resposta (201):**
```json
{
  "members": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "userId": "550e8400-e29b-41d4-a716-446655440001",
      "role": "ADMIN",
      "name": "João Silva",
      "email": "joao@exemplo.com",
      "avatarUrl": "https://example.com/avatar.jpg"
    }
  ]
}
```

---

#### Atualizar Membro
```http
PUT /organizations/:slug/members/:memberId
```

Atualiza o papel de um membro na organização. **Requer permissão de atualizar usuários.**

**Headers:**
```http
Authorization: Bearer {token}
```

**Parâmetros:**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `slug` | string | Slug da organização |
| `memberId` | UUID | ID do membro |

**Body:**
```json
{
  "role": "MEMBER"
}
```

**Resposta (200):**
```json
{
  "memberId": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

#### Remover Membro
```http
DELETE /organizations/:slug/members/:memberId
```

Remove um membro da organização. **Requer permissão de deletar usuários.**

**Headers:**
```http
Authorization: Bearer {token}
```

**Parâmetros:**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `slug` | string | Slug da organização |
| `memberId` | UUID | ID do membro |

**Resposta (204):** `null`

---

### 📁 Projetos

#### Listar Projetos
```http
GET /organizations/:slug/projects
```

Retorna todos os projetos de uma organização. **Requer permissão de ver projetos.**

**Headers:**
```http
Authorization: Bearer {token}
```

**Parâmetros:**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `slug` | string | Slug da organização |

**Resposta (201):**
```json
{
  "projects": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "ownerId": "550e8400-e29b-41d4-a716-446655440001",
      "organizationId": "550e8400-e29b-41d4-a716-446655440002",
      "name": "Meu Projeto",
      "description": "Descrição do projeto",
      "slug": "meu-projeto",
      "avatarUrl": "https://example.com/project.jpg",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "owner": {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "name": "João Silva",
        "avatarUrl": "https://example.com/avatar.jpg"
      }
    }
  ]
}
```

---

#### Obter Projeto
```http
GET /organizations/:slug/projects/:projectSlug
```

Retorna os detalhes de um projeto específico. **Requer permissão de ver projetos.**

**Headers:**
```http
Authorization: Bearer {token}
```

**Parâmetros:**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `slug` | string | Slug da organização |
| `projectSlug` | string | Slug do projeto |

**Resposta (201):**
```json
{
  "project": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "ownerId": "550e8400-e29b-41d4-a716-446655440001",
    "organizationId": "550e8400-e29b-41d4-a716-446655440002",
    "name": "Meu Projeto",
    "description": "Descrição do projeto",
    "slug": "meu-projeto",
    "avatarUrl": "https://example.com/project.jpg",
    "owner": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "João Silva",
      "avatarUrl": "https://example.com/avatar.jpg"
    }
  }
}
```

---

#### Criar Projeto
```http
POST /organizations/:slug/projects
```

Cria um novo projeto na organização. **Requer permissão de criar projetos.**

**Headers:**
```http
Authorization: Bearer {token}
```

**Parâmetros:**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `slug` | string | Slug da organização |

**Body:**
```json
{
  "name": "Novo Projeto",
  "description": "Descrição do projeto"
}
```

**Resposta (201):**
```json
{
  "projectId": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

#### Atualizar Projeto
```http
PUT /organizations/:slug/projects/:projectId
```

Atualiza um projeto existente. **Requer permissão de atualizar projetos.**

**Headers:**
```http
Authorization: Bearer {token}
```

**Parâmetros:**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `slug` | string | Slug da organização |
| `projectId` | UUID | ID do projeto |

**Body:**
```json
{
  "name": "Nome Atualizado",
  "description": "Nova descrição"
}
```

**Resposta (200):**
```json
{
  "projectId": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

#### Deletar Projeto
```http
DELETE /organizations/:slug/projects/:projectId
```

Remove um projeto permanentemente. **Requer permissão de deletar projetos.**

**Headers:**
```http
Authorization: Bearer {token}
```

**Parâmetros:**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `slug` | string | Slug da organização |
| `projectId` | UUID | ID do projeto |

**Resposta (204):** `null`

---

### 💌 Convites

#### Listar Convites
```http
GET /organizations/:slug/invites
```

Retorna todos os convites pendentes de uma organização. **Requer permissão de ver convites.**

**Headers:**
```http
Authorization: Bearer {token}
```

**Parâmetros:**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `slug` | string | Slug da organização |

**Resposta (201):**
```json
{
  "invites": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "convidado@exemplo.com",
      "role": "MEMBER",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "author": {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "name": "João Silva"
      }
    }
  ]
}
```

---

#### Listar Convites Pendentes (Usuário)
```http
GET /pending-invites
```

Retorna todos os convites pendentes para o usuário autenticado.

**Headers:**
```http
Authorization: Bearer {token}
```

**Resposta (201):**
```json
{
  "invites": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "usuario@exemplo.com",
      "role": "MEMBER",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "author": {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "name": "João Silva"
      },
      "organization": {
        "id": "550e8400-e29b-41d4-a716-446655440002",
        "name": "Minha Empresa"
      }
    }
  ]
}
```

---

#### Obter Detalhes do Convite
```http
GET /invites/:inviteId
```

Retorna os detalhes de um convite específico. **Não requer autenticação.**

**Parâmetros:**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `inviteId` | UUID | ID do convite |

**Resposta (201):**
```json
{
  "invite": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "convidado@exemplo.com",
    "role": "MEMBER",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "author": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "João Silva",
      "avatarUrl": "https://example.com/avatar.jpg"
    },
    "organization": {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "name": "Minha Empresa"
    }
  }
}
```

---

#### Criar Convite
```http
POST /organizations/:slug/invites
```

Cria um novo convite para a organização. **Requer permissão de criar convites.**

**Headers:**
```http
Authorization: Bearer {token}
```

**Parâmetros:**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `slug` | string | Slug da organização |

**Body:**
```json
{
  "email": "novo@exemplo.com",
  "role": "MEMBER"
}
```

**Resposta (201):**
```json
{
  "inviteId": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

#### Aceitar Convite
```http
POST /invites/:inviteId/accept
```

Aceita um convite pendente e adiciona o usuário à organização.

**Headers:**
```http
Authorization: Bearer {token}
```

**Parâmetros:**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `inviteId` | UUID | ID do convite |

**Resposta (204):** `null`

---

#### Rejeitar Convite
```http
DELETE /invites/:inviteId/reject
```

Rejeita um convite pendente.

**Headers:**
```http
Authorization: Bearer {token}
```

**Parâmetros:**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `inviteId` | UUID | ID do convite |

**Resposta (204):** `null`

---

#### Revogar Convite
```http
DELETE /organizations/:slug/invites/:inviteId
```

Cancela um convite pendente. **Requer permissão de deletar convites.**

**Headers:**
```http
Authorization: Bearer {token}
```

**Parâmetros:**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `slug` | string | Slug da organização |
| `inviteId` | UUID | ID do convite |

**Resposta (204):** `null`

---

### 💳 Cobrança

#### Obter Informações de Cobrança
```http
GET /organizations/:slug/billing
```

Retorna as informações de cobrança da organização. **Requer permissão de ver cobrança.**

**Headers:**
```http
Authorization: Bearer {token}
```

**Parâmetros:**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `slug` | string | Slug da organização |

**Resposta (200):**
```json
{
  "billing": {
    "seats": {
      "amount": 5,
      "unit": 10,
      "price": 50
    },
    "projects": {
      "amount": 3,
      "unit": 20,
      "price": 60
    },
    "total": 110
  }
}
```

---

## 🧪 Exemplos de Uso

### Fluxo Completo de Autenticação

```bash
# 1. Criar conta
curl -X POST http://localhost:3333/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@exemplo.com",
    "password": "senha123"
  }'

# 2. Autenticar
curl -X POST http://localhost:3333/sessions/password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@exemplo.com",
    "password": "senha123"
  }'

# Resposta: {"token": "eyJhbGciOiJIUzI1NiIs..."}

# 3. Usar token em requisições protegidas
curl -X GET http://localhost:3333/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

### Fluxo de Organização

```bash
# Criar organização
curl -X POST http://localhost:3333/organizations \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Minha Startup",
    "domain": "minhastartup.com"
  }'

# Listar organizações
curl -X GET http://localhost:3333/organizations \
  -H "Authorization: Bearer {token}"
```

### Fluxo de Convites

```bash
# Criar convite
curl -X POST http://localhost:3333/organizations/minha-startup/invites \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "novo@exemplo.com",
    "role": "MEMBER"
  }'

# O usuário convidado aceita
curl -X POST http://localhost:3333/invites/{inviteId}/accept \
  -H "Authorization: Bearer {token-do-convidado}"
```

---

## ⚠️ Tratamento de Erros

Todos os erros seguem o formato padronizado:

```json
{
  "statusCode": 401,
  "error": "Unauthorized",
  "message": "Invalid auth token"
}
```

Ou para erros de validação:

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Invalid input data"
}
```

---

## 📦 Stack Tecnológica

- **[Fastify](https://www.fastify.io/)** - Framework web rápido
- **[Zod](https://zod.dev/)** - Validação de schemas
- **[Prisma](https://www.prisma.io/)** - ORM
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados
- **[CASL](https://casl.js.org/)** - Autorização RBAC
- **[Scalar](https://scalar.com/)** - Documentação interativa

---

## 🤝 Contribuindo

Para mais informações sobre contribuição, consulte o [README principal](../README.md) do projeto.

---

## 📝 Licença

Este projeto está licenciado sob a [MIT License](../LICENSE).

---

<p align="center">
  <strong>⭐ API SaaS - Desenvolvida com Fastify & TypeScript</strong>
</p>
