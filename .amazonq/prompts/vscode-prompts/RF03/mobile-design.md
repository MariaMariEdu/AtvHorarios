@projeto @mobile
respostas: pt-br

Quero que você ajuste **exclusivamente a responsividade** da tela de **Consultas** do meu app mobile, sem alterar a estrutura atual dos componentes, nomes de arquivos, lógica, hooks, ou chamadas de API.

A estrutura atual deve ser mantida.  
O que pode ser alterado: apenas estilos, classes, propriedades de layout e wrappers NÃO destrutivos.

===============================
OBJETIVO
===============================
A tela de Consultas deve ficar 100% responsiva no mobile, corrigindo problemas como:
- cartões desalinhados
- grade estourando horizontalmente
- scroll horizontal e vertical funcionando corretamente
- células da tabela com tamanhos inconsistentes
- cards sobrepostos
- espaços vazios exagerados abaixo da grade
- header da tabela não alinhado com as colunas
- grade mantendo proporções mesmo com muitos ou poucos blocos

===============================
ESTILO DESEJADO (IMPORTANTE)
===============================
Manter o **estilo visual atual**, mas garantir:
- grid fluida
- cards centralizados dentro do dia/coluna
- largura das colunas proporcional e adaptável
- altura das linhas consistente com os blocos
- bordas, fontes e cores preservadas
- nenhum conteúdo deve "vazar" da tela
- responsividade funcionando nas seguintes resoluções:
  • 360px  
  • 390px  
  • 414px  
  • 430px  

===============================
EXEMPLOS DO QUE PRECISA FUNCIONAR
===============================
- A grade deve caber na tela e permitir scroll horizontal sem quebrar.
- A coluna de horários (primeira coluna) deve permanecer fixa visualmente.
- As demais colunas devem ter largura adaptável, mas visualmente equilibrada.
- Os cards da aula devem ficar **centralizados na célula**, não colados no topo.
- A célula não pode "explodir" o tamanho quando há uma aula longa.
- Cards não podem ultrapassar células.

===============================
REGRAS IMPORTANTES
===============================
1. **NÃO MODIFICAR A ESTRUTURA ATUAL DO GRID**  
   Não mover componentes, não criar novos containers, não reestruturar JSX.

2. **NÃO ALTERAR A ESTRUTURA DE ESTADOS OU LÓGICA**  
   Toda lógica interna precisa permanecer igual.

3. **PODE ajustar:**
   - estilos CSS/Styled-components/Tailwind
   - flexbox
   - grid-template
   - overflow
   - spacing, padding, margins
   - widths/heights relativas
   - breakpoints

4. **PODE adicionar wrappers responsivos**, desde que não alterem a hierarquia dos elementos.

5. **NÃO pode reescrever tudo do zero**  
   É apenas um ajuste de responsividade.

===============================
ENTREGA ESPERADA
===============================
Quero que você me entregue:
- o(s) trecho(s) de código atualizado(s)
- explicação clara do que foi ajustado
- estilos corrigidos
- classes necessárias para responsividade
- garantindo que a tela final fique igual ao layout da versão desktop, porém fluida e funcional no mobile

===============================
IMPORTANTE (FINAL)
===============================
A visualização precisa ficar semelhante ao quadro de horários tradicional, mas 100% funcional no mobile, sem quebrar nada e sem alterar estrutura.

Faça as correções necessárias para alcançar esse resultado.
