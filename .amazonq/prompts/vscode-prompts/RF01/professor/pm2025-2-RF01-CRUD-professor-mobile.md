@projeto @mobile

respostas: pt-br

1.) Implementação Mobile (Professores):

    a) CRUD Professores (Recursos):
        a.1) Desenvolver a funcionalidade CRUD completa para a entidade **Professores**.
        a.2) **Adaptação Mobile da UI:** Utilizar o padrão de interface de listas (FlatList) ou cartões (Cards) para a exibição dos professores, ideal para dispositivos móveis.
        a.3) **Interação:** O detalhe e o formulário de edição/inserção de um professor devem ser acessíveis via navegação para uma nova tela, simulando o comportamento de um modal da web.
        a.4) As funcionalidades de busca (Filter/Search) e ordenação (Sorting) devem ser intuitivas e funcionais para telas menores.

    b) Integração:
        b.1) Integrar o componente de Professores com o endpoint **professores**.

2.) Critérios de Aceite (Backend & Localização):

    * **Endpoints:** Utilizar a URL base `/api/v1/professores`.
    * **GET:** A chamada GET `/api/v1/professores` deve retornar um array JSON de professores (vazio se não houver registros).
    * **POST (Conflito):** A tentativa de POST com o **email** repetido deve retornar status 409 (Conflict) e uma mensagem clara em pt-BR.
    * **PUT/DELETE (Não Encontrado):** Operações PUT/DELETE com IDs inexistentes devem retornar status 404 (Not Found).
    * **Localização:** Todas as respostas do backend e mensagens de erro exibidas no mobile devem estar em pt-BR.

3.) Documentação:
    * Gerar documentação e comentários JSDoc para todos os componentes mobile relacionados a Professores.
