# Blocos de Horário - Mobile

## Descrição
Módulo mobile para gerenciamento de blocos de horário do sistema de laboratórios.

## Funcionalidades Implementadas

### CRUD Completo
- ✅ **Criar** novo bloco de horário
- ✅ **Listar** blocos de horário com filtros
- ✅ **Editar** bloco de horário existente
- ✅ **Remover** bloco de horário com confirmação

### Interface Mobile
- ✅ **Cards responsivos** para exibição dos blocos
- ✅ **Formulário modal** para criação/edição
- ✅ **Busca em tempo real** por qualquer campo
- ✅ **Navegação por abas** integrada ao app
- ✅ **Feedback visual** com Snackbar
- ✅ **Confirmação de exclusão** com dialog nativo

### Campos do Bloco de Horário
- **Nome**: Identificação do bloco (obrigatório, único)
- **Horário Inicial**: Hora de início no formato HH:mm
- **Horário Final**: Hora de término no formato HH:mm
- **Turno**: Matutino, Vespertino ou Noturno
- **Duração**: Duração em minutos (calculada automaticamente)

### Validações e Tratamento de Erros
- ✅ **Conflito 409**: Nome duplicado com mensagem em pt-BR
- ✅ **Not Found 404**: Bloco não encontrado em operações PUT/DELETE
- ✅ **Validação de campos**: Campos obrigatórios e formatos
- ✅ **Tratamento de conexão**: Mensagens de erro de rede

### Integração com API
- **Endpoint**: `/api/v1/blocos-horarios`
- **Métodos**: GET, POST, PUT, DELETE
- **Filtros**: Busca por nome, horário, turno
- **Paginação**: Suporte a parâmetros page e limit

## Componentes

### BlocosHorariosScreen
Componente principal que implementa:
- Lista de blocos em cards
- Formulário de criação/edição
- Busca e filtros
- Confirmação de exclusão
- Integração com API

### Serviços
- `blocosHorariosService`: Integração com endpoints da API
- Métodos: listar, criar, atualizar, remover

## Navegação
- **Aba**: "Blocos Horário"
- **Ícone**: clock-outline (MaterialCommunityIcons)
- **Posição**: Última aba do navegador inferior

## Tecnologias Utilizadas
- React Native
- React Native Paper (Material Design)
- Axios (requisições HTTP)
- React Navigation (navegação)

## Localização
- Todas as mensagens em português do Brasil (pt-BR)
- Interface adaptada para usuários brasileiros
- Formatos de horário no padrão brasileiro (HH:mm)

## Responsividade
- Interface otimizada para dispositivos móveis
- Cards que se adaptam ao tamanho da tela
- Formulários com scroll para telas menores
- Botões e ícones com tamanho adequado para touch