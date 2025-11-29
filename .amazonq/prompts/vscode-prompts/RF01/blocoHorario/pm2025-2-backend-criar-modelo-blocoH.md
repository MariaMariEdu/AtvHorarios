@projeto @backend

resposta: pt-br

Crie um modelo Mongoose para a collection `blocosHorario` e gere a documentação JSDoc para ele.
A resposta deve estar formatada em Markdown.

O modelo de bloco de horário deve incluir os seguintes campos e tipos:

* `turno`: Turno do bloco (String, Obrigatório. Ex: 'Manhã', 'Tarde', 'Noite').
* `diaSemana`: Dia da semana (String, Obrigatório. Ex: 'Segunda', 'Terça', 'Quarta', ...).
* `inicio`: Horário inicial do bloco (String, Obrigatório. Formato 'HH:MM').
* `fim`: Horário final do bloco (String, Obrigatório. Formato 'HH:MM').
* `ordem`: Número que representa a ordem do bloco dentro do turno (Number, Obrigatório).

Inclua também o código JSDoc para documentar a estrutura do Schema e seus campos.
