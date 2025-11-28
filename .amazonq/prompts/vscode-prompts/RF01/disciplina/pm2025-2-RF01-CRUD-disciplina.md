**Crie a definição dos endpoints REST CRUD para a entidade `disciplinas` e a documentação associada, formatando a resposta em Markdown.**

**Tecnologias/Contexto**: Projeto Backend (Node.js/Express, Mongoose).  
**Idioma das Respostas**: Português (pt-BR).

---

### 1. Endpoint CRUD para Disciplinas
a) **Estrutura da Rota e Controllers**: `/api/v1/disciplinas`

b) **POST /api/v1/disciplinas**
* **Ação**: Cria uma nova disciplina.
* **Body (JSON)**: `{ nome, codigo, cargaHoraria, status }`.
* **Resposta**: Retorna `201 Created` e o objeto criado.
* **Validação**:
  * `nome`: obrigatório.
  * `codigo`: obrigatório, formato válido, único.
  * `cargaHoraria`: obrigatório (Number).
  * `status`: string ou boolean (`Ativa`, `Inativa`, true/false).

c) **GET /api/v1/disciplinas**
* **Ação**: Lista todas as disciplinas.
* **Suporte a Query Params Simples**:
    * `?status=true|false|Ativa|Inativa`: Filtrar por status.
    * `?nome=...`: Filtrar por nome (contains, case-insensitive).
    * `?codigo=...`: Filtrar por código (contains, case-insensitive).
    * `?page=1&limit=20`: Paginação.

d) **GET /api/v1/disciplinas/:id**
* **Ação**: Busca uma disciplina pelo seu ID (`ObjectId`).
* **Resposta**: Retorna `200 OK` e o objeto, ou `404 Not Found`.

e) **PUT /api/v1/disciplinas/:id**
* **Ação**: Atualiza uma disciplina pelo seu ID (`ObjectId`).
* **Body (JSON)**: Corpo parcial permitido para atualização.
* **Resposta**: Retorna `200 OK` e o objeto atualizado, ou `404 Not Found`.

f) **DELETE /api/v1/disciplinas/:id**
* **Ação**: Remove uma disciplina pelo seu ID.
* **Resposta**: Retorna `204 No Content`, ou `404 Not Found`.

---

### 2. Documentação e Convenções de Erro
* **Definir suporte ao Swagger** (ou similar, como OpenAPI).
* **Gerar a Documentação Swagger e JSDoc** para as rotas e controllers criados.
* **Convenções de Resposta de Erro**:
    * `400 Bad Request`: Falha na validação de dados.
    * `404 Not Found`: Recurso não encontrado.
    * `500 Internal Server Error`: Erro interno.
    * Formato JSON:
      ```json
      { "message": "string", "details": {} }
      ```

---

### 3. Critérios de Aceite
* O código do Controller e da Rota deve estar em **Markdown** e ser funcional.
* `GET /api/v1/disciplinas` retorna um array JSON, vazio se não houver registros.
* `PUT/DELETE` com ID inexistente retornam `404`.
* Swagger/OpenAPI acessível (ex: `/api-docs`) com **exemplos válidos** para os endpoints de `disciplinas`.
* Código com **JSDoc** e **mensagens em pt-BR**.

