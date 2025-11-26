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
  Menu,
  Divider,
} from 'react-native-paper';
import { cursosService, instituicoesService } from '../../services/api';

/**
 * Tela de gerenciamento de cursos para mobile
 * Implementa CRUD completo com interface adaptada para dispositivos móveis
 * @component
 */
const CursosScreen = () => {
  const [cursos, setCursos] = useState([]);
  const [instituicoes, setInstituicoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [ordenacao, setOrdenacao] = useState('nome');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [cursoParaRemover, setCursoParaRemover] = useState(null);
  
  const [formData, setFormData] = useState({
    nome: '',
    turno: 'Matutino',
    instituicaoid: '',
    status: true,
  });

  /**
   * Carrega a lista de cursos da API
   */
  const carregarCursos = async () => {
    setLoading(true);
    try {
      const response = await cursosService.listar();
      const data = response?.data?.cursos || response?.data || [];
      setCursos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar cursos:', error);
      mostrarSnackbar('Erro ao carregar cursos. Verifique se o backend está rodando.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Carrega a lista de instituições para o select
   */
  const carregarInstituicoes = async () => {
    try {
      const response = await instituicoesService.listar();
      setInstituicoes(response.data || []);
    } catch (error) {
      console.error('Erro ao carregar instituições:', error);
      setInstituicoes([]);
    }
  };

  /**
   * Exibe mensagem de feedback para o usuário
   * @param {string} message - Mensagem a ser exibida
   */
  const mostrarSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  /**
   * Abre o dialog para criação ou edição de curso
   * @param {Object|null} curso - Dados do curso para edição ou null para criação
   */
  const abrirDialog = async (curso = null) => {
    await carregarInstituicoes();
    
    if (curso) {
      setEditingId(curso._id);
      setFormData({
        nome: curso.nome || '',
        turno: curso.turno || 'Matutino',
        instituicaoid: curso.instituicaoid?._id || curso.instituicaoid || '',
        status: curso.status !== undefined ? curso.status : true,
      });
    } else {
      setEditingId(null);
      setFormData({
        nome: '',
        turno: 'Matutino',
        instituicaoid: '',
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
   * Salva o curso (criação ou atualização)
   */
  const salvarCurso = async () => {
    if (!formData.nome.trim()) {
      mostrarSnackbar('Nome é obrigatório');
      return;
    }
    if (!formData.instituicaoid) {
      mostrarSnackbar('Instituição é obrigatória');
      return;
    }

    try {
      if (editingId) {
        await cursosService.atualizar(editingId, formData);
        mostrarSnackbar('Curso atualizado com sucesso');
      } else {
        await cursosService.criar(formData);
        mostrarSnackbar('Curso criado com sucesso');
      }
      fecharDialog();
      carregarCursos();
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao salvar curso';
      mostrarSnackbar(message);
    }
  };

  /**
   * Remove um curso após confirmação
   * @param {string} id - ID do curso a ser removido
   */
  const removerCurso = (id) => {
    console.log('Tentando remover curso com ID:', id);
    setCursoParaRemover(id);
    setConfirmDialogVisible(true);
  };

  /**
   * Confirma a remoção do curso
   */
  const confirmarRemocao = () => {
    if (cursoParaRemover) {
      console.log('Confirmou remoção do curso:', cursoParaRemover);
      executarRemocaoCurso(cursoParaRemover);
    }
    setConfirmDialogVisible(false);
    setCursoParaRemover(null);
  };

  /**
   * Cancela a remoção do curso
   */
  const cancelarRemocao = () => {
    console.log('Cancelou remoção');
    setConfirmDialogVisible(false);
    setCursoParaRemover(null);
  };

  /**
   * Executa a remoção do curso
   * @param {string} id - ID do curso a ser removido
   */
  const executarRemocaoCurso = async (id) => {
    try {
      console.log('Executando remoção do curso:', id);
      await cursosService.remover(id);
      console.log('Curso removido com sucesso');
      mostrarSnackbar('Curso removido com sucesso');
      carregarCursos();
    } catch (error) {
      console.error('Erro ao remover curso:', error);
      const message = error.response?.data?.message || 'Erro ao remover curso';
      mostrarSnackbar(message);
    }
  };

  /**
   * Ordena os cursos conforme critério selecionado
   * @param {Array} cursos - Lista de cursos
   * @returns {Array} Lista ordenada
   */
  const ordenarCursos = (cursos) => {
    return [...cursos].sort((a, b) => {
      switch (ordenacao) {
        case 'nome':
          return (a.nome || '').localeCompare(b.nome || '');
        case 'turno':
          return (a.turno || '').localeCompare(b.turno || '');
        case 'instituicao':
          return (a.instituicaoid?.nome || '').localeCompare(b.instituicaoid?.nome || '');
        case 'status':
          return b.status - a.status;
        default:
          return 0;
      }
    });
  };

  /**
   * Filtra e ordena os cursos
   */
  const cursosFiltradosEOrdenados = ordenarCursos(
    cursos.filter((curso) =>
      Object.values(curso || {}).some((value) => {
        if (typeof value === 'object' && value?.nome) {
          return value.nome.toLowerCase().includes(filtro.toLowerCase());
        }
        return String(value || '').toLowerCase().includes(filtro.toLowerCase());
      })
    )
  );

  /**
   * Obtém o nome da instituição
   * @param {Object} curso - Objeto do curso
   * @returns {string} Nome da instituição
   */
  const obterNomeInstituicao = (curso) => {
    return curso.instituicaoid?.nome || 'Instituição não informada';
  };

  useEffect(() => {
    carregarCursos();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title="Cursos" />
        <Appbar.Action
          icon="sort"
          onPress={() => setMenuVisible(true)}
        />
      </Appbar.Header>

      <View style={{ padding: 16 }}>
        <Searchbar
          placeholder="Filtrar cursos..."
          onChangeText={setFiltro}
          value={filtro}
          style={{ marginBottom: 16 }}
        />
      </View>

      <ScrollView style={{ flex: 1, padding: 16 }}>
        {cursosFiltradosEOrdenados.length === 0 ? (
          <Card style={{ marginBottom: 12 }}>
            <Card.Content>
              <Text style={{ textAlign: 'center', color: '#666' }}>
                {cursos.length === 0 ? 'Nenhum curso encontrado' : 'Nenhum curso corresponde ao filtro'}
              </Text>
            </Card.Content>
          </Card>
        ) : (
          cursosFiltradosEOrdenados.map((curso) => (
            <Card key={curso._id} style={{ marginBottom: 12 }}>
              <Card.Content>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <View style={{ flex: 1 }}>
                    <Title>{curso.nome}</Title>
                    <Paragraph>Instituição: {obterNomeInstituicao(curso)}</Paragraph>
                    <Paragraph>Turno: {curso.turno}</Paragraph>
                    <Chip
                      mode="outlined"
                      style={{ 
                        alignSelf: 'flex-start', 
                        marginTop: 8,
                        backgroundColor: curso.status ? '#e8f5e8' : '#ffeaea'
                      }}
                    >
                      {curso.status ? 'Ativo' : 'Inativo'}
                    </Chip>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <IconButton
                      icon="pencil"
                      iconColor="#1976d2"
                      size={24}
                      onPress={() => abrirDialog(curso)}
                    />
                    <IconButton
                      icon="delete"
                      iconColor="#d32f2f"
                      size={24}
                      onPress={() => removerCurso(curso._id)}
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

      {/* Menu de ordenação */}
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={{ x: 0, y: 0 }}
        contentStyle={{ marginTop: 50, marginRight: 16 }}
      >
        <Menu.Item
          onPress={() => {
            setOrdenacao('nome');
            setMenuVisible(false);
          }}
          title="Ordenar por Nome"
          leadingIcon={ordenacao === 'nome' ? 'check' : undefined}
        />
        <Menu.Item
          onPress={() => {
            setOrdenacao('turno');
            setMenuVisible(false);
          }}
          title="Ordenar por Turno"
          leadingIcon={ordenacao === 'turno' ? 'check' : undefined}
        />
        <Menu.Item
          onPress={() => {
            setOrdenacao('instituicao');
            setMenuVisible(false);
          }}
          title="Ordenar por Instituição"
          leadingIcon={ordenacao === 'instituicao' ? 'check' : undefined}
        />
        <Menu.Item
          onPress={() => {
            setOrdenacao('status');
            setMenuVisible(false);
          }}
          title="Ordenar por Status"
          leadingIcon={ordenacao === 'status' ? 'check' : undefined}
        />
      </Menu>

      <Portal>
        <Dialog visible={confirmDialogVisible} onDismiss={cancelarRemocao}>
          <Dialog.Title>Confirmar Remoção</Dialog.Title>
          <Dialog.Content>
            <Text>Tem certeza que deseja remover este curso?</Text>
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
            {editingId ? 'Editar Curso' : 'Novo Curso'}
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
              
              <View style={{ marginBottom: 12 }}>
                <Text style={{ marginBottom: 8, fontSize: 16, fontWeight: 'bold' }}>
                  Instituição *
                </Text>
                {instituicoes.map((instituicao) => (
                  <Button
                    key={instituicao._id}
                    mode={formData.instituicaoid === instituicao._id ? 'contained' : 'outlined'}
                    onPress={() => setFormData({ ...formData, instituicaoid: instituicao._id })}
                    style={{ marginBottom: 8 }}
                  >
                    {instituicao.nome}
                  </Button>
                ))}
              </View>

              <View style={{ marginBottom: 12 }}>
                <Text style={{ marginBottom: 8, fontSize: 16, fontWeight: 'bold' }}>
                  Turno *
                </Text>
                {['Matutino', 'Vespertino', 'Noturno', 'Integral'].map((turno) => (
                  <Button
                    key={turno}
                    mode={formData.turno === turno ? 'contained' : 'outlined'}
                    onPress={() => setFormData({ ...formData, turno })}
                    style={{ marginBottom: 8 }}
                  >
                    {turno}
                  </Button>
                ))}
              </View>

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
            <Button onPress={salvarCurso} mode="contained">
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

export default CursosScreen;