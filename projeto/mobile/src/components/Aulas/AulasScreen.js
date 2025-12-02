import React, { useState, useEffect } from 'react';
import { View, ScrollView, Platform } from 'react-native';
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
import { 
  aulasService, 
  cursosService, 
  disciplinasService, 
  professoresService, 
  laboratoriosService, 
  blocosHorariosService 
} from '../../services/api';

/**
 * Tela de gerenciamento de aulas
 * @component
 * @description Componente responsável pelo CRUD completo de aulas no mobile
 */
const AulasScreen = () => {
  const [aulas, setAulas] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [laboratorios, setLaboratorios] = useState([]);
  const [blocosHorarios, setBlocosHorarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [aulaParaRemover, setAulaParaRemover] = useState(null);
  
  // Estados dos menus
  const [cursoMenuVisible, setCursoMenuVisible] = useState(false);
  const [disciplinaMenuVisible, setDisciplinaMenuVisible] = useState(false);
  const [professorMenuVisible, setProfessorMenuVisible] = useState(false);
  const [laboratorioMenuVisible, setLaboratorioMenuVisible] = useState(false);
  const [diaSemanaMenuVisible, setDiaSemanaMenuVisible] = useState(false);
  const [blocosMenuVisible, setBlocosMenuVisible] = useState(false);
  

  
  const [formData, setFormData] = useState({
    semestre: '',
    cursoId: '',
    disciplinaId: '',
    professorId: '',
    laboratorioId: '',
    diaSemana: '',
    blocos: [],
    dataInicio: '',
    dataFim: '',
  });

  const diasSemanaOptions = [
    { label: 'Segunda-feira', value: 'Segunda-feira' },
    { label: 'Terça-feira', value: 'Terça-feira' },
    { label: 'Quarta-feira', value: 'Quarta-feira' },
    { label: 'Quinta-feira', value: 'Quinta-feira' },
    { label: 'Sexta-feira', value: 'Sexta-feira' },
    { label: 'Sábado', value: 'Sábado' },
  ];

  /**
   * Carrega dados iniciais necessários
   * @async
   * @function
   */
  const carregarDadosIniciais = async () => {
    try {
      const [cursosRes, disciplinasRes, professoresRes, laboratoriosRes, blocosRes] = await Promise.all([
        cursosService.listar(),
        disciplinasService.listar(),
        professoresService.listar(),
        laboratoriosService.listar(),
        blocosHorariosService.listar(),
      ]);

      setCursos(Array.isArray(cursosRes.data) ? cursosRes.data : cursosRes.data?.cursos || []);
      setDisciplinas(Array.isArray(disciplinasRes.data) ? disciplinasRes.data : disciplinasRes.data?.disciplinas || []);
      setProfessores(Array.isArray(professoresRes.data) ? professoresRes.data : professoresRes.data?.professores || []);
      setLaboratorios(Array.isArray(laboratoriosRes.data) ? laboratoriosRes.data : laboratoriosRes.data?.laboratorios || []);
      setBlocosHorarios(Array.isArray(blocosRes.data) ? blocosRes.data : blocosRes.data?.blocos || []);
    } catch (error) {
      console.error('Erro ao carregar dados iniciais:', error);
      mostrarSnackbar('Erro ao carregar dados iniciais');
    }
  };

  /**
   * Carrega a lista de aulas da API
   * @async
   * @function
   */
  const carregarAulas = async () => {
    setLoading(true);
    try {
      const response = await aulasService.listar();
      // Trata diferentes estruturas de resposta
      const aulasData = Array.isArray(response.data) ? response.data : 
                       response.data?.aulas || 
                       response.data?.data || 
                       [];
      setAulas(aulasData);
    } catch (error) {
      console.error('Erro ao carregar aulas:', error);
      setAulas([]);
      mostrarSnackbar('Erro ao carregar aulas');
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
   * Abre o dialog para criar ou editar aula
   * @param {Object|null} aula - Dados da aula para edição ou null para criação
   */
  const abrirDialog = (aula = null) => {
    if (aula) {
      setEditingId(aula._id);
      setFormData({
        semestre: aula.semestre || '',
        cursoId: aula.cursoId?._id || aula.cursoId || '',
        disciplinaId: aula.disciplinaId?._id || aula.disciplinaId || '',
        professorId: aula.professorId?._id || aula.professorId || '',
        laboratorioId: aula.laboratorioId?._id || aula.laboratorioId || '',
        diaSemana: aula.diaSemana || '',
        blocos: aula.blocos?.map(b => b._id || b) || [],
        dataInicio: aula.dataInicio ? new Date(aula.dataInicio).toISOString().split('T')[0] : '',
        dataFim: aula.dataFim ? new Date(aula.dataFim).toISOString().split('T')[0] : '',
      });
    } else {
      setEditingId(null);
      setFormData({
        semestre: '',
        cursoId: '',
        disciplinaId: '',
        professorId: '',
        laboratorioId: '',
        diaSemana: '',
        blocos: [],
        dataInicio: '',
        dataFim: '',
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
    setDisciplinaMenuVisible(false);
    setProfessorMenuVisible(false);
    setLaboratorioMenuVisible(false);
    setDiaSemanaMenuVisible(false);
    setBlocosMenuVisible(false);

  };

  /**
   * Salva a aula (criar ou atualizar)
   * @async
   * @function
   */
  const salvarAula = async () => {
    try {
      const dadosParaEnvio = {
        ...formData,
        dataInicio: formData.dataInicio ? new Date(formData.dataInicio + 'T00:00:00').toISOString() : null,
        dataFim: formData.dataFim ? new Date(formData.dataFim + 'T00:00:00').toISOString() : null,
      };

      if (editingId) {
        await aulasService.atualizar(editingId, dadosParaEnvio);
        mostrarSnackbar('Aula atualizada com sucesso');
      } else {
        await aulasService.criar(dadosParaEnvio);
        mostrarSnackbar('Aula criada com sucesso');
      }
      fecharDialog();
      carregarAulas();
    } catch (error) {
      let message = 'Erro ao salvar aula';
      
      if (error.response?.status === 409) {
        message = error.response.data?.message || 'Conflito de horário detectado';
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      
      mostrarSnackbar(message);
    }
  };

  /**
   * Inicia o processo de remoção de aula
   * @param {string} id - ID da aula a ser removida
   */
  const removerAula = (id) => {
    setAulaParaRemover(id);
    setConfirmDialogVisible(true);
  };

  /**
   * Confirma a remoção da aula
   */
  const confirmarRemocao = () => {
    if (aulaParaRemover) {
      executarRemocaoAula(aulaParaRemover);
    }
    setConfirmDialogVisible(false);
    setAulaParaRemover(null);
  };

  /**
   * Cancela a remoção da aula
   */
  const cancelarRemocao = () => {
    setConfirmDialogVisible(false);
    setAulaParaRemover(null);
  };

  /**
   * Executa a remoção da aula
   * @async
   * @param {string} id - ID da aula a ser removida
   */
  const executarRemocaoAula = async (id) => {
    try {
      await aulasService.remover(id);
      mostrarSnackbar('Aula removida com sucesso');
      carregarAulas();
    } catch (error) {
      let message = 'Erro ao remover aula';
      
      if (error.response?.status === 404) {
        message = 'Aula não encontrada';
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      
      mostrarSnackbar(message);
    }
  };

  /**
   * Obtém o nome do curso pelo ID
   * @param {string} cursoId - ID do curso
   * @returns {string} Nome do curso
   */
  const obterNomeCurso = (cursoId) => {
    const curso = cursos.find(c => c._id === cursoId);
    return curso?.nome || 'Curso não encontrado';
  };

  /**
   * Obtém o nome da disciplina pelo ID
   * @param {string} disciplinaId - ID da disciplina
   * @returns {string} Nome da disciplina
   */
  const obterNomeDisciplina = (disciplinaId) => {
    const disciplina = disciplinas.find(d => d._id === disciplinaId);
    return disciplina?.nome || 'Disciplina não encontrada';
  };

  /**
   * Obtém o nome do professor pelo ID
   * @param {string} professorId - ID do professor
   * @returns {string} Nome do professor
   */
  const obterNomeProfessor = (professorId) => {
    const professor = professores.find(p => p._id === professorId);
    return professor?.nome || 'Professor não encontrado';
  };

  /**
   * Obtém o nome do laboratório pelo ID
   * @param {string} laboratorioId - ID do laboratório
   * @returns {string} Nome do laboratório
   */
  const obterNomeLaboratorio = (laboratorioId) => {
    const laboratorio = laboratorios.find(l => l._id === laboratorioId);
    return laboratorio?.nome || 'Laboratório não encontrado';
  };

  /**
   * Obtém os horários dos blocos selecionados
   * @param {Array} blocosIds - IDs dos blocos
   * @returns {string} Horários formatados
   */
  const obterHorariosBlocos = (blocosIds) => {
    if (!Array.isArray(blocosIds) || blocosIds.length === 0) return 'Sem horários';
    
    const blocosSelecionados = blocosHorarios.filter(b => 
      blocosIds.some(id => (typeof id === 'string' ? id : id._id) === b._id)
    );
    
    if (blocosSelecionados.length === 0) return 'Horários não encontrados';
    
    return blocosSelecionados
      .map(b => `${b.inicio}-${b.fim}`)
      .join(', ');
  };

  /**
   * Alterna seleção de bloco de horário
   * @param {string} blocoId - ID do bloco
   */
  const alternarBlocoHorario = (blocoId) => {
    const novosBlocos = formData.blocos.includes(blocoId)
      ? formData.blocos.filter(id => id !== blocoId)
      : [...formData.blocos, blocoId];
    
    setFormData({ ...formData, blocos: novosBlocos });
  };



  /**
   * Filtra aulas baseado no texto de busca
   */
  const aulasFiltradas = Array.isArray(aulas) ? aulas.filter((aula) => {
    const searchText = filtro.toLowerCase();
    return (
      aula.semestre?.toLowerCase().includes(searchText) ||
      aula.diaSemana?.toLowerCase().includes(searchText) ||
      obterNomeCurso(aula.cursoId?._id || aula.cursoId).toLowerCase().includes(searchText) ||
      obterNomeDisciplina(aula.disciplinaId?._id || aula.disciplinaId).toLowerCase().includes(searchText) ||
      obterNomeProfessor(aula.professorId?._id || aula.professorId).toLowerCase().includes(searchText)
    );
  }) : [];

  useEffect(() => {
    carregarDadosIniciais();
    carregarAulas();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title="Aulas" />
      </Appbar.Header>

      <View style={{ padding: 16 }}>
        <Searchbar
          placeholder="Filtrar aulas..."
          onChangeText={setFiltro}
          value={filtro}
          style={{ marginBottom: 16 }}
        />
      </View>

      <ScrollView style={{ flex: 1, padding: 16 }}>
        {loading ? (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>Carregando...</Text>
        ) : aulasFiltradas.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>Nenhuma aula encontrada</Text>
        ) : (
          aulasFiltradas.map((aula) => (
            <Card key={aula._id} style={{ marginBottom: 12 }}>
              <Card.Content>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <View style={{ flex: 1 }}>
                    <Title>{aula.semestre} - {obterNomeDisciplina(aula.disciplinaId?._id || aula.disciplinaId)}</Title>
                    <Paragraph>Curso: {obterNomeCurso(aula.cursoId?._id || aula.cursoId)}</Paragraph>
                    <Paragraph>Professor: {obterNomeProfessor(aula.professorId?._id || aula.professorId)}</Paragraph>
                    <Paragraph>Laboratório: {obterNomeLaboratorio(aula.laboratorioId?._id || aula.laboratorioId)}</Paragraph>
                    <Paragraph>Horários: {obterHorariosBlocos(aula.blocos)}</Paragraph>
                    <Paragraph>Período: {aula.dataInicio ? new Date(aula.dataInicio).toLocaleDateString('pt-BR') : 'N/A'} - {aula.dataFim ? new Date(aula.dataFim).toLocaleDateString('pt-BR') : 'N/A'}</Paragraph>
                    <Chip
                      mode="outlined"
                      style={{ 
                        alignSelf: 'flex-start', 
                        marginTop: 8,
                        backgroundColor: '#e3f2fd'
                      }}
                    >
                      {aula.diaSemana}
                    </Chip>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <IconButton
                      icon="pencil"
                      iconColor="#1976d2"
                      size={24}
                      onPress={() => abrirDialog(aula)}
                    />
                    <IconButton
                      icon="delete"
                      iconColor="#d32f2f"
                      size={24}
                      onPress={() => removerAula(aula._id)}
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
            <Text>Tem certeza que deseja remover esta aula?</Text>
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
            {editingId ? 'Editar Aula' : 'Nova Aula'}
          </Dialog.Title>
          <Dialog.ScrollArea>
            <ScrollView contentContainerStyle={{ paddingHorizontal: 24 }}>
              <TextInput
                label="Semestre *"
                value={formData.semestre}
                onChangeText={(text) => setFormData({ ...formData, semestre: text })}
                mode="outlined"
                placeholder="2024/1"
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
                    {formData.cursoId ? obterNomeCurso(formData.cursoId) : 'Selecionar Curso *'}
                  </Button>
                }
              >
                {cursos.map((curso) => (
                  <Menu.Item
                    key={curso._id}
                    title={curso.nome}
                    onPress={() => {
                      setFormData({ ...formData, cursoId: curso._id });
                      setCursoMenuVisible(false);
                    }}
                  />
                ))}
              </Menu>

              <Menu
                visible={disciplinaMenuVisible}
                onDismiss={() => setDisciplinaMenuVisible(false)}
                anchor={
                  <Button
                    mode="outlined"
                    onPress={() => setDisciplinaMenuVisible(true)}
                    style={{ marginBottom: 12, justifyContent: 'flex-start' }}
                    contentStyle={{ justifyContent: 'flex-start' }}
                  >
                    {formData.disciplinaId ? obterNomeDisciplina(formData.disciplinaId) : 'Selecionar Disciplina *'}
                  </Button>
                }
              >
                {disciplinas.map((disciplina) => (
                  <Menu.Item
                    key={disciplina._id}
                    title={disciplina.nome}
                    onPress={() => {
                      setFormData({ ...formData, disciplinaId: disciplina._id });
                      setDisciplinaMenuVisible(false);
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
                    {formData.professorId ? obterNomeProfessor(formData.professorId) : 'Selecionar Professor *'}
                  </Button>
                }
              >
                {professores.map((professor) => (
                  <Menu.Item
                    key={professor._id}
                    title={professor.nome}
                    onPress={() => {
                      setFormData({ ...formData, professorId: professor._id });
                      setProfessorMenuVisible(false);
                    }}
                  />
                ))}
              </Menu>

              <Menu
                visible={laboratorioMenuVisible}
                onDismiss={() => setLaboratorioMenuVisible(false)}
                anchor={
                  <Button
                    mode="outlined"
                    onPress={() => setLaboratorioMenuVisible(true)}
                    style={{ marginBottom: 12, justifyContent: 'flex-start' }}
                    contentStyle={{ justifyContent: 'flex-start' }}
                  >
                    {formData.laboratorioId ? obterNomeLaboratorio(formData.laboratorioId) : 'Selecionar Laboratório *'}
                  </Button>
                }
              >
                {laboratorios.map((laboratorio) => (
                  <Menu.Item
                    key={laboratorio._id}
                    title={laboratorio.nome}
                    onPress={() => {
                      setFormData({ ...formData, laboratorioId: laboratorio._id });
                      setLaboratorioMenuVisible(false);
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
                {diasSemanaOptions.map((option) => (
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

              <Text style={{ marginBottom: 8, fontSize: 16, fontWeight: 'bold' }}>
                Blocos de Horário * ({formData.blocos.length} selecionados)
              </Text>
              <ScrollView style={{ maxHeight: 150, marginBottom: 12 }}>
                {blocosHorarios.map((bloco) => (
                  <View key={bloco._id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                    <Button
                      mode={formData.blocos.includes(bloco._id) ? 'contained' : 'outlined'}
                      onPress={() => alternarBlocoHorario(bloco._id)}
                      style={{ flex: 1 }}
                      contentStyle={{ justifyContent: 'flex-start' }}
                    >
                      {bloco.nome || `${bloco.turno} - ${bloco.inicio}-${bloco.fim}`}
                    </Button>
                  </View>
                ))}
              </ScrollView>

              <TextInput
                label="Data de Início *"
                value={formData.dataInicio || ''}
                onChangeText={(text) => setFormData({ ...formData, dataInicio: text })}
                mode="outlined"
                placeholder="AAAA-MM-DD"
                style={{ marginBottom: 12 }}
              />
              <TextInput
                label="Data de Fim *"
                value={formData.dataFim || ''}
                onChangeText={(text) => setFormData({ ...formData, dataFim: text })}
                mode="outlined"
                placeholder="AAAA-MM-DD"
                style={{ marginBottom: 12 }}
              />
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={fecharDialog}>Cancelar</Button>
            <Button onPress={salvarAula} mode="contained">
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

export default AulasScreen;