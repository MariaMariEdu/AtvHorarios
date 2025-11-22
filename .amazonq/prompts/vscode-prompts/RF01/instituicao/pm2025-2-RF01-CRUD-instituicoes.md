@projeto @backend

respostas: pt-br

1.) o endpoint CRUD para instituições



b) criar a rota e controlers para o endpoints: /api/v1/instituicoes

b.1) POST /api/v1/instituicoes
Cria instituição.
Body (JSON): { nome, cnpj, email?, telefone?, endereco?, ativo? }
Retorna 201 + objeto criado.
valida duplicidade de CNPJ (409).

b.2) GET /api/v1/instituicoes
Lista todas em JSON array.
Suportar query params simples: ?ativo=true|false, ?nome=... (filtro contém, case-insensitive), ?page=1&limit=20.

b.) PUT /api/v1/instituicoes/:id
Atualiza por id (ObjectId).
Body parcial permitido.
Retorna 200 + objeto atualizado, 404 se não encontrado.

b.4) DELETE /api/v1/instituicoes/:id
Remove por id.
Retorna 204 sem corpo, 404 se não encontrado.

b.5) Convenções de resposta de erro (todas as rotas)
JSON { message: string, details?: any }
400 validação, 404 não encontrado, 409 conflito, 500 erro interno.



2.) Definir suporte ao Swagger

3.) Criar a documentação swagger e JSDoc

4)Critérios de aceite

GET /api/v1/instituicoes retorna array JSON (vazio se não houver registros).
POST com CNPJ repetido retorna 409 e mensagem clara em pt-BR.
PUT/DELETE com id inexistente retornam 404.
Swagger UI acessível em /api-docs com exemplos válidos.
Código com JSDoc e tratamento de erros centralizado (errorHandler.js).
Respostas e mensagens em pt-BR.