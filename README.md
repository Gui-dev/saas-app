# SaaS App

[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-blue?logo=github-actions)](.github/workflows/)
[![Tests](https://img.shields.io/badge/Tests-Vitest%20%26%20Playwright-green?logo=vitest)](./)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> Plataforma SaaS completa com arquitetura multi-tenant, autenticação JWT, controle de acesso baseado em funções (RBAC) e gerenciamento de organizações.

---

## 📸 Demo

<p align="center">
  <a href="https://www.youtube.com/watch?v=gXohhQNUm74" target="_blank">
    <img src="https://img.youtube.com/vi/gXohhQNUm74/0.jpg" width="600" alt="Watch the demo"/>
  </a>
</p>
<!-- ![Dashboard](docs/images/dashboard.png) -->

## ✨ Funcionalidades

### 🔐 Autenticação & Autorização
- Login com email/senha e OAuth (GitHub)
- JWT para gerenciamento de sessões
- Recuperação de senha via token seguro
- Controle de acesso baseado em funções (RBAC)

### 🏢 Multi-tenancy & Organizações
- Criação e gerenciamento de múltiplas organizações
- Domínio personalizado por organização
- Transferência de propriedade entre usuários
- Convites por email para novos membros

### 👥 Gestão de Membros
- Três níveis de permissão: **Admin**, **Membro**, **Billing**
- Atribuição e atualização de funções
- Remoção de membros da organização
- Visualização de convites pendentes

### 📁 Projetos
- Criação ilimitada de projetos por organização
- Slugs amigáveis para URLs
- Permissões granulares por projeto
- Gerenciamento completo (CRUD)

### 🎨 Interface
- Design responsivo com Tailwind CSS
- Temas claro/escuro
- Componentes acessíveis (Radix UI)
- Validação de formulários em tempo real

---

## 🛠️ Stack Tecnológica

### Backend
- **[Fastify](https://www.fastify.io/)** - Framework web rápido e eficiente
- **[Prisma](https://www.prisma.io/)** - ORM moderno para TypeScript
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional
- **[Zod](https://zod.dev/)** - Validação de schemas type-safe
- **[CASL](https://casl.js.org/)** - Autorização e permissões

### Frontend
- **[Next.js 16](https://nextjs.org/)** - Framework React com App Router
- **[React 19](https://react.dev/)** - Biblioteca UI
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utilitário
- **[TanStack Query](https://tanstack.com/query)** - Gerenciamento de estado server
- **[Radix UI](https://www.radix-ui.com/)** - Componentes headless acessíveis

### DevOps & Ferramentas
- **[Turborepo](https://turbo.build/)** - Monorepo build system
- **[pnpm](https://pnpm.io/)** - Gerenciador de pacotes
- **[Biome](https://biomejs.dev/)** - Linter e formatter
- **[Vitest](https://vitest.dev/)** - Testes unitários
- **[Playwright](https://playwright.dev/)** - Testes E2E
- **[Docker](https://www.docker.com/)** - Containerização do PostgreSQL

---

## 🚀 Começando

### Pré-requisitos

- **Node.js** >= 18
- **pnpm** 10.17.1
- **Docker** e Docker Compose (para PostgreSQL)

### Instalação

1. **Clone o repositório**

```bash
git clone https://github.com/Gui-dev/saas-app.git
cd saas-app
```

2. **Instale as dependências**

```bash
pnpm install
```

3. **Configure as variáveis de ambiente**

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/saas"
POSTGRESQL_USERNAME=postgres
POSTGRESQL_PASSWORD=password
POSTGRESQL_DATABASE=saas

# Authentication
JWT_SECRET="sua-chave-secreta-aqui"
GITHUB_OAUTH_CLIENT_ID="seu-client-id"
GITHUB_OAUTH_CLIENT_SECRET="seu-client-secret"
GITHUB_OAUTH_REDIRECT_URI="http://localhost:3000/api/auth/callback/github"

# Frontend
NEXT_PUBLIC_API_URL="http://localhost:3333"
```

4. **Inicie o banco de dados**

```bash
docker-compose up -d
```

5. **Execute as migrações e seed**

```bash
cd apps/api
pnpm db:migrate
pnpm db:seed
```

6. **Inicie o projeto em desenvolvimento**

```bash
# Na raiz do projeto
pnpm dev
```

Acesse:
- 🌐 Frontend: http://localhost:3000
- 🔌 API: http://localhost:3333
- 📚 Documentação API: http://localhost:3333/docs

---

## 📁 Estrutura do Projeto

```
saas-app/
├── apps/
│   ├── api/                    # Backend Fastify
│   │   ├── prisma/            # Schema e migrações
│   │   └── src/
│   │       ├── http/          # Servidor e middlewares
│   │       └── modules/       # Domínios (accounts, orgs, etc.)
│   └── web/                   # Frontend Next.js
│       └── src/
│           ├── app/           # App Router
│           ├── components/    # Componentes React
│           └── lib/           # Utilitários
├── packages/
│   ├── auth/                  # Autorização compartilhada (CASL)
│   └── env/                   # Configuração de ambiente
├── config/
│   └── typescript-config/     # Configs TypeScript compartilhadas
└── .github/workflows/         # CI/CD
```

---

## 💻 Desenvolvimento

### Scripts disponíveis

**Raiz do projeto:**

```bash
pnpm dev              # Inicia todos os apps em modo dev
pnpm build            # Build de produção
pnpm format-and-lint  # Executa linter e formatter
```

**API (apps/api):**

```bash
pnpm dev              # Servidor com hot reload
pnpm db:migrate       # Executa migrações do Prisma
pnpm db:studio        # Abre o Prisma Studio
pnpm db:seed          # Popula o banco com dados iniciais
pnpm test             # Testes unitários (Vitest)
```

**Frontend (apps/web):**

```bash
pnpm dev              # Servidor Next.js em desenvolvimento
pnpm build            # Build de produção
pnpm test             # Testes unitários
pnpm test:e2e         # Testes E2E (Playwright)
```

### Documentação da API

A documentação interativa está disponível em `/docs` quando a API está rodando.

Recursos:
- OpenAPI/Swagger gerado automaticamente dos schemas Zod
- Interface Scalar para testar endpoints
- Autenticação via JWT integrada

---

## 🧪 Testes

### Testes Unitários

```bash
# Backend
pnpm --filter api test

# Frontend
pnpm --filter web test
```

### Testes E2E

```bash
# Em outro terminal
pnpm run test:e2e
```

Os testes E2E são executados automaticamente via GitHub Actions em cada push e pull request.

---

## 🔄 CI/CD

O projeto utiliza **GitHub Actions** para automação:

- ✅ **Lint e Formatação** - Verificação de código em cada PR
- 🧪 **Testes E2E** - Execução automatizada de testes end-to-end
- 📦 **Build** - Geração de builds de produção

Verifique os workflows em [`.github/workflows/`](.github/workflows/).

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Siga os passos:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

**Diretrizes:**
- Siga o padrão de código definido pelo Biome
- Escreva testes para novas funcionalidades
- Mantenha a documentação atualizada
- Use commits semânticos

---

## 📝 Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

---

## 👨‍💻 Autor

Criado com ❤️ por [Adriano Silva](https://github.com/Gui-dev)

---

---

<p align="center">
  <strong>⭐ Star este repositório se ele te ajudou!</strong>
</p>
