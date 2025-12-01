@projeto @backend

resposta: pt-br

Crie um modelo Mongoose para a collection `disciplinas` e gere a documentação JSDoc para ele. A resposta deve estar formatada em Markdown.

O modelo de disciplina deve incluir os seguintes campos e tipos:

* **`curso`**: ID do curso ao qual a disciplina pertence (ObjectId, Referência, Obrigatório).
* **`nome`**: Nome da disciplina (String, Obrigatório).
* **`cargaHoraria`**: Carga horária total da disciplina (Number, Obrigatório).
* **`professorResponsavel`**: ID do professor responsável (ObjectId, Referência, Opcional).
* **`status`**: Status da disciplina (String ou Boolean, Ex: 'Ativa', 'Inativa', true/false).

Inclua também o código JSDoc para documentar a estrutura do Schema e seus campos.
