import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
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
import { professoresService } from '../../services/api';

/**
 * Tela de gerenciamento de professores
 * @component
 * @description Componente responsável pelo CRUD completo de professores no mobile
 */
const ProfessoresScreen = () => {
  const [professores, setProfessores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [professorParaRemover, setProfessorParaRemover] = useState(null);
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    especialidade: '',
    ativo: true,
  });

  /**
   * Carrega a lista de professores da API
   * @async
   * @function
   */
  const carregarProfessores = async () => {
    setLoading(true);
    try {
      const response = await professoresService.listar();
      setProfessores(response.data);
    } catch (error) {
      console.error('Erro ao carregar:', error);
      mostrarSnackbar('Erro ao carregar professores');
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
   * Abre o dialog para criar ou editar professor
   * @param {Object|null} professor - Dados do professor para edição ou null para criação
   */
  const abrirDialog = (professor = null) => {
    if (professor) {
      setEditingId(professor._id);
      setFormData({
        nome: professor.nome || '',
        email: professor.email || '',
        telefone: professor.telefone || '',
        especialidade: professor.especialidade || '',
        ativo: professor.ativo !== undefined ? professor.ativo : true,
      });
    } else {
      setEditingId(null);
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        especialidade: '',
        ativo: true,
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
   * Salva o professor (criar ou atualizar)
   * @async
   * @function
   */
  const salvarProfessor = async () => {
    try {
      if (editingId) {
        await professoresService.atualizar(editingId, formData);
        mostrarSnackbar('Professor atualizado com sucesso');
      } else {
        await professoresService.criar(formData);
        mostrarSnackbar('Professor criado com sucesso');
      }
      fecharDialog();
      carregarProfessores();
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao salvar professor';
      mostrarSnackbar(message);
    }
  };

  /**
   * Inicia o processo de remoção de professor
   * @param {string} id - ID do professor a ser removido
   */
  const removerProfessor = (id) => {
    setProfessorParaRemover(id);
    setConfirmDialogVisible(true);
  };

  /**
   * Confirma a remoção do professor
   */
  const confirmarRemocao = () => {
    if (professorParaRemover) {
      executarRemocaoProfessor(professorParaRemover);
    }
    setConfirmDialogVisible(false);
    setProfessorParaRemover(null);
  };

  /**
   * Cancela a remoção do professor
   */
  const cancelarRemocao = () => {
    setConfirmDialogVisible(false);
    setProfessorParaRemover(null);
  };

  /**
   * Executa a remoção do professor
   * @async
   * @param {string} id - ID do professor a ser removido
   */
  const executarRemocaoProfessor = async (id) => {
    try {
      await professoresService.remover(id);
      mostrarSnackbar('Professor removido com sucesso');
      carregarProfessores();
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao remover professor';
      mostrarSnackbar(message);
    }
  };

  /**
   * Filtra professores baseado no texto de busca
   */
  const professoresFiltrados = professores.filter((professor) =>
    Object.values(professor).some((value) =>
      String(value).toLowerCase().includes(filtro.toLowerCase())
    )
  );

  useEffect(() => {
    carregarProfessores();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title="Professores" />
      </Appbar.Header>

      <View style={{ padding: 16 }}>
        <Searchbar
          placeholder="Filtrar professores..."
          onChangeText={setFiltro}
          value={filtro}
          style={{ marginBottom: 16 }}
        />
      </View>

      <ScrollView style={{ flex: 1, padding: 16 }}>
        {professoresFiltrados.map((professor) => (
          <Card key={professor._id} style={{ marginBottom: 12 }}>
            <Card.Content>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1 }}>
                  <Title>{professor.nome}</Title>
                  <Paragraph>Email: {professor.email}</Paragraph>
                  {professor.telefone && <Paragraph>Telefone: {professor.telefone}</Paragraph>}
                  {professor.especialidade && <Paragraph>Especialidade: {professor.especialidade}</Paragraph>}
                  <Chip
                    mode="outlined"
                    style={{ 
                      alignSelf: 'flex-start', 
                      marginTop: 8,
                      backgroundColor: professor.ativo ? '#e8f5e8' : '#ffeaea'
                    }}
                  >
                    {professor.ativo ? 'Ativo' : 'Inativo'}
                  </Chip>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <IconButton
                    icon="pencil"
                    iconColor="#1976d2"
                    size={24}
                    onPress={() => abrirDialog(professor)}
                  />
                  <IconButton
                    icon="delete"
                    iconColor="#d32f2f"
                    size={24}
                    onPress={() => removerProfessor(professor._id)}
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
            <Text>Tem certeza que deseja remover este professor?</Text>
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
            {editingId ? 'Editar Professor' : 'Novo Professor'}
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
                label="Email *"
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                mode="outlined"
                keyboardType="email-address"
                style={{ marginBottom: 12 }}
              />
              <TextInput
                label="Telefone"
                value={formData.telefone}
                onChangeText={(text) => setFormData({ ...formData, telefone: text })}
                mode="outlined"
                keyboardType="phone-pad"
                style={{ marginBottom: 12 }}
              />
              <TextInput
                label="Especialidade"
                value={formData.especialidade}
                onChangeText={(text) => setFormData({ ...formData, especialidade: text })}
                mode="outlined"
                style={{ marginBottom: 12 }}
              />
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <Text>Ativo: </Text>
                <Switch
                  value={formData.ativo}
                  onValueChange={(value) => setFormData({ ...formData, ativo: value })}
                />
              </View>
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={fecharDialog}>Cancelar</Button>
            <Button onPress={salvarProfessor} mode="contained">
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

export default ProfessoresScreen;