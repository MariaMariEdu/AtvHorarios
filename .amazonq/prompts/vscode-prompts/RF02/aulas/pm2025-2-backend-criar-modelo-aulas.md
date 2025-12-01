@projeto @backend

resposta: pt-br

Crie um modelo Mongoose para a collection `aulas` e gere a documentação JSDoc para ele.
A resposta deve estar formatada em Markdown.

O modelo de aulas deve incluir os seguintes campos e tipos:

* `semestre`: Semestre letivo da aula (String, Obrigatório. Ex: '2025/1').
* `cursoId`: Referência para o curso (ObjectId, Obrigatório).
* `disciplinaId`: Referência para a disciplina (ObjectId, Obrigatório).
* `professorId`: Referência para o professor (ObjectId, Obrigatório).
* `laboratorioId`: Referência para o laboratório (ObjectId, Obrigatório).
* `diaSemana`: Dia da semana da aula (String, Obrigatório. Ex: 'Segunda', 'Terça', ...).
* `blocos`: Lista de blocos de horário utilizados pela aula (Array<ObjectId>, Obrigatório).
* `dataInicio`: Data inicial de vigência da aula (Date, Obrigatório).
* `dataFim`: Data final de vigência da aula (Date, Obrigatório).


Inclua o código JSDoc para documentar todos os campos do Schema.
