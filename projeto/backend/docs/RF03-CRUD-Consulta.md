# RF03 - CRUD Consulta de Horários

## Implementação Completa dos Endpoints REST de Consulta

### 1. Novo Controller: `consultaController.js`

Criado controller especializado para consultas de horários com:

#### Função `calcularSemana(dataBase)`
- Recebe data no formato YYYY-MM-DD
- Calcula automaticamente segunda-feira e sábado da semana
- Retorna `{ inicioSemana, fimSemana }`

#### Função `consultarHorarios(req, res)`
- Filtros dinâmicos baseados em query parameters
- Suporte a intervalo de datas e semana específica
- Retorna dados populados com nomes das entidades

### 2. Nova Rota: `/api/v1/consultas`

#### Endpoint Principal: `GET /api/v1/consultas/horarios`

**Query Parameters Aceitos:**

| Parâmetro | Tipo | Descrição | Exemplo |
|-----------|------|-----------|---------|
| `laboratorio` | String | ID do laboratório | `?laboratorio=507f1f77bcf86cd799439011` |
| `professor` | String | ID do professor | `?professor=507f1f77bcf86cd799439012` |
| `curso` | String | ID do curso | `?curso=507f1f77bcf86cd799439013` |
| `disciplina` | String | ID da disciplina | `?disciplina=507f1f77bcf86cd799439014` |
| `dataInicio` | String | Data início (YYYY-MM-DD) | `?dataInicio=2025-03-01` |
| `dataFim` | String | Data fim (YYYY-MM-DD) | `?dataFim=2025-07-01` |
| `semana` | String | Data base para semana (YYYY-MM-DD) | `?semana=2025-03-15` |

### 3. Exemplos de Uso

#### Consultar por Laboratório
```http
GET /api/v1/consultas/horarios?laboratorio=507f1f77bcf86cd799439011
```

#### Consultar por Professor e Curso
```http
GET /api/v1/consultas/horarios?professor=507f1f77bcf86cd799439012&curso=507f1f77bcf86cd799439013
```

#### Consultar por Intervalo de Datas
```http
GET /api/v1/consultas/horarios?dataInicio=2025-03-01&dataFim=2025-07-01
```

#### Consultar por Semana Específica
```http
GET /api/v1/consultas/horarios?semana=2025-03-15
```
*Retorna aulas da semana de 10/03 (segunda) a 15/03 (sábado)*

#### Consultar Múltiplos Filtros
```http
GET /api/v1/consultas/horarios?laboratorio=507f1f77bcf86cd799439011&professor=507f1f77bcf86cd799439012&semana=2025-03-15
```

### 4. Estrutura de Resposta

```json
{
  "total": 2,
  "filtros": {
    "laboratorio": "507f1f77bcf86cd799439011",
    "semana": "2025-03-15"
  },
  "aulas": [
    {
      "_id": "507f1f77bcf86cd799439015",
      "semestre": "2025.1",
      "diaSemana": "Segunda-feira",
      "dataInicio": "2025-03-01T00:00:00.000Z",
      "dataFim": "2025-07-01T00:00:00.000Z",
      "cursoId": {
        "_id": "507f1f77bcf86cd799439013",
        "nome": "Engenharia de Software"
      },
      "disciplinaId": {
        "_id": "507f1f77bcf86cd799439014",
        "nome": "Programação Web",
        "codigo": "ESW001"
      },
      "professorId": {
        "_id": "507f1f77bcf86cd799439012",
        "nome": "Prof. João Silva"
      },
      "laboratorioId": {
        "_id": "507f1f77bcf86cd799439011",
        "nome": "Lab Informática 1",
        "codigo": "LAB001"
      },
      "blocos": [
        {
          "_id": "507f1f77bcf86cd799439016",
          "nome": "1º Horário",
          "horarioInicial": "07:30",
          "horarioFinal": "08:20"
        }
      ]
    }
  ]
}
```

### 5. Regras Implementadas

#### ✅ Montagem Dinâmica de Filtros
```javascript
const filtro = {};
if (laboratorio) filtro.laboratorioId = laboratorio;
if (professor) filtro.professorId = professor;
if (curso) filtro.cursoId = curso;
if (disciplina) filtro.disciplinaId = disciplina;
```

#### ✅ Cálculo Automático de Semana
```javascript
const calcularSemana = (dataBase) => {
  const data = new Date(dataBase);
  const diaSemana = data.getDay();
  const diasParaSegunda = diaSemana === 0 ? -6 : 1 - diaSemana;
  // ... lógica de cálculo
};
```

#### ✅ Filtro por Intervalo de Datas
- Suporte a `dataInicio` e `dataFim` independentes
- Lógica de sobreposição de períodos
- Prioridade para filtro `semana` sobre intervalo manual

#### ✅ Populates Obrigatórios
Todas as consultas retornam dados populados:
- `cursoId` (nome)
- `disciplinaId` (nome, codigo)
- `professorId` (nome)
- `laboratorioId` (nome, codigo)
- `blocos` (nome, horarioInicial, horarioFinal)

### 6. Arquivos Criados/Modificados

#### Novos Arquivos:
- `src/controllers/consultaController.js` - Controller de consultas
- `src/routes/consultaRoutes.js` - Rotas de consulta com Swagger
- `docs/RF03-CRUD-Consulta.md` - Esta documentação

#### Arquivos Modificados:
- `src/app.js` - Adicionada rota `/api/v1/consultas`

### 7. Funcionalidades

✅ **Endpoint Especializado** - Rota dedicada para consultas  
✅ **Filtros Dinâmicos** - Montagem condicional baseada em parâmetros  
✅ **Cálculo de Semana** - Automático de segunda a sábado  
✅ **Intervalo de Datas** - Suporte flexível a períodos  
✅ **Dados Populados** - Nomes de todas as entidades relacionadas  
✅ **Documentação Swagger** - API documentada automaticamente  
✅ **Ordenação** - Por dia da semana e data de criação  
✅ **Resposta Estruturada** - Total, filtros aplicados e resultados  

### 8. Integração

A nova rota está integrada ao sistema existente:
- Registrada no `app.js`
- Utiliza o modelo `Aula` existente
- Compatível com a estrutura atual do projeto
- Documentação Swagger incluída