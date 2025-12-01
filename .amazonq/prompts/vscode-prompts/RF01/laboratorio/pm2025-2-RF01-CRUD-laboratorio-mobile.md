@projeto @mobile

respostas: pt-br

1.) Implementação Mobile (Laboratórios):

    a) CRUD Laboratórios (Recursos):
        a.1) Desenvolver a funcionalidade CRUD completa para a entidade **Laboratórios**.
        a.2) **Adaptação Mobile da UI:** Utilizar o padrão de interface baseado em listas (FlatList) ou cartões (Cards) para exibição dos laboratórios, ideal para dispositivos móveis.
        a.3) **Interação:** A visualização detalhada e o formulário de edição/criação de um laboratório devem ser acessíveis via navegação para uma nova tela, substituindo o modal utilizado na versão web.
        a.4) As funcionalidades de busca (Filter/Search) e ordenação (Sorting) devem ser otimizadas para telas pequenas, com controles intuitivos (ex.: barra de busca, botões de ordenação).

    b) Integração:
        b.1) Integrar o componente de Laboratórios com o endpoint **laboratorios**.

2.) Critérios de Aceite (Backend & Localização):

    * **Endpoints:** Utilizar a URL base `/api/v1/laboratorios`.
    * **GET:** A chamada GET `/api/v1/laboratorios` deve retornar um array JSON de laboratórios (vazio se não houver registros).
    * **POST (Conflito):** A tentativa de POST com o **nome** repetido deve retornar status **409 (Conflict)** e uma mensagem clara em pt-BR.
    * **PUT/DELETE (Não Encontrado):** As operações PUT/DELETE com IDs inexistentes devem retornar status **404 (Not Found)**.
    * **Localização:** Todas as mensagens de erro retornadas pelo backend e exibidas no mobile devem estar em pt-BR.

3.) Documentação:
    * Gerar documentação e comentários JSDoc para todos os componentes mobile relacionados a **Laboratórios**.

