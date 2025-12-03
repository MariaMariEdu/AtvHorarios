@projeto @backend

resposta: pt-br

Implemente no backend o módulo de *Consultas de Horários* (RF03).  
A nova funcionalidade deve permitir consultar aulas filtrando por laboratório, professor, curso e intervalo de datas.

A resposta deve estar formatada em Markdown.

## 1. Atualizar o método `listar` no arquivo:
src/controllers/aulaController.js

O método deve suportar múltiplos filtros recebidos via req.query:

- ?laboratorio=ID
- ?professor=ID
- ?curso=ID
- ?dataInicio=YYYY-MM-DD
- ?dataFim=YYYY-MM-DD

## 2. Regras obrigatórias:

### a) Montagem dinâmica dos filtros
Construir um objeto `filtros = {}` e adicionar campos somente se existirem no req.query.

### b) Filtro por datas
Se `dataInicio` e/ou `dataFim` forem enviados, aplicar:

### c) Populates obrigatórios
O retorno deve incluir automaticamente:
- cursoId
- disciplinaId
- professorId
- laboratorioId
- blocos

### d) Resposta
Retornar array JSON de aulas já filtradas e populadas.

## 3. Exemplos de chamadas:

- GET /api/v1/aulas?laboratorio=123
- GET /api/v1/aulas?professor=abc&dataInicio=2025-03-01&dataFim=2025-07-01
- GET /api/v1/aulas?curso=999&professor=abc
- GET /api/v1/aulas (sem filtros retorna tudo)

## 4. Entregáveis

Gerar:

1. Código completo do método `listar` com filtros e populates.
2. Documentação JSDoc explicando parâmetros aceitos em req.query.
3. Markdown final contendo explicação da lógica implementada.

