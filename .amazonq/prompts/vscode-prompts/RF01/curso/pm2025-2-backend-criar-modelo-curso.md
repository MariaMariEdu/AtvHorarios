@projeto @backend

resposta: pt-br


**Crie um modelo Mongoose para a collection `cursos` e gere a documentação JSDoc para ele. A resposta deve estar formatada em Markdown.**

O modelo de curso deve incluir os seguintes campos e tipos:

* **`instituicaoid`**: Referência ao ID de uma instituição.
* **`nome`**: Nome do curso (String, Obrigatório).
* **`turno`**: Turno em que o curso é oferecido (String, Ex: 'Matutino', 'Noturno', 'Integral').
* **`status`**: Status do curso (Boolean/String, Ex: 'Ativo' ou `true`/`false`).

Inclua também o código JSDoc para documentar a estrutura do Schema e seus campos.