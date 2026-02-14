# Regras para Testes E2E Frontend (Playwright)

## Configuração
  - **Playwright**: Já está  instalado na raiz do projeto do Monorepo.
  - **Test Runner**: Execute `pnpm run test:e2e` que está package na raiz do Monorepo.
  - **Auth:** Use `test.use({ storageState: './playwright/.auth/admin.json' })` ou `test.use({ storageState: './playwright/.auth/member.json' })` conforme as necessidades dos testas para rotas protegidas. Também já está configura do raiz do Monorepo.

## Tech Stack
- **Ferramenta:** Playwright (Test Runner).
- **Linguagem:** TypeScript.
- **Ambiente:** Navegadores reais (Chromium, Firefox, WebKit).

## Estratégia de Teste
- **Foco:** Jornadas do usuário (User Flows) e fluxos críticos (Login, Checkout, Cadastro).
- **Isolamento:** Diferente do unitário, aqui testamos a integração real. Se necessário, use `page.route` para mockar APIs externas persistentes.
- **Seletores:** Priorize `page.getByRole`, `page.getByText` ou `page.getByPlaceholder` (foco em acessibilidade). Evite seletores CSS genéricos como `div > span`.
- **Protected Routes:** Use dentro do **describe** `test.use({ storageState: './playwright/.auth/admin.json' })` ou `test.use({ storageState: './playwright/.auth/member.json' })` conforme as necessidades dos testas para rotas protegidas.

## Nomenclatura e Diretório
- **Localização:** Sempre no mesmo diretório do arquivo/página que está sendo testada.
- **Arquivos:** Extensão obrigatória `.e2e.spec.ts`.
- **Exemplo:** Se testar `src/app/login/page.tsx`, o teste será `src/app/login/login.e2e.spec.ts`. SEMPRE pegue o nome da pasta. Exemplo: `src/app/login/login.e2e.spec.ts` em vez de `src/app/login/page.e2e.spec.tsx`.

## Padrões de Código
- **Navegação:** Use `await page.goto('/')` com caminhos relativos.
- **Asserções:** Use `expect(page).toHaveURL()`, `expect(locator).toBeVisible()`.
- **Ações:** Sempre use `await` para ações como `click()`, `fill()` e `press()`.
- **Hooks:** Use `test.beforeEach` para setups comuns (como limpar cookies ou fazer login).

## O que EVITAR
- **Hardcoded Sleeps:** Nunca use `page.waitForTimeout(3000)`. O Playwright tem auto-waiting; se precisar, use esperas baseadas em estado (ex: `waitForSelector`).
- **Dependência de Dados:** Tente fazer com que o teste crie seus próprios dados ou limpe o estado para não quebrar em execuções consecutivas.
