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
  Text,
  Menu,
} from 'react-native-paper';
import { blocosHorariosService } from '../../services/api';

/**
 * Tela de gerenciamento de blocos de horário
 * @component
 * @description Componente responsável pelo CRUD completo de blocos de horário no mobile
 */
const BlocosHorariosScreen = () => {
  const [blocosHorarios, setBlocosHorarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [blocoParaRemover, setBlocoParaRemover] = useState(null);
  const [turnoMenuVisible, setTurnoMenuVisible] = useState(false);
  const [diaSemanaMenuVisible, setDiaSemanaMenuVisible] = useState(false);
  
  const [formData, setFormData] = useState({
    turno: '',
    diaSemana: '',
    inicio: '',
    fim: '',
    ordem: '',
  });

  const turnoOptions = [
    { label: 'Manhã', value: 'Manhã' },
    { label: 'Tarde', value: 'Tarde' },
    { label: 'Noite', value: 'Noite' }
  ];

  const diaSemanaOptions = [
    { label: 'Segunda', value: 'Segunda' },
    { label: 'Terça', value: 'Terça' },
    { label: 'Quarta', value: 'Quarta' },
    { label: 'Quinta', value: 'Quinta' },
    { label: 'Sexta', value: 'Sexta' },
    { label: 'Sábado', value: 'Sábado' }
  ];

  /**
   * Carrega a lista de blocos de horário da API
   * @async
   * @function
   */
  const carregarBlocosHorarios = async () => {
    setLoading(true);
    try {
      const response = await blocosHorariosService.listar();
      setBlocosHorarios(response.data?.blocos || []);
    } catch (error) {
      console.error('Erro ao carregar blocos de horário:', error);
      setBlocosHorarios([]);
      mostrarSnackbar('Erro ao carregar blocos de horário');
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
   * Abre o dialog para criar ou editar bloco de horário
   * @param {Object|null} bloco - Dados do bloco para edição ou null para criação
   */
  const abrirDialog = (bloco = null) => {
    if (bloco) {
      setEditingId(bloco._id);
      setFormData({
        turno: bloco.turno || '',
        diaSemana: bloco.diaSemana || '',
        inicio: bloco.inicio || '',
        fim: bloco.fim || '',
        ordem: bloco.ordem?.toString() || '',
      });
    } else {
      setEditingId(null);
      setFormData({
        turno: '',
        diaSemana: '',
        inicio: '',
        fim: '',
        ordem: '',
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
    setTurnoMenuVisible(false);
    setDiaSemanaMenuVisible(false);
  };

  /**
   * Salva o bloco de horário (criar ou atualizar)
   * @async
   * @function
   */
  const salvarBlocoHorario = async () => {
    try {
      const dadosParaEnvio = {
        ...formData,
        ordem: parseInt(formData.ordem) || 1,
      };

      if (editingId) {
        await blocosHorariosService.atualizar(editingId, dadosParaEnvio);
        mostrarSnackbar('Bloco de horário atualizado com sucesso');
      } else {
        await blocosHorariosService.criar(dadosParaEnvio);
        mostrarSnackbar('Bloco de horário criado com sucesso');
      }
      fecharDialog();
      carregarBlocosHorarios();
    } catch (error) {
      let message = 'Erro ao salvar bloco de horário';
      
      if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      
      mostrarSnackbar(message);
    }
  };

  /**
   * Inicia o processo de remoção de bloco de horário
   * @param {string} id - ID do bloco a ser removido
   */
  const removerBlocoHorario = (id) => {
    setBlocoParaRemover(id);
    setConfirmDialogVisible(true);
  };

  /**
   * Confirma a remoção do bloco de horário
   */
  const confirmarRemocao = () => {
    if (blocoParaRemover) {
      executarRemocaoBlocoHorario(blocoParaRemover);
    }
    setConfirmDialogVisible(false);
    setBlocoParaRemover(null);
  };

  /**
   * Cancela a remoção do bloco de horário
   */
  const cancelarRemocao = () => {
    setConfirmDialogVisible(false);
    setBlocoParaRemover(null);
  };

  /**
   * Executa a remoção do bloco de horário
   * @async
   * @param {string} id - ID do bloco a ser removido
   */
  const executarRemocaoBlocoHorario = async (id) => {
    try {
      await blocosHorariosService.remover(id);
      mostrarSnackbar('Bloco de horário removido com sucesso');
      carregarBlocosHorarios();
    } catch (error) {
      let message = 'Erro ao remover bloco de horário';
      
      if (error.response?.status === 404) {
        message = 'Bloco de horário não encontrado';
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      
      mostrarSnackbar(message);
    }
  };

  /**
   * Gera nome do bloco baseado nos dados
   * @param {Object} bloco - Dados do bloco
   * @returns {string} Nome gerado
   */
  const gerarNomeBloco = (bloco) => {
    return `${bloco.turno} - ${bloco.diaSemana} - ${bloco.ordem}º`;
  };

  /**
   * Filtra blocos de horário baseado no texto de busca
   */
  const blocosHorariosFiltrados = Array.isArray(blocosHorarios) ? blocosHorarios.filter((bloco) =>
    Object.values(bloco).some((value) =>
      String(value).toLowerCase().includes(filtro.toLowerCase())
    )
  ) : [];

  useEffect(() => {
    carregarBlocosHorarios();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title="Blocos de Horário" />
      </Appbar.Header>

      <View style={{ padding: 16 }}>
        <Searchbar
          placeholder="Filtrar blocos de horário..."
          onChangeText={setFiltro}
          value={filtro}
          style={{ marginBottom: 16 }}
        />
      </View>

      <ScrollView style={{ flex: 1, padding: 16 }}>
        {loading ? (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>Carregando...</Text>
        ) : blocosHorariosFiltrados.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>Nenhum bloco de horário encontrado</Text>
        ) : (
          blocosHorariosFiltrados.map((bloco) => (
          <Card key={bloco._id} style={{ marginBottom: 12 }}>
            <Card.Content>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1 }}>
                  <Title>{gerarNomeBloco(bloco)}</Title>
                  <Paragraph>Horário: {bloco.inicio} - {bloco.fim}</Paragraph>
                  <Paragraph>Dia: {bloco.diaSemana}</Paragraph>
                  <Paragraph>Ordem: {bloco.ordem}</Paragraph>
                  {bloco.turno && (
                    <Chip
                      mode="outlined"
                      style={{ 
                        alignSelf: 'flex-start', 
                        marginTop: 8,
                        backgroundColor: bloco.turno === 'Manhã' ? '#e3f2fd' : 
                                       bloco.turno === 'Tarde' ? '#fff3e0' : '#f3e5f5'
                      }}
                    >
                      {bloco.turno}
                    </Chip>
                  )}
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <IconButton
                    icon="pencil"
                    iconColor="#1976d2"
                    size={24}
                    onPress={() => abrirDialog(bloco)}
                  />
                  <IconButton
                    icon="delete"
                    iconColor="#d32f2f"
                    size={24}
                    onPress={() => removerBlocoHorario(bloco._id)}
                  />
                </View>
              </View>
            </Card.Content>
          </Card>
        ))
        )}
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
            <Text>Tem certeza que deseja remover este bloco de horário?</Text>
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
            {editingId ? 'Editar Bloco de Horário' : 'Novo Bloco de Horário'}
          </Dialog.Title>
          <Dialog.ScrollArea>
            <ScrollView contentContainerStyle={{ paddingHorizontal: 24 }}>
              <Menu
                visible={turnoMenuVisible}
                onDismiss={() => setTurnoMenuVisible(false)}
                anchor={
                  <Button
                    mode="outlined"
                    onPress={() => setTurnoMenuVisible(true)}
                    style={{ marginBottom: 12, justifyContent: 'flex-start' }}
                    contentStyle={{ justifyContent: 'flex-start' }}
                  >
                    {formData.turno || 'Selecionar Turno *'}
                  </Button>
                }
              >
                {turnoOptions.map((option) => (
                  <Menu.Item
                    key={option.value}
                    title={option.label}
                    onPress={() => {
                      setFormData({ ...formData, turno: option.value });
                      setTurnoMenuVisible(false);
                    }}
                  />
                ))}
              </Menu>

              <Menu
                visible={diaSemanaMenuVisible}
                onDismiss={() => setDiaSemanaMenuVisible(false)}
                anchor={
                  <Button
                    mode="outlined"
                    onPress={() => setDiaSemanaMenuVisible(true)}
                    style={{ marginBottom: 12, justifyContent: 'flex-start' }}
                    contentStyle={{ justifyContent: 'flex-start' }}
                  >
                    {formData.diaSemana || 'Selecionar Dia da Semana *'}
                  </Button>
                }
              >
                {diaSemanaOptions.map((option) => (
                  <Menu.Item
                    key={option.value}
                    title={option.label}
                    onPress={() => {
                      setFormData({ ...formData, diaSemana: option.value });
                      setDiaSemanaMenuVisible(false);
                    }}
                  />
                ))}
              </Menu>

              <TextInput
                label="Horário Inicial (HH:mm) *"
                value={formData.inicio}
                onChangeText={(text) => setFormData({ ...formData, inicio: text })}
                mode="outlined"
                placeholder="08:00"
                style={{ marginBottom: 12 }}
              />
              <TextInput
                label="Horário Final (HH:mm) *"
                value={formData.fim}
                onChangeText={(text) => setFormData({ ...formData, fim: text })}
                mode="outlined"
                placeholder="09:50"
                style={{ marginBottom: 12 }}
              />
              <TextInput
                label="Ordem *"
                value={formData.ordem}
                onChangeText={(text) => setFormData({ ...formData, ordem: text })}
                mode="outlined"
                keyboardType="numeric"
                placeholder="1"
                style={{ marginBottom: 12 }}
              />
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={fecharDialog}>Cancelar</Button>
            <Button onPress={salvarBlocoHorario} mode="contained">
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

export default BlocosHorariosScreen;