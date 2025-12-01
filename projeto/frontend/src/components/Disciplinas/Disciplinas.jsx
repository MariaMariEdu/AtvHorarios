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
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { disciplinasService, cursosService, professoresService } from '../../services/api';

/**
 * Componente para gerenciamento de disciplinas
 * @component
 */
const Disciplinas = () => {
  const [disciplinas, setDisciplinas] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [orderBy, setOrderBy] = useState('nome');
  const [order, setOrder] = useState('asc');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const [formData, setFormData] = useState({
    nome: '',
    codigo: '',
    cargaHoraria: '',
    curso: '',
    professorResponsavel: '',
    status: true,
  });

  /**
   * Carrega disciplinas
   */
  const carregarDisciplinas = async () => {
    setLoading(true);
    try {
      const response = await disciplinasService.listar();
      setDisciplinas(response.data || []);
    } catch (error) {
      console.error('Erro ao carregar disciplinas:', error);
      mostrarSnackbar('Erro ao carregar disciplinas', 'error');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Carrega cursos
   */
  const carregarCursos = async () => {
    try {
      const response = await cursosService.listar();
      console.log('Cursos carregados:', response.data);
      setCursos(response.data.cursos || response.data || []);
    } catch (error) {
      console.error('Erro ao carregar cursos:', error);
    }
  };

  /**
   * Carrega professores
   */
  const carregarProfessores = async () => {
    try {
      const response = await professoresService.listar();
      setProfessores(response.data || []);
    } catch (error) {
      console.error('Erro ao carregar professores:', error);
    }
  };

  /**
   * Mostra mensagem
   */
  const mostrarSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  /**
   * Abre dialog
   */
  const abrirDialog = (disciplina = null) => {
    if (disciplina) {
      setEditingId(disciplina._id);
      setFormData({
        nome: disciplina.nome || '',
        codigo: disciplina.codigo || '',
        cargaHoraria: disciplina.cargaHoraria || '',
        curso: disciplina.curso?._id || disciplina.curso || '',
        professorResponsavel: disciplina.professorResponsavel?._id || disciplina.professorResponsavel || '',
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
    setDialogOpen(true);
  };

  /**
   * Fecha dialog
   */
  const fecharDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
  };

  /**
   * Salva disciplina
   */
  const salvarDisciplina = async () => {
    try {
      const dadosParaEnvio = {
        ...formData,
        cargaHoraria: Number(formData.cargaHoraria),
        professorResponsavel: formData.professorResponsavel || null,
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
      const message = error.response?.data?.message || 'Erro ao salvar disciplina';
      mostrarSnackbar(message, 'error');
    }
  };

  /**
   * Remove disciplina
   */
  const removerDisciplina = async (id) => {
    if (window.confirm('Tem certeza que deseja remover esta disciplina?')) {
      try {
        await disciplinasService.remover(id);
        mostrarSnackbar('Disciplina removida com sucesso');
        carregarDisciplinas();
      } catch (error) {
        const message = error.response?.data?.message || 'Erro ao remover disciplina';
        mostrarSnackbar(message, 'error');
      }
    }
  };

  /**
   * Ordena tabela
   */
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  /**
   * Comparador
   */
  const descendingComparator = (a, b, orderBy) => {
    let aValue = a[orderBy];
    let bValue = b[orderBy];

    if (orderBy === 'curso' && typeof aValue === 'object') {
      aValue = aValue?.nome || '';
      bValue = bValue?.nome || '';
    }
    if (orderBy === 'professorResponsavel' && typeof aValue === 'object') {
      aValue = aValue?.nome || '';
      bValue = bValue?.nome || '';
    }

    if (bValue < aValue) return -1;
    if (bValue > aValue) return 1;
    return 0;
  };

  /**
   * Comparador
   */
  const getComparator = (order, orderBy) => {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  /**
   * Filtra disciplinas
   */
  const disciplinasFiltradas = Array.isArray(disciplinas) ? disciplinas
    .filter((disciplina) => {
      const searchText = filtro.toLowerCase();
      return (
        disciplina.nome?.toLowerCase().includes(searchText) ||
        disciplina.codigo?.toLowerCase().includes(searchText) ||
        disciplina.curso?.nome?.toLowerCase().includes(searchText) ||
        disciplina.professorResponsavel?.nome?.toLowerCase().includes(searchText) ||
        String(disciplina.cargaHoraria).includes(searchText)
      );
    })
    .sort(getComparator(order, orderBy)) : [];

  /**
   * Obtém nome do curso
   */
  const obterNomeCurso = (curso) => {
    if (typeof curso === 'object' && curso?.nome) {
      return curso.nome;
    }
    const cursoEncontrado = cursos.find(c => c._id === curso);
    return cursoEncontrado?.nome || 'N/A';
  };

  /**
   * Obtém nome do professor
   */
  const obterNomeProfessor = (professor) => {
    if (!professor) return 'Não atribuído';
    if (typeof professor === 'object' && professor?.nome) {
      return professor.nome;
    }
    const professorEncontrado = professores.find(p => p._id === professor);
    return professorEncontrado?.nome || 'N/A';
  };

  useEffect(() => {
    carregarDisciplinas();
    carregarCursos();
    carregarProfessores();
  }, []);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => abrirDialog()}
          >
            Nova Disciplina
          </Button>
          
          <TextField
            size="small"
            placeholder="Filtrar disciplinas..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            sx={{ minWidth: 250 }}
          />
        </Box>
      </Paper>

      <TableContainer component={Paper} sx={{ flexGrow: 1 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'nome'}
                  direction={orderBy === 'nome' ? order : 'asc'}
                  onClick={() => handleRequestSort('nome')}
                >
                  Nome
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'codigo'}
                  direction={orderBy === 'codigo' ? order : 'asc'}
                  onClick={() => handleRequestSort('codigo')}
                >
                  Código
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'cargaHoraria'}
                  direction={orderBy === 'cargaHoraria' ? order : 'asc'}
                  onClick={() => handleRequestSort('cargaHoraria')}
                >
                  Carga Horária
                </TableSortLabel>
              </TableCell>
              <TableCell>Curso</TableCell>
              <TableCell>Professor</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'status'}
                  direction={orderBy === 'status' ? order : 'asc'}
                  onClick={() => handleRequestSort('status')}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : disciplinasFiltradas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Nenhuma disciplina encontrada
                </TableCell>
              </TableRow>
            ) : (
              disciplinasFiltradas.map((disciplina) => (
                <TableRow key={disciplina._id}>
                  <TableCell>{disciplina.nome}</TableCell>
                  <TableCell>{disciplina.codigo}</TableCell>
                  <TableCell>{disciplina.cargaHoraria}h</TableCell>
                  <TableCell>{obterNomeCurso(disciplina.curso)}</TableCell>
                  <TableCell>{obterNomeProfessor(disciplina.professorResponsavel)}</TableCell>
                  <TableCell>
                    <Typography color={disciplina.status ? 'success.main' : 'error.main'}>
                      {disciplina.status ? 'Ativa' : 'Inativa'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => abrirDialog(disciplina)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => removerDisciplina(disciplina._id)}
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

      <Dialog open={dialogOpen} onClose={fecharDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingId ? 'Editar Disciplina' : 'Nova Disciplina'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Nome *"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Código *"
              value={formData.codigo}
              onChange={(e) => setFormData({ ...formData, codigo: e.target.value.toUpperCase() })}
              fullWidth
              required
              placeholder="Ex: MAT001"
            />
            <TextField
              label="Carga Horária *"
              type="number"
              value={formData.cargaHoraria}
              onChange={(e) => setFormData({ ...formData, cargaHoraria: e.target.value })}
              fullWidth
              required
              inputProps={{ min: 1, max: 1000 }}
            />
            <FormControl fullWidth>
              <InputLabel>Curso</InputLabel>
              <Select
                value={formData.curso}
                onChange={(e) => setFormData({ ...formData, curso: e.target.value })}
                label="Curso"
              >
                <MenuItem value="">Nenhum</MenuItem>
                {cursos.map((curso) => (
                  <MenuItem key={curso._id} value={curso._id}>
                    {curso.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Professor Responsável</InputLabel>
              <Select
                value={formData.professorResponsavel}
                onChange={(e) => setFormData({ ...formData, professorResponsavel: e.target.value })}
                label="Professor Responsável"
              >
                <MenuItem value="">Nenhum</MenuItem>
                {professores.filter(p => p.ativo).map((professor) => (
                  <MenuItem key={professor._id} value={professor._id}>
                    {professor.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                />
              }
              label="Disciplina Ativa"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharDialog}>Cancelar</Button>
          <Button onClick={salvarDisciplina} variant="contained">
            {editingId ? 'Atualizar' : 'Criar'}
          </Button>
        </DialogActions>
      </Dialog>

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

export default Disciplinas;