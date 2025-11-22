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
import { instituicoesService } from '../../services/api';

const InstituicoesScreen = () => {
  const [instituicoes, setInstituicoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [instituicaoParaRemover, setInstituicaoParaRemover] = useState(null);
  
  const [formData, setFormData] = useState({
    nome: '',
    cnpj: '',
    email: '',
    telefone: '',
    endereco: '',
    ativo: true,
  });

  const carregarInstituicoes = async () => {
    setLoading(true);
    try {
      const response = await instituicoesService.listar();
      setInstituicoes(response.data);
    } catch (error) {
      console.error('Erro ao carregar:', error);
      mostrarSnackbar('Erro ao carregar instituições');
    } finally {
      setLoading(false);
    }
  };

  const mostrarSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const abrirDialog = (instituicao = null) => {
    if (instituicao) {
      setEditingId(instituicao._id);
      setFormData({
        nome: instituicao.nome || '',
        cnpj: instituicao.cnpj || '',
        email: instituicao.email || '',
        telefone: instituicao.telefone || '',
        endereco: instituicao.endereco || '',
        ativo: instituicao.ativo !== undefined ? instituicao.ativo : true,
      });
    } else {
      setEditingId(null);
      setFormData({
        nome: '',
        cnpj: '',
        email: '',
        telefone: '',
        endereco: '',
        ativo: true,
      });
    }
    setDialogVisible(true);
  };

  const fecharDialog = () => {
    setDialogVisible(false);
    setEditingId(null);
  };

  const salvarInstituicao = async () => {
    try {
      if (editingId) {
        await instituicoesService.atualizar(editingId, formData);
        mostrarSnackbar('Instituição atualizada com sucesso');
      } else {
        await instituicoesService.criar(formData);
        mostrarSnackbar('Instituição criada com sucesso');
      }
      fecharDialog();
      carregarInstituicoes();
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao salvar instituição';
      mostrarSnackbar(message);
    }
  };

  const removerInstituicao = (id) => {
    console.log('Tentando remover instituição com ID:', id);
    setInstituicaoParaRemover(id);
    setConfirmDialogVisible(true);
  };

  const confirmarRemocao = () => {
    if (instituicaoParaRemover) {
      console.log('Confirmou remoção da instituição:', instituicaoParaRemover);
      executarRemocaoInstituicao(instituicaoParaRemover);
    }
    setConfirmDialogVisible(false);
    setInstituicaoParaRemover(null);
  };

  const cancelarRemocao = () => {
    console.log('Cancelou remoção');
    setConfirmDialogVisible(false);
    setInstituicaoParaRemover(null);
  };

  const executarRemocaoInstituicao = async (id) => {
    try {
      console.log('Executando remoção da instituição:', id);
      await instituicoesService.remover(id);
      console.log('Instituição removida com sucesso');
      mostrarSnackbar('Instituição removida com sucesso');
      carregarInstituicoes();
    } catch (error) {
      console.error('Erro ao remover instituição:', error);
      const message = error.response?.data?.message || 'Erro ao remover instituição';
      mostrarSnackbar(message);
    }
  };

  const instituicoesFiltradas = instituicoes.filter((instituicao) =>
    Object.values(instituicao).some((value) =>
      String(value).toLowerCase().includes(filtro.toLowerCase())
    )
  );

  useEffect(() => {
    carregarInstituicoes();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title="Instituições" />
      </Appbar.Header>

      <View style={{ padding: 16 }}>
        <Searchbar
          placeholder="Filtrar instituições..."
          onChangeText={setFiltro}
          value={filtro}
          style={{ marginBottom: 16 }}
        />
      </View>

      <ScrollView style={{ flex: 1, padding: 16 }}>
        {instituicoesFiltradas.map((instituicao) => (
          <Card key={instituicao._id} style={{ marginBottom: 12 }}>
            <Card.Content>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1 }}>
                  <Title>{instituicao.nome}</Title>
                  <Paragraph>CNPJ: {instituicao.cnpj}</Paragraph>
                  <Paragraph>Email: {instituicao.email}</Paragraph>
                  <Chip
                    mode="outlined"
                    style={{ 
                      alignSelf: 'flex-start', 
                      marginTop: 8,
                      backgroundColor: instituicao.ativo ? '#e8f5e8' : '#ffeaea'
                    }}
                  >
                    {instituicao.ativo ? 'Ativo' : 'Inativo'}
                  </Chip>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <IconButton
                    icon="pencil"
                    iconColor="#1976d2"
                    size={24}
                    onPress={() => abrirDialog(instituicao)}
                  />
                  <IconButton
                    icon="delete"
                    iconColor="#d32f2f"
                    size={24}
                    onPress={() => removerInstituicao(instituicao._id)}
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
            <Text>Tem certeza que deseja remover esta instituição?</Text>
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
            {editingId ? 'Editar Instituição' : 'Nova Instituição'}
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
                label="CNPJ *"
                value={formData.cnpj}
                onChangeText={(text) => setFormData({ ...formData, cnpj: text })}
                mode="outlined"
                style={{ marginBottom: 12 }}
              />
              <TextInput
                label="Email"
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
                label="Endereço"
                value={formData.endereco}
                onChangeText={(text) => setFormData({ ...formData, endereco: text })}
                mode="outlined"
                multiline
                numberOfLines={3}
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
            <Button onPress={salvarInstituicao} mode="contained">
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

export default InstituicoesScreen;