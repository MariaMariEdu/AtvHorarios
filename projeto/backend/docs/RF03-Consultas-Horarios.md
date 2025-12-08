# RF03 - Módulo de Consultas de Horários

## Descrição
Implementação do módulo de **Consultas de Horários** que permite filtrar aulas por laboratório, professor, curso e intervalo de datas através da API REST.

## Implementação

### 1. Método `listarAulas` Atualizado

O método foi aprimorado no arquivo `src/controllers/aulaController.js` para suportar múltiplos filtros de consulta.

#### Parâmetros de Query Suportados

| Parâmetro | Tipo | Descrição | Exemplo |
|-----------|------|-----------|---------|
| `laboratorio` | String | ID do laboratório | `?laboratorio=507f1f77bcf86cd799439011` |
| `professor` | String | ID do professor | `?professor=507f1f77bcf86cd799439012` |
| `curso` | String | ID do curso | `?curso=507f1f77bcf86cd799439013` |
| `dataInicio` | String | Data início (YYYY-MM-DD) | `?dataInicio=2025-03-01` |
| `dataFim` | String | Data fim (YYYY-MM-DD) | `?dataFim=2025-07-01` |
| `disciplinaId` | String | ID da disciplina | `?disciplinaId=507f1f77bcf86cd799439014` |
| `semestre` | String | Semestre letivo | `?semestre=2025.1` |
| `diaSemana` | String | Dia da semana | `?diaSemana=Segunda-feira` |
| `page` | Number | Página (paginação) | `?page=1` |
| `limit` | Number | Limite por página | `?limit=20` |

### 2. Lógica de Filtros

#### a) Montagem Dinâmica
```javascript
const filtros = {};
if (curso || cursoId) filtros.cursoId = curso || cursoId;
if (professor || professorId) filtros.professorId = professor || professorId;
if (laboratorio) filtros.laboratorioId = laboratorio;
// ... outros filtros
```

#### b) Filtro por Intervalo de Datas
```javascript
if (dataInicio || dataFim) {
  filtros.$and = [];
  
  if (dataInicio && dataFim) {
    // Aulas que se sobrepõem ao período especificado
    filtros.$and.push({
      $or: [
        { dataInicio: { $lte: new Date(dataFim) }, dataFim: { $gte: new Date(dataInicio) } }
      ]
    });
  } else if (dataInicio) {
    // Aulas que terminam após a data de início
    filtros.$and.push({ dataFim: { $gte: new Date(dataInicio) } });
  } else if (dataFim) {
    // Aulas que começam antes da data de fim
    filtros.$and.push({ dataInicio: { $lte: new Date(dataFim) } });
  }
}
```

#### c) Populates Obrigatórios
Todas as consultas retornam dados populados automaticamente:
- `cursoId` (nome)
- `disciplinaId` (nome, codigo)
- `professorId` (nome)
- `laboratorioId` (nome, codigo)
- `blocos` (nome, horarioInicial, horarioFinal)

### 3. Exemplos de Uso

#### Consultar por Laboratório
```http
GET /api/v1/aulas?laboratorio=507f1f77bcf86cd799439011
```

#### Consultar por Professor e Período
```http
GET /api/v1/aulas?professor=507f1f77bcf86cd799439012&dataInicio=2025-03-01&dataFim=2025-07-01
```

#### Consultar por Curso e Professor
```http
GET /api/v1/aulas?curso=507f1f77bcf86cd799439013&professor=507f1f77bcf86cd799439012
```

#### Consultar Todas as Aulas
```http
GET /api/v1/aulas
```

#### Consultar com Paginação
```http
GET /api/v1/aulas?laboratorio=507f1f77bcf86cd799439011&page=2&limit=10
```

### 4. Resposta da API

```json
[
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
    ],
    "createdAt": "2025-01-27T10:00:00.000Z",
    "updatedAt": "2025-01-27T10:00:00.000Z"
  }
]
```

### 5. Funcionalidades Implementadas

✅ **Filtros Dinâmicos**: Montagem condicional de filtros baseada nos parâmetros recebidos  
✅ **Filtro por Datas**: Suporte a intervalos de datas com lógica de sobreposição  
✅ **Populates Automáticos**: Dados relacionados sempre incluídos na resposta  
✅ **Compatibilidade**: Suporte aos parâmetros antigos (`cursoId`, `professorId`) e novos (`curso`, `professor`)  
✅ **Paginação**: Controle de página e limite de registros  
✅ **Ordenação**: Resultados ordenados por data de criação (mais recentes primeiro)  
✅ **Tratamento de Erros**: Respostas padronizadas para erros  

### 6. Validações e Segurança

- Conversão automática de strings de data para objetos Date
- Validação de parâmetros de paginação
- Tratamento de erros com mensagens descritivas
- Suporte a consultas vazias (retorna todas as aulas)

### 7. Performance

- Uso de índices MongoDB para otimização de consultas
- Paginação para evitar sobrecarga de memória
- Populates seletivos (apenas campos necessários)
- Ordenação eficiente por `createdAt`