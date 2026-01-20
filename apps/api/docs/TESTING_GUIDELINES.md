# Regras para Testes Unitários

## Estratégia de Teste
- **Escopo:** Apenas testes unitários. Foque na lógica de negócio (Use Cases).
- **Isolamento:** Nunca use bancos de dados reais (Docker, SQLite, etc.). 
- **In-Memory:** Utilize sempre o padrão "In-Memory Repository" para simular o banco de dados. Essas classes **NÂO** implementam os constructor.
- **Mocks:** Use mocks apenas para dependências externas (Gateways de pagamento, APIs de terceiros).

## Nomenclatura e Diretório
**Localização:** Os repositorios in memory devem ficar na pasta `src/modules/**/repositories/in-memory/**`.
- **Localização:** Os testes devem ficar na pasta `src/modules/**/use-cases/**` junto ao arquivo testado com a extensão `.spec.ts`. Caso um teste já exista, implemente só o que achar necessário conforme a lógica do use case em questão.
- **Arquivos:** Nomeie como `nome-do-servico.spec.ts`.
- **Descrição:** Use o padrão `describe('Nome do Serviço')` e `it('should...')` em inglês.

## Padrão de Escrita (AAA)
Siga rigorosamente a estrutura:
1. **Arrange:** Setup de dados e repositórios em memória.
2. **Act:** Execução da função/método principal.
3. **Assert:** Verificação do resultado esperado.

## Exemplo de Estrutura Esperada
- Criar uma classe `InMemory[Entity]Repository` que implementa a interface do repositório real usando um array interno. Caso a classe já exista implemente só métodos que faltam implemntar, caso precise.
- Instanciar o repositório no `beforeEach`.
