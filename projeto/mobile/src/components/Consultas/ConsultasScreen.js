import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import {
  Appbar,
  Card,
  Snackbar,
  Button,
  Menu,
  Text,
} from 'react-native-paper';
import { 
  aulasService, 
  cursosService, 
  disciplinasService, 
  professoresService, 
  laboratoriosService, 
  blocosHorariosService 
} from '../../services/api';

const DIAS_SEMANA = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
const CORES_DISCIPLINAS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];

/**
 * Tela de consultas de horários
 * @component
 * @description Exibe grade visual de horários por laboratório, curso, disciplina ou professor
 */
const ConsultasScreen = () => {
  const [aulas, setAulas] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [laboratorios, setLaboratorios] = useState([]);
  const [blocosHorarios, setBlocosHorarios] = useState([]);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  const [filtros, setFiltros] = useState({
    cursoId: '',
    disciplinaId: '',
    professorId: '',
    laboratorioId: '',
  });

  const [menusVisiveis, setMenusVisiveis] = useState({
    curso: false,
    disciplina: false,
    professor: false,
    laboratorio: false,
  });

  /**
   * Carrega dados iniciais
   * @async
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
      mostrarSnackbar('Erro ao carregar dados iniciais');
    }
  };

  /**
   * Carrega aulas com filtros aplicados
   * @async
   */
  const carregarAulas = async () => {
    try {
      const params = {};
      if (filtros.cursoId) params.cursoId = filtros.cursoId;
      if (filtros.disciplinaId) params.disciplinaId = filtros.disciplinaId;
      if (filtros.professorId) params.professorId = filtros.professorId;
      if (filtros.laboratorioId) params.laboratorioId = filtros.laboratorioId;

      const response = await aulasService.listar(params);
      const aulasData = Array.isArray(response.data) ? response.data : response.data?.aulas || [];
      setAulas(aulasData);
    } catch (error) {
      mostrarSnackbar('Erro ao carregar aulas');
      setAulas([]);
    }
  };

  /**
   * Exibe mensagem no snackbar
   * @param {string} message
   */
  const mostrarSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  /**
   * Obtém cor para disciplina
   * @param {string} disciplinaId
   * @returns {string} Cor hexadecimal
   */
  const obterCorDisciplina = (disciplinaId) => {
    const index = disciplinas.findIndex(d => d._id === disciplinaId);
    return CORES_DISCIPLINAS[index % CORES_DISCIPLINAS.length];
  };

  /**
   * Normaliza dados da aula para exibição
   * @param {Object} aula
   * @returns {Object} Dados normalizados
   */
  const normalizarAula = (aula) => {
    const curso = cursos.find(c => c._id === (aula.cursoId?._id || aula.cursoId));
    const disciplina = disciplinas.find(d => d._id === (aula.disciplinaId?._id || aula.disciplinaId));
    const professor = professores.find(p => p._id === (aula.professorId?._id || aula.professorId));
    const laboratorio = laboratorios.find(l => l._id === (aula.laboratorioId?._id || aula.laboratorioId));

    return {
      ...aula,
      cursoNome: curso?.nome || 'N/A',
      disciplinaNome: disciplina?.nome || 'N/A',
      professorNome: professor?.nome || 'N/A',
      laboratorioNome: laboratorio?.nome || 'N/A',
      cor: obterCorDisciplina(aula.disciplinaId?._id || aula.disciplinaId),
    };
  };

  /**
   * Organiza aulas em grade por dia e horário
   * @returns {Object} Grade organizada
   */
  const organizarGrade = () => {
    const grade = {};
    
    DIAS_SEMANA.forEach(dia => {
      grade[dia] = {};
      blocosHorarios.forEach(bloco => {
        grade[dia][bloco._id] = null;
      });
    });

    aulas.forEach(aula => {
      const aulaNormalizada = normalizarAula(aula);
      const dia = aula.diaSemana;
      
      if (grade[dia]) {
        const blocosIds = Array.isArray(aula.blocos) ? aula.blocos.map(b => b._id || b) : [];
        blocosIds.forEach(blocoId => {
          if (grade[dia][blocoId] !== undefined) {
            grade[dia][blocoId] = aulaNormalizada;
          }
        });
      }
    });

    return grade;
  };

  /**
   * Obtém horário formatado do bloco
   * @param {string} blocoId
   * @returns {string} Horário formatado
   */
  const obterHorarioBloco = (blocoId) => {
    const bloco = blocosHorarios.find(b => b._id === blocoId);
    return bloco ? `${bloco.inicio}-${bloco.fim}` : '';
  };

  /**
   * Limpa todos os filtros
   */
  const limparFiltros = () => {
    setFiltros({
      cursoId: '',
      disciplinaId: '',
      professorId: '',
      laboratorioId: '',
    });
  };

  /**
   * Alterna visibilidade de menu
   * @param {string} menu
   */
  const toggleMenu = (menu) => {
    setMenusVisiveis(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  useEffect(() => {
    carregarDadosIniciais();
  }, []);

  useEffect(() => {
    if (cursos.length > 0) {
      carregarAulas();
    }
  }, [filtros, cursos]);

  const grade = organizarGrade();
  const blocosOrdenados = [...blocosHorarios].sort((a, b) => a.inicio.localeCompare(b.inicio));

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Consultas de Horários" />
      </Appbar.Header>

      <View style={styles.filtrosContainer}>
        <Text style={styles.filtrosTitle}>Filtros</Text>
        
        <Menu
          visible={menusVisiveis.laboratorio}
          onDismiss={() => toggleMenu('laboratorio')}
          anchor={
            <Button
              mode="outlined"
              onPress={() => toggleMenu('laboratorio')}
              style={styles.filtroButton}
              textColor="#000"
            >
              {filtros.laboratorioId 
                ? laboratorios.find(l => l._id === filtros.laboratorioId)?.nome 
                : 'Laboratório'}
            </Button>
          }
        >
          <Menu.Item title="Todos" onPress={() => { setFiltros({...filtros, laboratorioId: ''}); toggleMenu('laboratorio'); }} />
          {laboratorios.map(lab => (
            <Menu.Item
              key={lab._id}
              title={lab.nome}
              onPress={() => { setFiltros({...filtros, laboratorioId: lab._id}); toggleMenu('laboratorio'); }}
            />
          ))}
        </Menu>

        <Menu
          visible={menusVisiveis.curso}
          onDismiss={() => toggleMenu('curso')}
          anchor={
            <Button
              mode="outlined"
              onPress={() => toggleMenu('curso')}
              style={styles.filtroButton}
              textColor="#000"
            >
              {filtros.cursoId 
                ? cursos.find(c => c._id === filtros.cursoId)?.nome 
                : 'Curso'}
            </Button>
          }
        >
          <Menu.Item title="Todos" onPress={() => { setFiltros({...filtros, cursoId: ''}); toggleMenu('curso'); }} />
          {cursos.map(curso => (
            <Menu.Item
              key={curso._id}
              title={curso.nome}
              onPress={() => { setFiltros({...filtros, cursoId: curso._id}); toggleMenu('curso'); }}
            />
          ))}
        </Menu>

        <Menu
          visible={menusVisiveis.disciplina}
          onDismiss={() => toggleMenu('disciplina')}
          anchor={
            <Button
              mode="outlined"
              onPress={() => toggleMenu('disciplina')}
              style={styles.filtroButton}
              textColor="#000"
            >
              {filtros.disciplinaId 
                ? disciplinas.find(d => d._id === filtros.disciplinaId)?.nome 
                : 'Disciplina'}
            </Button>
          }
        >
          <Menu.Item title="Todas" onPress={() => { setFiltros({...filtros, disciplinaId: ''}); toggleMenu('disciplina'); }} />
          {disciplinas.map(disc => (
            <Menu.Item
              key={disc._id}
              title={disc.nome}
              onPress={() => { setFiltros({...filtros, disciplinaId: disc._id}); toggleMenu('disciplina'); }}
            />
          ))}
        </Menu>

        <Menu
          visible={menusVisiveis.professor}
          onDismiss={() => toggleMenu('professor')}
          anchor={
            <Button
              mode="outlined"
              onPress={() => toggleMenu('professor')}
              style={styles.filtroButton}
              textColor="#000"
            >
              {filtros.professorId 
                ? professores.find(p => p._id === filtros.professorId)?.nome 
                : 'Professor'}
            </Button>
          }
        >
          <Menu.Item title="Todos" onPress={() => { setFiltros({...filtros, professorId: ''}); toggleMenu('professor'); }} />
          {professores.map(prof => (
            <Menu.Item
              key={prof._id}
              title={prof.nome}
              onPress={() => { setFiltros({...filtros, professorId: prof._id}); toggleMenu('professor'); }}
            />
          ))}
        </Menu>

        <Button mode="contained" onPress={limparFiltros} style={styles.limparButton}>
          Limpar Filtros
        </Button>
      </View>

      <View style={styles.gradeWrapper}>
        <View style={styles.headerRow}>
        <View style={styles.horarioHeader}>
          <Text style={styles.headerText}>Horário</Text>
        </View>
        {DIAS_SEMANA.map(dia => (
          <View key={dia} style={styles.diaHeader}>
            <Text style={styles.headerText}>{dia.substring(0, 3)}</Text>
          </View>
        ))}
      </View>

      <ScrollView style={styles.gradeScroll}>
        {blocosOrdenados.map(bloco => (
          <View key={bloco._id} style={styles.gradeRow}>
            <View style={styles.horarioCell}>
              <Text style={styles.horarioText}>{obterHorarioBloco(bloco._id)}</Text>
            </View>
            {DIAS_SEMANA.map(dia => {
              const aula = grade[dia]?.[bloco._id];
              return (
                <View key={`${dia}-${bloco._id}`} style={styles.aulaCell}>
                  {aula ? (
                    <Card style={[styles.aulaCard, { backgroundColor: aula.cor }]}>
                      <Card.Content style={styles.aulaCardContent}>
                        <Text style={styles.aulaText} numberOfLines={1}>{aula.disciplinaNome}</Text>
                        <Text style={styles.aulaSubText} numberOfLines={1}>{aula.professorNome}</Text>
                        <Text style={styles.aulaSubText} numberOfLines={1}>{aula.cursoNome}</Text>
                      </Card.Content>
                    </Card>
                  ) : (
                    <View style={styles.aulaCellEmpty} />
                  )}
                </View>
              );
            })}
          </View>
        ))}
      </ScrollView>
      </View>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  filtrosContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filtrosTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  filtroButton: {
    marginBottom: 8,
  },
  limparButton: {
    marginTop: 8,
  },

  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#1e1e1e',
  },
  horarioHeader: {
    width: 70,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#fff',
  },
  diaHeader: {
    flex: 1,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#fff',
  },
  headerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  gradeWrapper: {
    flex: 1,
    marginHorizontal: 16,
  },
  gradeScroll: {
    flex: 1,
  },
  gradeRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  horarioCell: {
    width: 70,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    borderRightWidth: 1,
    borderRightColor: '#333',
  },
  horarioText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
  aulaCell: {
    flex: 1,
    minHeight: 80,
    padding: 4,
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },
  aulaCellEmpty: {
    flex: 1,
    backgroundColor: '#fff',
  },
  aulaCard: {
    flex: 1,
    elevation: 2,
  },
  aulaCardContent: {
    padding: 6,
  },
  aulaText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  aulaSubText: {
    fontSize: 9,
    color: '#fff',
  },
});

export default ConsultasScreen;
