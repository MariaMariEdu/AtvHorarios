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
  Divider,
} from 'react-native-paper';
import { disciplinasService, cursosService, professoresService } from '../../services/api';

/**
 * Tela de gerenciamento de disciplinas
 * @component
 * @description Componente responsável pelo CRUD completo de disciplinas no mobile
 */
const DisciplinasScreen = () => {
  const [disciplinas, setDisciplinas] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [disciplinaParaRemover, setDisciplinaParaRemover] = useState(null);
  const [cursoMenuVisible, setCursoMenuVisible] = useState(false);
  const [professorMenuVisible, setProfessorMenuVisible] = useState(false);
  const [statusMenuVisible, setStatusMenuVisible] = useState(false);
  
  const [formData, setFormData] = useState({
    nome: '',
    codigo: '',
    cargaHoraria: '',
    curso: '',
    professorResponsavel: '',
    status: true,
  });

  const statusOptions = [
    { label: 'Ativa', value: true },
    { label: 'Inativa', value: false }
  ];

  /**
   * Carrega a lista de disciplinas da API
   * @async
   * @function
   */
  const carregarDisciplinas = async () => {
    setLoading(true);
    try {
      const response = await disciplinasService.listar();
      setDisciplinas(response.data || []);
    } catch (error) {
      console.error('Erro ao carregar disciplinas:', error);
      setDisciplinas([]);
      mostrarSnackbar('Erro ao conectar com servidor');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Carrega a lista de cursos da API
   * @async
   * @function
   */
  const carregarCursos = async () => {
    try {
      const response = await cursosService.listar();
      setCursos(response.data.cursos || response.data || []);
    } catch (error) {
      console.error('Erro ao carregar cursos:', error);
      setCursos([]);
    }
  };

  /**
   * Carrega a lista de professores da API
   * @async
   * @function
   */
  const carregarProfessores = async () => {
    try {
      const response = await professoresService.listar();
      setProfessores(response.data || []);
    } catch (error) {
      console.error('Erro ao carregar professores:', error);
      setProfessores([]);
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
   * Abre o dialog para criar ou editar disciplina
   * @param {Object|null} disciplina - Dados da disciplina para edição ou null para criação
   */
  const abrirDialog = (disciplina = null) => {
    if (disciplina) {
      setEditingId(disciplina._id);
      setFormData({
        nome: disciplina.nome || '',
        codigo: disciplina.codigo || '',
        cargaHoraria: disciplina.cargaHoraria?.toString() || '',
        curso: disciplina.curso || '',
        professorResponsavel: disciplina.professorResponsavel || '',
        status: disciplina.status !== undefined ? disciplina.status : true,
      });
    } else {
      setEditingId(null);
      setFormData({
        nome: '',
        codigo: '',
        cargaHoraria: '',
        curso: '',
        professorResponsavel: '',
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
    setCursoMenuVisible(false);
    setProfessorMenuVisible(false);
    setStatusMenuVisible(false);
  };

  /**
   * Salva a disciplina (criar ou atualizar)
   * @async
   * @function
   */
  const salvarDisciplina = async () => {
    try {
      const dadosParaEnvio = {
        ...formData,
        cargaHoraria: parseInt(formData.cargaHoraria) || 0,
      };

      if (editingId) {
        await disciplinasService.atualizar(editingId, dadosParaEnvio);
        mostrarSnackbar('Disciplina atualizada com sucesso');
      } else {
        await disciplinasService.criar(dadosParaEnvio);
        mostrarSnackbar('Disciplina criada com sucesso');
      }
      fecharDialog();
      carregarDisciplinas();
    } catch (error) {
      let message = 'Erro ao salvar disciplina';
      
      if (error.response?.status === 409) {
        message = 'Código da disciplina já existe. Por favor, use um código diferente.';
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      
      mostrarSnackbar(message);
    }
  };

  /**
   * Inicia o processo de remoção de disciplina
   * @param {string} id - ID da disciplina a ser removida
   */
  const removerDisciplina = (id) => {
    setDisciplinaParaRemover(id);
    setConfirmDialogVisible(true);
  };

  /**
   * Confirma a remoção da disciplina
   */
  const confirmarRemocao = () => {
    if (disciplinaParaRemover) {
      executarRemocaoDisciplina(disciplinaParaRemover);
    }
    setConfirmDialogVisible(false);
    setDisciplinaParaRemover(null);
  };

  /**
   * Cancela a remoção da disciplina
   */
  const cancelarRemocao = () => {
    setConfirmDialogVisible(false);
    setDisciplinaParaRemover(null);
  };

  /**
   * Executa a remoção da disciplina
   * @async
   * @param {string} id - ID da disciplina a ser removida
   */
  const executarRemocaoDisciplina = async (id) => {
    try {
      await disciplinasService.remover(id);
      mostrarSnackbar('Disciplina removida com sucesso');
      carregarDisciplinas();
    } catch (error) {
      let message = 'Erro ao remover disciplina';
      
      if (error.response?.status === 404) {
        message = 'Disciplina não encontrada';
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      
      mostrarSnackbar(message);
    }
  };

  /**
   * Obtém o nome do curso pelo ID
   * @param {string} cursoId - ID do curso
   * @returns {string} Nome do curso ou ID se não encontrado
   */
  const obterNomeCurso = (cursoId) => {
    if (!cursoId) return 'Sem curso';
    if (typeof cursoId === 'object') return cursoId.nome || 'Sem curso';
    const curso = cursos.find(c => c._id === cursoId);
    return curso ? curso.nome : 'Sem curso';
  };

  /**
   * Obtém o nome do professor pelo ID
   * @param {string} professorId - ID do professor
   * @returns {string} Nome do professor ou ID se não encontrado
   */
  const obterNomeProfessor = (professorId) => {
    if (!professorId) return 'Sem professor';
    if (typeof professorId === 'object') return professorId.nome || 'Sem professor';
    const professor = professores.find(p => p._id === professorId);
    return professor ? professor.nome : 'Sem professor';
  };

  /**
   * Filtra disciplinas baseado no texto de busca
   */
  const disciplinasFiltradas = Array.isArray(disciplinas) ? disciplinas.filter((disciplina) =>
    Object.values(disciplina).some((value) =>
      String(value).toLowerCase().includes(filtro.toLowerCase())
    )
  ) : [];

  useEffect(() => {
    carregarDisciplinas();
    carregarCursos();
    carregarProfessores();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title="Disciplinas" />
      </Appbar.Header>

      <View style={{ padding: 16 }}>
        <Searchbar
          placeholder="Filtrar disciplinas..."
          onChangeText={setFiltro}
          value={filtro}
          style={{ marginBottom: 16 }}
        />
      </View>

      <ScrollView style={{ flex: 1, padding: 16 }}>
        {loading ? (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>Carregando...</Text>
        ) : disciplinasFiltradas.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>Nenhuma disciplina encontrada</Text>
        ) : (
          disciplinasFiltradas.map((disciplina) => (
          <Card key={disciplina._id} style={{ marginBottom: 12 }}>
            <Card.Content>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1 }}>
                  <Title>{disciplina.nome}</Title>
                  <Paragraph>Código: {disciplina.codigo}</Paragraph>
                  <Paragraph>Carga Horária: {disciplina.cargaHoraria}h</Paragraph>
                  {disciplina.curso && (
                    <Paragraph>Curso: {obterNomeCurso(disciplina.curso)}</Paragraph>
                  )}
                  {disciplina.professorResponsavel && (
                    <Paragraph>Professor: {obterNomeProfessor(disciplina.professorResponsavel)}</Paragraph>
                  )}
                  <Chip
                    mode="outlined"
                    style={{ 
                      alignSelf: 'flex-start', 
                      marginTop: 8,
                      backgroundColor: disciplina.status ? '#e8f5e8' : '#ffeaea'
                    }}
                  >
                    {disciplina.status ? 'Ativa' : 'Inativa'}
                  </Chip>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <IconButton
                    icon="pencil"
                    iconColor="#1976d2"
                    size={24}
                    onPress={() => abrirDialog(disciplina)}
                  />
                  <IconButton
                    icon="delete"
                    iconColor="#d32f2f"
                    size={24}
                    onPress={() => removerDisciplina(disciplina._id)}
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
            <Text>Tem certeza que deseja remover esta disciplina?</Text>
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
            {editingId ? 'Editar Disciplina' : 'Nova Disciplina'}
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
                onChangeText={(text) => setFormData({ ...formData, codigo: text })}
                mode="outlined"
                style={{ marginBottom: 12 }}
              />
              <TextInput
                label="Carga Horária *"
                value={formData.cargaHoraria}
                onChangeText={(text) => setFormData({ ...formData, cargaHoraria: text })}
                mode="outlined"
                keyboardType="numeric"
                style={{ marginBottom: 12 }}
              />
              
              <Menu
                visible={cursoMenuVisible}
                onDismiss={() => setCursoMenuVisible(false)}
                anchor={
                  <Button
                    mode="outlined"
                    onPress={() => setCursoMenuVisible(true)}
                    style={{ marginBottom: 12, justifyContent: 'flex-start' }}
                    contentStyle={{ justifyContent: 'flex-start' }}
                  >
                    {formData.curso ? obterNomeCurso(formData.curso) : 'Selecionar Curso'}
                  </Button>
                }
              >
                <Menu.Item
                  title="Nenhum curso"
                  onPress={() => {
                    setFormData({ ...formData, curso: '' });
                    setCursoMenuVisible(false);
                  }}
                />
                <Divider />
                {Array.isArray(cursos) && cursos.map((curso) => (
                  <Menu.Item
                    key={curso._id}
                    title={curso.nome}
                    onPress={() => {
                      setFormData({ ...formData, curso: curso._id });
                      setCursoMenuVisible(false);
                    }}
                  />
                ))}
              </Menu>

              <Menu
                visible={professorMenuVisible}
                onDismiss={() => setProfessorMenuVisible(false)}
                anchor={
                  <Button
                    mode="outlined"
                    onPress={() => setProfessorMenuVisible(true)}
                    style={{ marginBottom: 12, justifyContent: 'flex-start' }}
                    contentStyle={{ justifyContent: 'flex-start' }}
                  >
                    {formData.professorResponsavel ? obterNomeProfessor(formData.professorResponsavel) : 'Selecionar Professor'}
                  </Button>
                }
              >
                <Menu.Item
                  title="Nenhum professor"
                  onPress={() => {
                    setFormData({ ...formData, professorResponsavel: '' });
                    setProfessorMenuVisible(false);
                  }}
                />
                <Divider />
                {Array.isArray(professores) && professores.map((professor) => (
                  <Menu.Item
                    key={professor._id}
                    title={professor.nome}
                    onPress={() => {
                      setFormData({ ...formData, professorResponsavel: professor._id });
                      setProfessorMenuVisible(false);
                    }}
                  />
                ))}
              </Menu>

              <Menu
                visible={statusMenuVisible}
                onDismiss={() => setStatusMenuVisible(false)}
                anchor={
                  <Button
                    mode="outlined"
                    onPress={() => setStatusMenuVisible(true)}
                    style={{ marginBottom: 12, justifyContent: 'flex-start' }}
                    contentStyle={{ justifyContent: 'flex-start' }}
                  >
                    Status: {formData.status ? 'Ativa' : 'Inativa'}
                  </Button>
                }
              >
                {statusOptions.map((option) => (
                  <Menu.Item
                    key={option.label}
                    title={option.label}
                    onPress={() => {
                      setFormData({ ...formData, status: option.value });
                      setStatusMenuVisible(false);
                    }}
                  />
                ))}
              </Menu>
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={fecharDialog}>Cancelar</Button>
            <Button onPress={salvarDisciplina} mode="contained">
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

export default DisciplinasScreen;