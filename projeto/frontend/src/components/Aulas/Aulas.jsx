import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Snackbar,
  Alert,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  OutlinedInput,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Class as ClassIcon,
} from '@mui/icons-material';
import { 
  aulasService, 
  cursosService, 
  disciplinasService, 
  professoresService, 
  laboratoriosService,
  blocosHorarioService 
} from '../../services/api';

/**
 * Componente para gerenciamento de aulas
 * @component
 * @returns {JSX.Element} Componente de gerenciamento de aulas
 */
const Aulas = () => {
  // Estados principais
  const [aulas, setAulas] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [laboratorios, setLaboratorios] = useState([]);
  const [blocosHorario, setBlocosHorario] = useState([]);
  
  // Estados de controle
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Estados de filtros
  const [filtros, setFiltros] = useState({
    semestre: '',
    curso: '',
    disciplina: '',
    professor: '',
    laboratorio: '',
    diaSemana: '',
  });
  
  // Estados de ordenação
  const [orderBy, setOrderBy] = useState('semestre');
  const [order, setOrder] = useState('asc');
  
  // Estado do snackbar
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Estado do formulário
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
    horaInicio: '',
    horaFim: '',
  });

  // Dias da semana
  const diasSemana = [
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
    'Domingo'
  ];

  /**
   * Carrega todas as aulas
   */
  const carregarAulas = async () => {
    setLoading(true);
    try {
      const response = await aulasService.listar();
      setAulas(response.data || []);
    } catch (error) {
      console.error('Erro ao carregar aulas:', error);
      mostrarSnackbar('Erro ao carregar aulas', 'error');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Carrega dados auxiliares (cursos, disciplinas, etc.)
   */
  const carregarDadosAuxiliares = async () => {
    try {
      const [cursosRes, disciplinasRes, professoresRes, laboratoriosRes, blocosRes] = await Promise.all([
        cursosService.listar(),
        disciplinasService.listar(),
        professoresService.listar(),
        laboratoriosService.listar(),
        blocosHorarioService.listar()
      ]);

      console.log('Professores carregados:', professoresRes.data);
      console.log('Professores ativos:', professoresRes.data?.filter(p => p.ativo));
      setCursos(Array.isArray(cursosRes.data) ? cursosRes.data : cursosRes.data?.cursos || []);
      setDisciplinas(Array.isArray(disciplinasRes.data) ? disciplinasRes.data : []);
      setProfessores(Array.isArray(professoresRes.data) ? professoresRes.data : []);
      setLaboratorios(Array.isArray(laboratoriosRes.data) ? laboratoriosRes.data : []);
      setBlocosHorario(Array.isArray(blocosRes.data) ? blocosRes.data : []);
    } catch (error) {
      console.error('Erro ao carregar dados auxiliares:', error);
      mostrarSnackbar('Erro ao carregar dados auxiliares', 'error');
    }
  };

  /**
   * Mostra mensagem no snackbar
   * @param {string} message - Mensagem a ser exibida
   * @param {string} severity - Tipo da mensagem (success, error, warning, info)
   */
  const mostrarSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  /**
   * Abre o dialog para criar/editar aula
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
        dataInicio: aula.dataInicio ? aula.dataInicio.split('T')[0] : '',
        dataFim: aula.dataFim ? aula.dataFim.split('T')[0] : '',
        horaInicio: aula.dataInicio ? new Date(aula.dataInicio).toTimeString().slice(0,5) : '',
        horaFim: aula.dataFim ? new Date(aula.dataFim).toTimeString().slice(0,5) : '',
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
        horaInicio: '08:00',
        horaFim: '18:00',
      });
    }
    setDialogOpen(true);
  };

  /**
   * Fecha o dialog
   */
  const fecharDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
  };

  /**
   * Salva a aula (criar ou atualizar)
   */
  const salvarAula = async () => {
    try {
      // Validar campos obrigatórios
      if (!formData.semestre || !formData.cursoId || !formData.disciplinaId || 
          !formData.professorId || !formData.laboratorioId || !formData.diaSemana || 
          !formData.blocos.length || !formData.dataInicio || !formData.dataFim) {
        mostrarSnackbar('Todos os campos são obrigatórios', 'error');
        return;
      }

      // Validar horários
      if (formData.dataInicio === formData.dataFim && formData.horaFim <= formData.horaInicio) {
        mostrarSnackbar('Horário de fim deve ser posterior ao horário de início', 'error');
        return;
      }
      
      if (new Date(formData.dataFim + 'T' + formData.horaFim) <= new Date(formData.dataInicio + 'T' + formData.horaInicio)) {
        mostrarSnackbar('Data/horário de fim deve ser posterior ao de início', 'error');
        return;
      }

      const dataInicio = new Date(formData.dataInicio + 'T' + (formData.horaInicio || '08:00') + ':00.000Z');
      const dataFim = new Date(formData.dataFim + 'T' + (formData.horaFim || '18:00') + ':00.000Z');
      
      const dadosParaEnvio = {
        ...formData,
        dataInicio: dataInicio.toISOString(),
        dataFim: dataFim.toISOString(),
      };
      
      console.log('Dados enviados:', dadosParaEnvio);
      console.log('Data início:', dataInicio, 'Data fim:', dataFim);

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
      console.error('Erro completo:', error);
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
      
      let message = 'Erro ao salvar aula';
      
      if (error.response?.status === 409) {
        const { tipo, aulaConflitante } = error.response.data;
        if (tipo === 'professor') {
          message = 'Professor já possui aula neste horário';
        } else if (tipo === 'laboratorio') {
          message = 'Laboratório já está ocupado neste horário';
        }
      } else if (error.response?.status === 400) {
        message = error.response?.data?.details || error.response?.data?.message || 'Dados inválidos';
      } else {
        message = error.response?.data?.message || message;
      }
      
      mostrarSnackbar(message, 'error');
    }
  };

  /**
   * Remove uma aula
   * @param {string} id - ID da aula a ser removida
   */
  const removerAula = async (id) => {
    if (window.confirm('Tem certeza que deseja remover esta aula?')) {
      try {
        await aulasService.remover(id);
        mostrarSnackbar('Aula removida com sucesso');
        carregarAulas();
      } catch (error) {
        const message = error.response?.data?.message || 'Erro ao remover aula';
        mostrarSnackbar(message, 'error');
      }
    }
  };

  /**
   * Manipula a ordenação da tabela
   * @param {string} property - Propriedade para ordenação
   */
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  /**
   * Comparador para ordenação
   * @param {Object} a - Primeiro objeto
   * @param {Object} b - Segundo objeto
   * @param {string} orderBy - Propriedade para ordenação
   * @returns {number} Resultado da comparação
   */
  const descendingComparator = (a, b, orderBy) => {
    let aValue = a[orderBy];
    let bValue = b[orderBy];

    // Tratamento para objetos aninhados
    if (orderBy === 'cursoId' && typeof aValue === 'object') {
      aValue = aValue?.nome || '';
      bValue = bValue?.nome || '';
    }
    if (orderBy === 'disciplinaId' && typeof aValue === 'object') {
      aValue = aValue?.nome || '';
      bValue = bValue?.nome || '';
    }
    if (orderBy === 'professorId' && typeof aValue === 'object') {
      aValue = aValue?.nome || '';
      bValue = bValue?.nome || '';
    }
    if (orderBy === 'laboratorioId' && typeof aValue === 'object') {
      aValue = aValue?.nome || '';
      bValue = bValue?.nome || '';
    }

    if (bValue < aValue) return -1;
    if (bValue > aValue) return 1;
    return 0;
  };

  /**
   * Obtém o comparador para ordenação
   * @param {string} order - Direção da ordenação (asc/desc)
   * @param {string} orderBy - Propriedade para ordenação
   * @returns {Function} Função comparadora
   */
  const getComparator = (order, orderBy) => {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  /**
   * Filtra as aulas baseado nos filtros ativos
   */
  const aulasFiltradas = Array.isArray(aulas) ? aulas
    .filter((aula) => {
      return (
        (!filtros.semestre || aula.semestre?.toLowerCase().includes(filtros.semestre.toLowerCase())) &&
        (!filtros.curso || aula.cursoId?.nome?.toLowerCase().includes(filtros.curso.toLowerCase())) &&
        (!filtros.disciplina || aula.disciplinaId?.nome?.toLowerCase().includes(filtros.disciplina.toLowerCase())) &&
        (!filtros.professor || aula.professorId?.nome?.toLowerCase().includes(filtros.professor.toLowerCase())) &&
        (!filtros.laboratorio || aula.laboratorioId?.nome?.toLowerCase().includes(filtros.laboratorio.toLowerCase())) &&
        (!filtros.diaSemana || aula.diaSemana?.toLowerCase().includes(filtros.diaSemana.toLowerCase()))
      );
    })
    .sort(getComparator(order, orderBy)) : [];

  /**
   * Obtém o nome de um objeto ou retorna valor padrão
   * @param {Object|string} obj - Objeto ou string
   * @param {string} defaultValue - Valor padrão
   * @returns {string} Nome do objeto ou valor padrão
   */
  const obterNome = (obj, defaultValue = 'N/A') => {
    if (typeof obj === 'object' && obj?.nome) {
      return obj.nome;
    }
    return defaultValue;
  };

  /**
   * Obtém os nomes e horários dos blocos
   * @param {Array} blocos - Array de blocos
   * @returns {string} Nomes e horários dos blocos
   */
  const obterNomesBlocos = (blocos) => {
    if (!Array.isArray(blocos) || blocos.length === 0) return 'Nenhum';
    if (!Array.isArray(blocosHorario)) return 'Carregando...';
    
    return blocos.map(bloco => {
      if (typeof bloco === 'object' && bloco.nome) {
        return `${bloco.nome} (${bloco.horarioInicial}-${bloco.horarioFinal})`;
      }
      const blocoEncontrado = blocosHorario.find(b => b._id === bloco);
      return blocoEncontrado ? 
        `${blocoEncontrado.nome} (${blocoEncontrado.horarioInicial}-${blocoEncontrado.horarioFinal})` : 
        'N/A';
    }).join(', ');
  };

  /**
   * Formata data para exibição
   * @param {string} data - Data em formato ISO
   * @returns {string} Data formatada
   */
  const formatarData = (data) => {
    if (!data) return 'N/A';
    return new Date(data).toLocaleDateString('pt-BR');
  };

  useEffect(() => {
    carregarAulas();
    carregarDadosAuxiliares();
  }, []);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Cabeçalho com botões e filtros */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => abrirDialog()}
          >
            Nova Aula
          </Button>
        </Box>

        {/* Filtros */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder="Filtrar por semestre..."
            value={filtros.semestre}
            onChange={(e) => setFiltros({ ...filtros, semestre: e.target.value })}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            sx={{ minWidth: 200 }}
          />
          <TextField
            size="small"
            placeholder="Filtrar por curso..."
            value={filtros.curso}
            onChange={(e) => setFiltros({ ...filtros, curso: e.target.value })}
            sx={{ minWidth: 200 }}
          />
          <TextField
            size="small"
            placeholder="Filtrar por disciplina..."
            value={filtros.disciplina}
            onChange={(e) => setFiltros({ ...filtros, disciplina: e.target.value })}
            sx={{ minWidth: 200 }}
          />
          <TextField
            size="small"
            placeholder="Filtrar por professor..."
            value={filtros.professor}
            onChange={(e) => setFiltros({ ...filtros, professor: e.target.value })}
            sx={{ minWidth: 200 }}
          />
          <TextField
            size="small"
            placeholder="Filtrar por laboratório..."
            value={filtros.laboratorio}
            onChange={(e) => setFiltros({ ...filtros, laboratorio: e.target.value })}
            sx={{ minWidth: 200 }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Dia da Semana</InputLabel>
            <Select
              value={filtros.diaSemana}
              onChange={(e) => setFiltros({ ...filtros, diaSemana: e.target.value })}
              label="Dia da Semana"
            >
              <MenuItem value="">Todos</MenuItem>
              {diasSemana.map((dia) => (
                <MenuItem key={dia} value={dia}>
                  {dia}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Tabela de aulas */}
      <TableContainer component={Paper} sx={{ flexGrow: 1 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'semestre'}
                  direction={orderBy === 'semestre' ? order : 'asc'}
                  onClick={() => handleRequestSort('semestre')}
                >
                  Semestre
                </TableSortLabel>
              </TableCell>
              <TableCell>Curso</TableCell>
              <TableCell>Disciplina</TableCell>
              <TableCell>Professor</TableCell>
              <TableCell>Laboratório</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'diaSemana'}
                  direction={orderBy === 'diaSemana' ? order : 'asc'}
                  onClick={() => handleRequestSort('diaSemana')}
                >
                  Dia da Semana
                </TableSortLabel>
              </TableCell>
              <TableCell>Horários</TableCell>
              <TableCell>Período do Semestre</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : aulasFiltradas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  Nenhuma aula encontrada
                </TableCell>
              </TableRow>
            ) : (
              aulasFiltradas.map((aula) => (
                <TableRow key={aula._id}>
                  <TableCell>{aula.semestre}</TableCell>
                  <TableCell>{obterNome(aula.cursoId)}</TableCell>
                  <TableCell>{obterNome(aula.disciplinaId)}</TableCell>
                  <TableCell>{obterNome(aula.professorId)}</TableCell>
                  <TableCell>{obterNome(aula.laboratorioId)}</TableCell>
                  <TableCell>{aula.diaSemana}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontSize: '0.75rem', lineHeight: 1.2 }}>
                      {aula.dataInicio && aula.dataFim ? 
                        `${new Date(aula.dataInicio).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}-${new Date(aula.dataFim).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}` : 
                        obterNomesBlocos(aula.blocos)
                      }
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatarData(aula.dataInicio)} até {formatarData(aula.dataFim)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => abrirDialog(aula)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => removerAula(aula._id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog para criar/editar aula */}
      <Dialog open={dialogOpen} onClose={fecharDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ClassIcon />
            {editingId ? 'Editar Aula' : 'Nova Aula'}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Semestre *"
              value={formData.semestre}
              onChange={(e) => setFormData({ ...formData, semestre: e.target.value })}
              fullWidth
              required
              placeholder="Ex: 2025.1"
              helperText="Formato: AAAA.S (ex: 2025.1 para primeiro semestre de 2025)"
            />
            
            <FormControl fullWidth required>
              <InputLabel>Curso *</InputLabel>
              <Select
                value={formData.cursoId}
                onChange={(e) => setFormData({ ...formData, cursoId: e.target.value })}
                label="Curso *"
              >
                {cursos.map((curso) => (
                  <MenuItem key={curso._id} value={curso._id}>
                    {curso.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth required>
              <InputLabel>Disciplina *</InputLabel>
              <Select
                value={formData.disciplinaId}
                onChange={(e) => setFormData({ ...formData, disciplinaId: e.target.value })}
                label="Disciplina *"
              >
                {disciplinas.filter(d => d.status).map((disciplina) => (
                  <MenuItem key={disciplina._id} value={disciplina._id}>
                    {disciplina.nome} ({disciplina.codigo})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth required>
              <InputLabel>Professor *</InputLabel>
              <Select
                value={formData.professorId}
                onChange={(e) => setFormData({ ...formData, professorId: e.target.value })}
                label="Professor *"
              >
                {professores.map((professor) => (
                  <MenuItem key={professor._id} value={professor._id}>
                    {professor.nome} {professor.especialidade ? `- ${professor.especialidade}` : ''}
                  </MenuItem>
                ))}
                {professores.length === 0 && (
                  <MenuItem disabled>Nenhum professor encontrado</MenuItem>
                )}
              </Select>
            </FormControl>

            <FormControl fullWidth required>
              <InputLabel>Laboratório *</InputLabel>
              <Select
                value={formData.laboratorioId}
                onChange={(e) => setFormData({ ...formData, laboratorioId: e.target.value })}
                label="Laboratório *"
              >
                {laboratorios.filter(l => l.status).map((laboratorio) => (
                  <MenuItem key={laboratorio._id} value={laboratorio._id}>
                    {laboratorio.nome} ({laboratorio.codigo})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth required>
              <InputLabel>Dia da Semana *</InputLabel>
              <Select
                value={formData.diaSemana}
                onChange={(e) => setFormData({ ...formData, diaSemana: e.target.value })}
                label="Dia da Semana *"
              >
                {diasSemana.map((dia) => (
                  <MenuItem key={dia} value={dia}>
                    {dia}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth required>
              <InputLabel>Blocos de Horário *</InputLabel>
              <Select
                multiple
                value={formData.blocos}
                onChange={(e) => setFormData({ ...formData, blocos: e.target.value })}
                input={<OutlinedInput label="Blocos de Horário *" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const bloco = blocosHorario.find(b => b._id === value);
                      return (
                        <Chip key={value} label={bloco?.nome || value} size="small" />
                      );
                    })}
                  </Box>
                )}
              >
                {blocosHorario.map((bloco) => (
                  <MenuItem key={bloco._id} value={bloco._id}>
                    {bloco.nome} ({bloco.horarioInicial} - {bloco.horarioFinal})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Data de Início *"
                type="date"
                value={formData.dataInicio}
                onChange={(e) => setFormData({ ...formData, dataInicio: e.target.value })}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                helperText="Início do período letivo"
              />

              <TextField
                label="Data de Fim *"
                type="date"
                value={formData.dataFim}
                onChange={(e) => setFormData({ ...formData, dataFim: e.target.value })}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                helperText="Fim do período letivo"
                inputProps={{
                  min: formData.dataInicio
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Hora de Início *"
                type="time"
                value={formData.horaInicio}
                onChange={(e) => setFormData({ ...formData, horaInicio: e.target.value })}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                helperText="Horário de início da aula"
              />

              <TextField
                label="Hora de Fim *"
                type="time"
                value={formData.horaFim}
                onChange={(e) => setFormData({ ...formData, horaFim: e.target.value })}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                helperText="Horário de fim da aula"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharDialog}>Cancelar</Button>
          <Button onClick={salvarAula} variant="contained">
            {editingId ? 'Atualizar' : 'Criar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para mensagens */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Aulas;