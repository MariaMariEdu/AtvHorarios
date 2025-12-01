@projeto @backend  
resposta: pt-br  

**Crie a definição dos endpoints REST CRUD para a entidade `aulas`, incluindo validações de conflito de horário entre laboratório e professor. A resposta deve estar formatada em Markdown.**

**Tecnologias/Contexto**: Backend Node.js/Express + Mongoose  
**Idioma**: Português (pt-BR)

---

# 1. Endpoint CRUD para Aulas
A entidade deve seguir este schema:

```js
{
  semestre: String, // obrigatório
  cursoId: ObjectId, // obrigatório
  disciplinaId: ObjectId, // obrigatório
  professorId: ObjectId, // obrigatório
  laboratorioId: ObjectId, // obrigatório
  diaSemana: String, // obrigatório
  blocos: [ObjectId], // obrigatório – lista de blocos de horário
  dataInicio: Date, // obrigatório
  dataFim: Date // obrigatório
}
```

---

## Regras de Negócio Obrigatórias (Validação de Conflitos)

### **1. Conflito de Laboratório**
Ao criar ou atualizar uma aula:
- O sistema **não pode permitir** que o mesmo `laboratorioId` seja utilizado  
  no **mesmo `diaSemana`** e no **mesmo(s) `blocos`**.

### **2. Conflito de Professor**
Ao criar ou atualizar uma aula:
- O sistema **não pode permitir** que o mesmo `professorId` tenha outra aula  
  no **mesmo `diaSemana`** e no **mesmo(s) `blocos`**.

### **3. Mensagem de erro (400)**
Em caso de conflito:
```json
{
  "message": "Conflito de horário",
  "details": {
    "tipo": "laboratorio|professor",
    "diaSemana": "Segunda",
    "blocos": ["idDoBloco"]
  }
}
```

---

# 2. Endpoints REST

## a) Estrutura da rota
`/api/v1/aulas`

---

## b) POST /api/v1/aulas  
Cria uma nova aula.

**Body JSON:**
```json
{
  "semestre": "2025/1",
  "cursoId": "ObjectId",
  "disciplinaId": "ObjectId",
  "professorId": "ObjectId",
  "laboratorioId": "ObjectId",
  "diaSemana": "Segunda",
  "blocos": ["ObjectId"],
  "dataInicio": "2025-02-10",
  "dataFim": "2025-06-30"
}
```

### Regras aplicadas:
- validação dos campos obrigatórios
- verificação de conflito de laboratório
- verificação de conflito de professor

**Resposta:**
- `201 Created` + objeto criado  
- `400 Bad Request` se houver conflito ou erro de validação  

---

## c) GET /api/v1/aulas  
Lista todas as aulas.

**Query Params opcionais:**
- `?cursoId=...`
- `?professorId=...`
- `?disciplinaId=...`
- `?semestre=...`
- `?diaSemana=...`
- `?page=1&limit=20`

**Resposta:**
- `200 OK` + JSON array (pode ser vazio)

---

## d) GET /api/v1/aulas/:id  
Busca uma aula por ID.

**Resposta:**
- `200 OK` + objeto  
- `404 Not Found`

---

## e) PUT /api/v1/aulas/:id  
Atualiza uma aula (parcial ou completa).

Regras aplicadas:
- validações dos campos
- **verificação de conflito de laboratório**
- **verificação de conflito de professor**

**Resposta:**
- `200 OK` + objeto atualizado  
- `404 Not Found`  
- `400 Bad Request` se houver conflito  

---

## f) DELETE /api/v1/aulas/:id  
Remove uma aula.

**Resposta:**
- `204 No Content`  
- `404 Not Found`

---

# 3. Documentação e Convenções de Erro

### Swagger/OpenAPI
Gerar documentação completa incluindo:
- exemplos
- descrição dos campos
- mensagens de erro por conflito
- status codes

### Formato padrão de erro:
```json
{
  "message": "string",
  "details": {}
}
```

### Status esperados:
- `400` validação / conflito  
- `404` não encontrado  
- `500` erro interno  

---

# 4. Critérios de Aceite

- Controller e rotas funcionais e documentadas em Markdown.
- Rota registrada no `server.js`.
- `GET` retorna array, mesmo se vazio.
- `PUT/DELETE` retornam `404` para ID inexistente.
- **POST e PUT devem impedir conflitos de horário entre laboratório e professor.**
- Swagger acessível em `/api-docs`.
- Código com JSDoc e mensagens em pt-BR.

