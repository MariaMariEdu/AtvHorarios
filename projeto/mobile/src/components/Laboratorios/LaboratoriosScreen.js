import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import {
  Appbar,
  FAB,
  Searchbar,
  Card,
  Title,
  Paragraph,
  Chip,
  IconButton,
  Snackbar,
  Portal,
  Dialog,
  Button,
  TextInput,
  Switch,
  Text,
} from 'react-native-paper';
import { laboratoriosService } from '../../services/api';

/**
 * Componente de tela para gerenciamento de laboratórios
 * Implementa CRUD completo com interface otimizada para mobile
 * @component
 * @returns {JSX.Element} Tela de laboratórios
 */
const LaboratoriosScreen = () => {
  const [laboratorios, setLaboratorios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [laboratorioParaRemover, setLaboratorioParaRemover] = useState(null);
  
  const [formData, setFormData] = useState({
    nome: '',
    codigo: '',
    descricao: '',
    capacidade: '',
    localizacao: '',
    equipamentos: [],
    status: true,
  });

  /**
   * Carrega a lista de laboratórios do backend
   * @async
   * @function
   */
  const carregarLaboratorios = async () => {
    setLoading(true);
    try {
      const response = await laboratoriosService.listar();
      setLaboratorios(response.data);
    } catch (error) {
      console.error('Erro ao carregar laboratórios:', error);
      mostrarSnackbar('Erro ao carregar laboratórios');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Exibe mensagem no snackbar
   * @param {string} message - Mensagem a ser exibida
   */
  const mostrarSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  /**
   * Abre o dialog para criação ou edição de laboratório
   * @param {Object|null} laboratorio - Laboratório para edição ou null para criação
   */
  const abrirDialog = (laboratorio = null) => {
    if (laboratorio) {
      setEditingId(laboratorio._id);
      setFormData({
        nome: laboratorio.nome || '',
        codigo: laboratorio.codigo || '',
        descricao: laboratorio.descricao || '',
        capacidade: laboratorio.capacidade ? laboratorio.capacidade.toString() : '',
        localizacao: laboratorio.localizacao || '',
        equipamentos: laboratorio.equipamentos || [],
        status: laboratorio.status !== undefined ? laboratorio.status : true,
      });
    } else {
      setEditingId(null);
      setFormData({
        nome: '',
        codigo: '',
        descricao: '',
        capacidade: '',
        localizacao: '',
        equipamentos: [],
        status: true,
      });
    }
    setDialogVisible(true);
  };

  /**
   * Fecha o dialog de criação/edição
   */
  const fecharDialog = () => {
    setDialogVisible(false);
    setEditingId(null);
  };

  /**
   * Salva o laboratório (criação ou atualização)
   * @async
   * @function
   */
  const salvarLaboratorio = async () => {
    try {
      const dadosParaSalvar = {
        ...formData,
        capacidade: parseInt(formData.capacidade) || 0,
      };

      if (editingId) {
        await laboratoriosService.atualizar(editingId, dadosParaSalvar);
        mostrarSnackbar('Laboratório atualizado com sucesso');
      } else {
        await laboratoriosService.criar(dadosParaSalvar);
        mostrarSnackbar('Laboratório criado com sucesso');
      }
      fecharDialog();
      carregarLaboratorios();
    } catch (error) {
      console.error('Erro ao salvar laboratório:', error);
      let message = 'Erro ao salvar laboratório';
      
      if (error.response?.status === 409) {
        message = 'Código do laboratório já existe';
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      
      mostrarSnackbar(message);
    }
  };

  /**
   * Inicia o processo de remoção de laboratório
   * @param {string} id - ID do laboratório a ser removido
   */
  const removerLaboratorio = (id) => {
    setLaboratorioParaRemover(id);
    setConfirmDialogVisible(true);
  };

  /**
   * Confirma a remoção do laboratório
   */
  const confirmarRemocao = () => {
    if (laboratorioParaRemover) {
      executarRemocaoLaboratorio(laboratorioParaRemover);
    }
    setConfirmDialogVisible(false);
    setLaboratorioParaRemover(null);
  };

  /**
   * Cancela a remoção do laboratório
   */
  const cancelarRemocao = () => {
    setConfirmDialogVisible(false);
    setLaboratorioParaRemover(null);
  };

  /**
   * Executa a remoção do laboratório
   * @async
   * @param {string} id - ID do laboratório a ser removido
   */
  const executarRemocaoLaboratorio = async (id) => {
    try {
      await laboratoriosService.remover(id);
      mostrarSnackbar('Laboratório removido com sucesso');
      carregarLaboratorios();
    } catch (error) {
      console.error('Erro ao remover laboratório:', error);
      let message = 'Erro ao remover laboratório';
      
      if (error.response?.status === 404) {
        message = 'Laboratório não encontrado';
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      
      mostrarSnackbar(message);
    }
  };

  /**
   * Filtra laboratórios baseado no texto de busca
   */
  const laboratoriosFiltrados = laboratorios.filter((laboratorio) =>
    Object.values(laboratorio).some((value) =>
      String(value).toLowerCase().includes(filtro.toLowerCase())
    )
  );

  useEffect(() => {
    carregarLaboratorios();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title="Laboratórios" />
      </Appbar.Header>

      <View style={{ padding: 16 }}>
        <Searchbar
          placeholder="Filtrar laboratórios..."
          onChangeText={setFiltro}
          value={filtro}
          style={{ marginBottom: 16 }}
        />
      </View>

      <ScrollView style={{ flex: 1, padding: 16 }}>
        {laboratoriosFiltrados.map((laboratorio) => (
          <Card key={laboratorio._id} style={{ marginBottom: 12 }}>
            <Card.Content>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1 }}>
                  <Title>{laboratorio.nome}</Title>
                  <Paragraph>Código: {laboratorio.codigo}</Paragraph>
                  <Paragraph>Capacidade: {laboratorio.capacidade} pessoas</Paragraph>
                  <Paragraph>Localização: {laboratorio.localizacao}</Paragraph>
                  {laboratorio.descricao && (
                    <Paragraph>Descrição: {laboratorio.descricao}</Paragraph>
                  )}
                  <Chip
                    mode="outlined"
                    style={{ 
                      alignSelf: 'flex-start', 
                      marginTop: 8,
                      backgroundColor: laboratorio.status ? '#e8f5e8' : '#ffeaea'
                    }}
                  >
                    {laboratorio.status ? 'Ativo' : 'Inativo'}
                  </Chip>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <IconButton
                    icon="pencil"
                    iconColor="#1976d2"
                    size={24}
                    onPress={() => abrirDialog(laboratorio)}
                  />
                  <IconButton
                    icon="delete"
                    iconColor="#d32f2f"
                    size={24}
                    onPress={() => removerLaboratorio(laboratorio._id)}
                  />
                </View>
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      <FAB
        icon="plus"
        style={{
          position: 'absolute',
          margin: 16,
          right: 0,
          bottom: 0,
        }}
        onPress={() => abrirDialog()}
      />

      <Portal>
        <Dialog visible={confirmDialogVisible} onDismiss={cancelarRemocao}>
          <Dialog.Title>Confirmar Remoção</Dialog.Title>
          <Dialog.Content>
            <Text>Tem certeza que deseja remover este laboratório?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={cancelarRemocao}>Cancelar</Button>
            <Button onPress={confirmarRemocao} mode="contained" buttonColor="#d32f2f">
              Remover
            </Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={dialogVisible} onDismiss={fecharDialog}>
          <Dialog.Title>
            {editingId ? 'Editar Laboratório' : 'Novo Laboratório'}
          </Dialog.Title>
          <Dialog.ScrollArea>
            <ScrollView contentContainerStyle={{ paddingHorizontal: 24 }}>
              <TextInput
                label="Nome *"
                value={formData.nome}
                onChangeText={(text) => setFormData({ ...formData, nome: text })}
                mode="outlined"
                style={{ marginBottom: 12 }}
              />
              <TextInput
                label="Código *"
                value={formData.codigo}
                onChangeText={(text) => setFormData({ ...formData, codigo: text.toUpperCase() })}
                mode="outlined"
                style={{ marginBottom: 12 }}
                autoCapitalize="characters"
              />
              <TextInput
                label="Capacidade *"
                value={formData.capacidade}
                onChangeText={(text) => setFormData({ ...formData, capacidade: text })}
                mode="outlined"
                keyboardType="numeric"
                style={{ marginBottom: 12 }}
              />
              <TextInput
                label="Localização *"
                value={formData.localizacao}
                onChangeText={(text) => setFormData({ ...formData, localizacao: text })}
                mode="outlined"
                style={{ marginBottom: 12 }}
              />
              <TextInput
                label="Descrição"
                value={formData.descricao}
                onChangeText={(text) => setFormData({ ...formData, descricao: text })}
                mode="outlined"
                multiline
                numberOfLines={3}
                style={{ marginBottom: 12 }}
              />
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <Text>Ativo: </Text>
                <Switch
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                />
              </View>
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={fecharDialog}>Cancelar</Button>
            <Button onPress={salvarLaboratorio} mode="contained">
              {editingId ? 'Atualizar' : 'Criar'}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={4000}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

export default LaboratoriosScreen;