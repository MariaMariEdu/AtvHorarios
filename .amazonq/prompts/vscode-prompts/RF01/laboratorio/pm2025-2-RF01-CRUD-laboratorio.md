**Crie a definição dos endpoints REST CRUD para a entidade `laboratorios` e a documentação associada, formatando a resposta em Markdown.**

**Tecnologias/Contexto**: Projeto Backend (Node.js/Express, Mongoose).  
**Idioma das Respostas**: Português (pt-BR).

---

### 1. Endpoint CRUD para Laboratórios
a) **Estrutura da Rota e Controllers**: `/api/v1/laboratorios`

b) **POST /api/v1/laboratorios**
* **Ação**: Cria um novo laboratório.
* **Body (JSON)**: `{ nome, capacidade, localizacao, equipamentos, status }`.
* **Validação**:
  * `nome`: String, obrigatório, único.
  * `capacidade`: Number, obrigatório.
  * `localizacao`: String, obrigatório (ex.: "Bloco A - Sala 12").
  * `equipamentos`: Array de strings (opcional).
  * `status`: String ou boolean (`Ativo`, `Inativo`, true/false).
* **Resposta**: Retorna `201 Created` e o objeto criado.

c) **GET /api/v1/laboratorios**
* **Ação**: Lista todos os laboratórios.
* **Suporte a Query Params**:
    * `?status=true|false|Ativo|Inativo`: Filtrar por status.
    * `?nome=...`: Filtrar por nome (contains, case-insensitive).
    * `?localizacao=...`: Filtrar por localização.
    * `?capacidadeMin=20&capacidadeMax=40`: Faixa de capacidade.
    * `?page=1&limit=20`: Paginação.

d) **GET /api/v1/laboratorios/:id**
* **Ação**: Busca um laboratório pelo seu ID (`ObjectId`).
* **Resposta**: Retorna `200 OK` e o objeto, ou `404 Not Found`.

e) **PUT /api/v1/laboratorios/:id**
* **Ação**: Atualiza um laboratório pelo seu ID (`ObjectId`).
* **Body (JSON)**: Corpo parcial permitido.
* **Resposta**: Retorna `200 OK` e o objeto atualizado, ou `404 Not Found`.

f) **DELETE /api/v1/laboratorios/:id**
* **Ação**: Remove um laboratório pelo seu ID.
* **Resposta**: Retorna `204 No Content`, ou `404 Not Found`.

---

### 2. Documentação e Convenções de Erro
* **Definir suporte ao Swagger** (ou OpenAPI).
* **Gerar a Documentação Swagger e JSDoc** para rotas e controllers de `laboratorios`.
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
* `GET /api/v1/laboratorios` deve retornar um array JSON (vazio se não houver registros).
* `PUT/DELETE` com ID inexistente devem retornar `404`.
* Swagger/OpenAPI acessível (ex.: `/api-docs`) com exemplos válidos para todos os endpoints.
* Código documentado com **JSDoc** e mensagens em pt-BR.

