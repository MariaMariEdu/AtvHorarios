import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import axios from 'axios';

/**
 * Componente de Consultas de Horários
 * Permite visualizar grade semanal de aulas por laboratório ou professor
 * 
 * @component
 * @returns {JSX.Element} Componente de consultas
 */
const Consultas = () => {
  // Estados para filtros
  const [visao, setVisao] = useState('');
  const [selecionado, setSelecionado] = useState('');
  const [dataBase, setDataBase] = useState('');
  
  // Estados para dados das APIs
  const [laboratorios, setLaboratorios] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [blocosHorario, setBlocosHorario] = useState([]);
  const [aulas, setAulas] = useState([]);
  
  // Estados de controle
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [gradeData, setGradeData] = useState({});

  const diasSemana = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

  /**
   * Carrega dados iniciais das APIs
   */
  useEffect(() => {
    carregarDadosIniciais();
  }, []);

  /**
   * Carrega laboratórios, professores e blocos de horário
   */
  const carregarDadosIniciais = async () => {
    try {
      const [labsRes, profsRes, blocosRes] = await Promise.all([
        axios.get('http://localhost:3000/api/v1/laboratorios'),
        axios.get('http://localhost:3000/api/v1/professores'),
        axios.get('http://localhost:3000/api/v1/blocos-horario')
      ]);
      
      setLaboratorios(labsRes.data);
      setProfessores(profsRes.data);
      setBlocosHorario(blocosRes.data);
    } catch (err) {
      setError('Erro ao carregar dados iniciais');
    }
  };

  /**
   * Carrega lista de opções baseada na visão selecionada
   */
  useEffect(() => {
    setSelecionado('');
  }, [visao]);

  /**
   * Calcula início e fim da semana baseado na data
   * @param {string} data - Data no formato YYYY-MM-DD
   * @returns {Object} Objeto com dataInicio e dataFim
   */
  const calcularSemana = (data) => {
    const dataObj = new Date(data);
    const diaSemana = dataObj.getDay();
    const diasParaSegunda = diaSemana === 0 ? -6 : 1 - diaSemana;
    
    const inicioSemana = new Date(dataObj);
    inicioSemana.setDate(dataObj.getDate() + diasParaSegunda);
    
    const fimSemana = new Date(inicioSemana);
    fimSemana.setDate(inicioSemana.getDate() + 5);
    
    return {
      dataInicio: inicioSemana.toISOString().split('T')[0],
      dataFim: fimSemana.toISOString().split('T')[0]
    };
  };

  /**
   * Executa a busca de aulas com filtros aplicados
   */
  const handleBuscar = async () => {
    if (!visao || !selecionado || !dataBase) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { dataInicio, dataFim } = calcularSemana(dataBase);
      const params = {
        dataInicio,
        dataFim
      };

      if (visao === 'laboratorio') {
        params.laboratorio = selecionado;
      } else {
        params.professor = selecionado;
      }

      console.log('Parâmetros da consulta:', params);
      const response = await axios.get('http://localhost:3000/api/v1/aulas', { params });
      console.log('Aulas retornadas:', response.data);
      console.log('Blocos disponíveis:', blocosHorario);
      
      setAulas(response.data);
      montarGrade(response.data);
      
      if (response.data.length === 0) {
        setError('Nenhuma aula encontrada para os filtros selecionados');
      } else {
        setError(''); // Limpar erro se encontrou aulas
      }
    } catch (err) {
      console.error('Erro na consulta:', err);
      setError('Erro ao buscar aulas: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Monta a estrutura da grade semanal separada por turnos
   * @param {Array} aulasData - Array de aulas retornado da API
   */
  const montarGrade = (aulasData) => {
    console.log('Montando grade com aulas:', aulasData);
    
    // Agrupar blocos por turno
    const blocosPorTurno = {
      'Matutino': blocosHorario.filter(b => b.turno === 'Matutino' || b.turno === 'Manhã'),
      'Vespertino': blocosHorario.filter(b => b.turno === 'Vespertino' || b.turno === 'Tarde'),
      'Noturno': blocosHorario.filter(b => b.turno === 'Noturno' || b.turno === 'Noite')
    };
    
    const gradesPorTurno = {};
    
    // Criar grade para cada turno
    Object.keys(blocosPorTurno).forEach(turno => {
      if (blocosPorTurno[turno].length > 0) {
        const grade = {};
        
        // Inicializar grade vazia para o turno
        diasSemana.forEach(dia => {
          grade[dia] = {};
          blocosPorTurno[turno].forEach(bloco => {
            grade[dia][bloco._id] = null;
          });
        });
        
        gradesPorTurno[turno] = {
          grade,
          blocos: blocosPorTurno[turno]
        };
      }
    });

    // Preencher grades com aulas
    aulasData.forEach((aula, index) => {
      console.log(`Aula ${index + 1}:`, {
        dia: aula.diaSemana,
        disciplina: aula.disciplinaId?.nome,
        blocos: aula.blocos?.map(b => ({ id: b._id, nome: b.nome || 'Sem nome', turno: b.turno })),
        professor: aula.professorId?.nome,
        laboratorio: aula.laboratorioId?.nome
      });
      
      if (aula.diaSemana && aula.blocos) {
        aula.blocos.forEach(bloco => {
          // Encontrar o turno do bloco
          const turnoDoBloco = Object.keys(blocosPorTurno).find(turno => 
            blocosPorTurno[turno].some(b => b._id === bloco._id)
          );
          
          if (turnoDoBloco && gradesPorTurno[turnoDoBloco]) {
            const grade = gradesPorTurno[turnoDoBloco].grade;
            
            if (grade[aula.diaSemana] && grade[aula.diaSemana][bloco._id] !== undefined) {
              if (grade[aula.diaSemana][bloco._id] === null) {
                grade[aula.diaSemana][bloco._id] = aula;
              } else if (Array.isArray(grade[aula.diaSemana][bloco._id])) {
                grade[aula.diaSemana][bloco._id].push(aula);
              } else {
                grade[aula.diaSemana][bloco._id] = [grade[aula.diaSemana][bloco._id], aula];
              }
            }
          }
        });
      }
    });

    console.log('Grades por turno:', gradesPorTurno);
    setGradeData(gradesPorTurno);
  };

  /**
   * Renderiza o conteúdo de uma célula da grade
   * @param {Object|Array} aulaData - Dados da aula ou array de aulas
   * @returns {JSX.Element|null} Card com informações da aula ou null
   */
  const renderizarCelula = (aulaData) => {
    if (!aulaData) return null;

    const cores = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'];
    
    // Se for array de aulas (múltiplas aulas no mesmo horário)
    if (Array.isArray(aulaData)) {
      return (
        <Box sx={{ height: '100%', minHeight: 70, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {aulaData.map((aula, index) => {
            const corIndex = Math.abs(aula.disciplinaId?.nome?.charCodeAt(0) || 0) % cores.length;
            return (
              <Box
                key={aula._id}
                sx={{
                  backgroundColor: cores[corIndex],
                  color: 'white',
                  p: 0.3,
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  textAlign: 'center',
                  fontSize: '0.65rem'
                }}
              >
                <Typography variant="caption" fontWeight="bold" sx={{ lineHeight: 1, fontSize: '0.6rem' }}>
                  {aula.disciplinaId?.nome || 'Disciplina'}
                </Typography>
                <Typography variant="caption" sx={{ lineHeight: 1, fontSize: '0.55rem' }}>
                  {visao === 'laboratorio' 
                    ? aula.professorId?.nome || 'N/A'
                    : aula.laboratorioId?.nome || 'Lab'
                  }
                </Typography>
              </Box>
            );
          })}
        </Box>
      );
    }

    // Aula única
    const aula = aulaData;
    const corIndex = Math.abs(aula.disciplinaId?.nome?.charCodeAt(0) || 0) % cores.length;

    return (
      <Box
        sx={{
          backgroundColor: cores[corIndex],
          color: 'white',
          p: 0.5,
          height: '100%',
          minHeight: 70,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          textAlign: 'center',
          fontSize: '0.75rem'
        }}
      >
        <Typography variant="caption" fontWeight="bold" sx={{ lineHeight: 1.1, mb: 0.5 }}>
          {aula.disciplinaId?.nome || 'Disciplina'}
        </Typography>
        <Typography variant="caption" sx={{ lineHeight: 1.1, fontSize: '0.7rem' }}>
          {visao === 'laboratorio' 
            ? `Professor ${aula.professorId?.nome || 'N/A'}`
            : aula.laboratorioId?.nome || 'Laboratório'
          }
        </Typography>
        <Typography variant="caption" sx={{ lineHeight: 1.1, fontSize: '0.65rem', mt: 0.5 }}>
          ({aula.cursoId?.nome || 'Curso'})
        </Typography>
      </Box>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Consultas de Horários
      </Typography>

      {/* Filtros */}
      <Paper sx={{ p: 3, mb: 4, elevation: 3 }}>
        <Grid container spacing={2} alignItems="end">
          <Grid item xs={12} md={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Visão</InputLabel>
              <Select
                value={visao}
                label="Visão"
                onChange={(e) => setVisao(e.target.value)}
                sx={{ minHeight: 56, minWidth: 200 }}
                MenuProps={{
                  PaperProps: {
                    sx: { maxHeight: 300, minWidth: 200 }
                  }
                }}
              >
                <MenuItem value="laboratorio">Laboratório</MenuItem>
                <MenuItem value="professor">Professor</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={5}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Selecionar</InputLabel>
              <Select
                value={selecionado}
                label="Selecionar"
                onChange={(e) => setSelecionado(e.target.value)}
                disabled={!visao}
                sx={{ minHeight: 56, minWidth: 350 }}
                MenuProps={{
                  PaperProps: {
                    sx: { maxHeight: 300, minWidth: 400 }
                  }
                }}
              >
                {visao === 'laboratorio' && laboratorios.length > 0
                  ? laboratorios.map(lab => (
                      <MenuItem key={lab._id} value={lab._id}>
                        {lab.nome} {lab.codigo ? `(${lab.codigo})` : ''}
                      </MenuItem>
                    ))
                  : visao === 'professor' && professores.length > 0
                  ? professores.map(prof => (
                      <MenuItem key={prof._id} value={prof._id}>
                        {prof.nome}
                      </MenuItem>
                    ))
                  : visao && (
                      <MenuItem disabled>
                        {visao === 'laboratorio' ? 'Nenhum laboratório encontrado' : 'Nenhum professor encontrado'}
                      </MenuItem>
                    )
                }
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              type="date"
              label="Data Base"
              value={dataBase}
              onChange={(e) => setDataBase(e.target.value)}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              sx={{ minHeight: 56 }}
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<SearchIcon />}
              onClick={handleBuscar}
              disabled={loading || !visao || !selecionado || !dataBase}
              sx={{ minHeight: 56 }}
            >
              Buscar
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Mensagens de erro */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Loading */}
      {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      {/* Grades Semanais por Turno */}
      {Object.keys(gradeData).length > 0 && blocosHorario.length > 0 && (
        <Box>
          {/* Cabeçalho do Laboratório/Professor */}
          <Paper sx={{ mb: 3, p: 2, backgroundColor: '#000', color: 'white', textAlign: 'center' }}>
            <Typography variant="h5" fontWeight="bold">
              {visao === 'laboratorio' 
                ? `${laboratorios.find(l => l._id === selecionado)?.nome || 'Laboratório'} (${laboratorios.find(l => l._id === selecionado)?.capacidade || 0} computadores)`
                : professores.find(p => p._id === selecionado)?.nome || 'Professor'
              }
            </Typography>
          </Paper>

          {/* Renderizar tabela para cada turno */}
          {Object.entries(gradeData).map(([turno, dadosTurno]) => (
            <Box key={turno} sx={{ mb: 4 }}>
              {/* Título do Turno */}
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', color: '#333' }}>
                {turno}
              </Typography>
              
              <TableContainer component={Paper} sx={{ border: '2px solid #000', mb: 2 }}>
                <Table sx={{ '& .MuiTableCell-root': { border: '1px solid #000', p: 0.5 } }}>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#666' }}>
                      <TableCell sx={{ fontWeight: 'bold', color: 'white', textAlign: 'center', minWidth: 100 }}>
                        HOR
                      </TableCell>
                      {diasSemana.map(dia => (
                        <TableCell key={dia} sx={{ fontWeight: 'bold', color: 'white', textAlign: 'center', minWidth: 180 }}>
                          {dia.split('-')[0]}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dadosTurno.blocos.sort((a, b) => (a.inicio || a.horarioInicial || '').localeCompare(b.inicio || b.horarioInicial || '')).map(bloco => (
                      <TableRow key={bloco._id}>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f0f0f0', textAlign: 'center', minWidth: 100 }}>
                          <Typography variant="body2" fontWeight="bold">
                            {bloco.inicio || bloco.horarioInicial}
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {bloco.fim || bloco.horarioFinal}
                          </Typography>
                        </TableCell>
                        {diasSemana.map(dia => (
                          <TableCell key={`${dia}-${bloco._id}`} sx={{ p: 0.5, height: 80, verticalAlign: 'top' }}>
                            {renderizarCelula(dadosTurno.grade[dia] && dadosTurno.grade[dia][bloco._id])}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ))}
        </Box>
      )}

      {/* Mensagem quando não há dados */}
      {Object.keys(gradeData).length > 0 && blocosHorario.length === 0 && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          Nenhum bloco de horário cadastrado. Cadastre blocos de horário primeiro.
        </Alert>
      )}
      
      {/* Info sobre aulas encontradas */}
      {aulas.length > 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          {aulas.length} aula(s) encontrada(s) para os filtros selecionados. 
          Blocos cadastrados: {blocosHorario.length}
        </Alert>
      )}
    </Box>
  );
};

export default Consultas;