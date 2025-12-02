# Instalação do DateTimePicker

Para que os DatePickers funcionem corretamente no mobile, execute o seguinte comando na pasta do projeto mobile:

```bash
cd projeto/mobile
npm install @react-native-community/datetimepicker@^7.6.2
```

## Para Expo (Desenvolvimento)
Se estiver usando Expo, o componente já deve funcionar automaticamente após a instalação.

## Para React Native CLI (Produção)
Se for fazer build nativo, será necessário executar:

```bash
# iOS
cd ios && pod install

# Android - não requer configuração adicional
```

## Funcionalidades Implementadas

✅ **DatePicker para Data de Início**
- Botão com ícone de calendário
- Picker nativo do sistema operacional
- Formato brasileiro (DD/MM/AAAA)

✅ **DatePicker para Data de Fim**
- Botão com ícone de calendário
- Picker nativo do sistema operacional
- Formato brasileiro (DD/MM/AAAA)

✅ **Compatibilidade Multiplataforma**
- iOS: Spinner picker
- Android: Dialog picker
- Localização em português brasileiro

✅ **Validação de Dados**
- Conversão automática para ISO string no envio
- Tratamento de objetos Date no formulário
- Exibição formatada nos cards de listagem