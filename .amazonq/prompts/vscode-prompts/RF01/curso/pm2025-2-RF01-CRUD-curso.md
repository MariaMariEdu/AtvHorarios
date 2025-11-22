**Crie a definição dos endpoints REST CRUD para a entidade `cursos` e a documentação associada, formatando a resposta em Markdown.**

**Tecnologias/Contexto**: Projeto Backend (Node.js/Express, Mongoose).
**Idioma das Respostas**: Português (pt-BR).

### 1. Endpoint CRUD para Cursos

a) **Estrutura da Rota e Controllers**: `/api/v1/cursos`

b) **POST /api/v1/cursos**
* **Ação**: Cria um novo curso.
* **Body (JSON)**: `{ instituicaoid, nome, turno, status }`.
* **Resposta**: Retorna `201 Created` e o objeto criado.
* **Validação**: Validar a obrigatoriedade dos campos `instituicaoid` e `nome`.

c) **GET /api/v1/cursos**
* **Ação**: Lista todos os cursos.
* **Suporte a Query Params Simples**:
    * `?status=true|false`: Filtrar por status do curso.
    * `?nome=...`: Filtrar por nome (filtro contém, case-insensitive).
    * `?instituicaoid=...`: Filtrar por instituição específica.
    * `?page=1&limit=20`: Paginação.

d) **GET /api/v1/cursos/:id**
* **Ação**: Busca um curso pelo seu ID (`ObjectId`).
* **Resposta**: Retorna `200 OK` e o objeto, ou `404 Not Found`.

e) **PUT /api/v1/cursos/:id**
* **Ação**: Atualiza um curso pelo seu ID (`ObjectId`).
* **Body (JSON)**: Corpo parcial permitido para atualização.
* **Resposta**: Retorna `200 OK` e o objeto atualizado, ou `404 Not Found`.

f) **DELETE /api/v1/cursos/:id**
* **Ação**: Remove um curso pelo seu ID.
* **Resposta**: Retorna `204 No Content`, ou `404 Not Found`.

### 2. Documentação e Convenções de Erro

* **Definir suporte ao Swagger** (ou similar, como OpenAPI).
* **Gerar a Documentação Swagger e JSDoc** para as rotas e controllers criados.
* **Convenções de Resposta de Erro**:
    * `400 Bad Request`: Falha na validação de dados.
    * `404 Not Found`: Recurso não encontrado.
    * `500 Internal Server Error`: Erro interno.
    * Formato JSON: `{ message: string, details?: any }`.

### 3. Critérios de Aceite

* O código do Controller e da Rota deve estar em **Markdown** e ser funcional.
* `GET /api/v1/cursos` retorna um array JSON, vazio se não houver registros.
* `PUT/DELETE` com ID inexistente retornam `404`.
* Swagger/OpenAPI acessível (ex: `/api-docs`) com **exemplos válidos** para os endpoints de `cursos`.
* Código com **JSDoc** e **mensagens em pt-BR**.