**Crie a definição dos endpoints REST CRUD para a entidade `blocos-horario` e a documentação associada, formatando a resposta em Markdown.**

**Tecnologias/Contexto**: Projeto Backend (Node.js/Express, Mongoose).  
**Idioma das Respostas**: Português (pt-BR).

---

### 1. Endpoint CRUD para Blocos de Horário
a) **Estrutura da Rota e Controllers**: `/api/v1/blocos-horario`

b) **POST /api/v1/blocos-horario**
* **Ação**: Cria um novo bloco de horário.
* **Body (JSON)**: `{ turno, diaSemana, inicio, fim, ordem }`.
* **Resposta**: Retorna `201 Created` e o objeto criado.
* **Validação**:
  * `turno`: obrigatório (Manhã, Tarde, Noite).
  * `diaSemana`: obrigatório (1–7 ou texto).
  * `inicio`: obrigatório (HH:mm).
  * `fim`: obrigatório (HH:mm).
  * `ordem`: obrigatório (Number para ordenação sequencial).

c) **GET /api/v1/blocos-horario**
* **Ação**: Lista todos os blocos de horário.
* **Suporte a Query Params Simples**:
    * `?turno=...`: Filtrar por turno.
    * `?diaSemana=...`: Filtrar por dia da semana.
    * `?page=1&limit=20`: Paginação.

d) **GET /api/v1/blocos-horario/:id**
* **Ação**: Busca um bloco de horário pelo seu ID (`ObjectId`).
* **Resposta**: Retorna `200 OK` e o objeto, ou `404 Not Found`.

e) **PUT /api/v1/blocos-horario/:id**
* **Ação**: Atualiza um bloco de horário pelo seu ID (`ObjectId`).
* **Body (JSON)**: Corpo parcial permitido para atualização.
* **Resposta**: Retorna `200 OK` e o objeto atualizado, ou `404 Not Found`.

f) **DELETE /api/v1/blocos-horario/:id**
* **Ação**: Remove um bloco de horário pelo seu ID.
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
* Criar a rota no Server.js
* `GET /api/v1/blocos-horario` retorna um array JSON, vazio se não houver registros.
* `PUT/DELETE` com ID inexistente retornam `404`.
* Swagger/OpenAPI acessível (ex: `/api-docs`) com **exemplos válidos** para os endpoints de `blocos-horario`.
* Código com **JSDoc** e **mensagens em pt-BR**.
