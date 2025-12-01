<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 200px 0 20px 0;">

<div style="font-size: 24px; margin-bottom: 12px;"><strong>Amazon Q</strong></div>
<div style="background: rgba(128, 128, 128, 0.15); border: 1px solid rgba(128, 128, 128, 0.25); border-radius: 8px; padding: 8px; margin: 4px 0; text-align: center;">
<div style="font-size: 14px; margin-bottom: 4px;"><strong>Did you know?</strong></div>
<div>Create and add Saved Prompts using the @ context menu</div>
</div>

Select code & ask me to explain, debug or optimize it, or type `/` for quick actions

</div>

---

 **@pm2025-2-backend-criar-modelo-disciplina.md**

---

Vou criar o modelo Mongoose para disciplinas com a documentação JSDoc solicitada.

---

Criando o modelo Mongoose para disciplinas com JSDoc completo

---


## Modelo Disciplina Criado

Criei o modelo Mongoose para a collection `disciplinas` com todas as especificações solicitadas:

### Campos Implementados

- **`curso`**: ObjectId referenciando a collection de cursos (obrigatório)
- **`nome`**: String com validações de tamanho (obrigatório)
- **`cargaHoraria`**: Number com validações de range (obrigatório)
- **`professorResponsavel`**: ObjectId referenciando professores (opcional)
- **`status`**: Boolean para ativo/inativo (padrão: true)

### Funcionalidades Adicionais

- **Timestamps automáticos**: `createdAt` e `updatedAt`
- **Índices otimizados** para consultas por curso, nome, professor e status
- **Métodos estáticos** para consultas comuns (disciplinas ativas, por curso)
- **Middleware pre-save** para formatação do nome
- **Validações robustas** com mensagens em português
- **Documentação JSDoc completa** para todos os campos e métodos

O modelo está pronto para ser integrado ao sistema e inclui todas as boas práticas de desenvolvimento com Mongoose.

---

 **@pm2025-2-RF01-CRUD-disciplina.md**

---

Vou criar o CRUD completo para disciplinas com controller, rotas e documentação Swagger.

---

Criando o controller para disciplinas com CRUD completo

---

Criando as rotas para disciplinas com documentação Swagger completa

---

Adicionando o campo código ao modelo Disciplina conforme especificado no prompt

---

Adicionando índice para o campo código

---

Registrando as rotas de disciplinas no app principal

---


## CRUD Disciplinas - Implementação Completa

### Endpoints REST Criados

#### **POST /api/v1/disciplinas**
- **Ação**: Cria uma nova disciplina
- **Body**: `{ curso, nome, codigo, cargaHoraria, professorResponsavel, status }`
- **Validações**: 
  - `curso`: obrigatório (ObjectId)
  - `nome`: obrigatório (2-100 caracteres)
  - `codigo`: obrigatório, único, maiúsculo
  - `cargaHoraria`: obrigatório (1-1000 horas)
- **Resposta**: `201 Created` + objeto criado

#### **GET /api/v1/disciplinas**
- **Ação**: Lista disciplinas com filtros e paginação
- **Query Params**:
  - `?status=true|false|Ativa|Inativa`
  - `?nome=texto` (busca case-insensitive)
  - `?codigo=texto` (busca case-insensitive)
  - `?page=1&limit=20`
- **Resposta**: Array com paginação e população de curso/professor

#### **GET /api/v1/disciplinas/:id**
- **Ação**: Busca disciplina por ID
- **Resposta**: `200 OK` + objeto ou `404 Not Found`

#### **PUT /api/v1/disciplinas/:id**
- **Ação**: Atualiza disciplina por ID
- **Body**: Campos parciais permitidos
- **Resposta**: `200 OK` + objeto atualizado ou `404 Not Found`

#### **DELETE /api/v1/disciplinas/:id**
- **Ação**: Remove disciplina por ID
- **Resposta**: `204 No Content` ou `404 Not Found`

### Funcionalidades Implementadas

✅ **Controller completo** com tratamento de erros em português  
✅ **Rotas RESTful** seguindo padrão `/api/v1/disciplinas`  
✅ **Validações robustas** com mensagens personalizadas  
✅ **Filtros avançados** por status, nome e código  
✅ **Paginação** com metadados (total, páginas)  
✅ **População** de curso e professor responsável  
✅ **Documentação Swagger** completa com exemplos  
✅ **JSDoc** em todo o código  
✅ **Tratamento de erros** padronizado (400, 404, 500)  
✅ **Integração** com app principal  

### Convenções de Erro

```json
{
  "message": "Descrição do erro em português",
  "details": "Detalhes específicos do erro"
}
```

- **400 Bad Request**: Validação ou ID inválido
- **404 Not Found**: Recurso não encontrado  
- **500 Internal Server Error**: Erro interno

A documentação Swagger estará disponível em `/api-docs` com todos os exemplos e esquemas definidos.

---

Me ajude com este erro:
```
	
Error: Internal Server Error

Response body
Download
{
  &quot;message&quot;: &quot;Erro interno do servidor&quot;,
  &quot;details&quot;: &quot;E11000 duplicate key error collection: pm2025-2-mongodb.disciplinas index: codigo_1 dup key: { codigo: \&quot;POO001\&quot; }&quot;
}
```

---

O erro indica que você está tentando criar uma disciplina com um código que já existe no banco. Vou ajustar o controller para tratar esse erro específico de duplicação:

---

Adicionando tratamento específico para erro de duplicação de código

---

Adicionando tratamento de duplicação também no método de atualização

---


## Erro Resolvido

O erro `E11000 duplicate key error` ocorre quando você tenta criar uma disciplina com um código que já existe no banco de dados.

### Solução Implementada

Adicionei tratamento específico para o erro de duplicação (código 11000) que agora retorna:

```json
{
  "message": "Código da disciplina já existe",
  "details": "Este código já está sendo usado por outra disciplina"
}
```

### Como Resolver

1. **Use um código diferente** para a nova disciplina
2. **Verifique códigos existentes** antes de criar
3. **O erro agora retorna 400 Bad Request** com mensagem clara em português

O tratamento foi adicionado tanto na criação quanto na atualização de disciplinas.