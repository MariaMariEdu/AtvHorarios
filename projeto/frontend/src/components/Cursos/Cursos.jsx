import React, { useState, useEffect, useCallback } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { cursosService, instituicoesService } from '../../services/api';

/**
 * Componente para gerenciamento de cursos
 * Implementa CRUD completo com ordenação, filtros e interface responsiva
 * @component
 */
const Cursos = () => {
  const [cursos, setCursos] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [orderBy, setOrderBy] = useState('nome');
  const [order, setOrder] = useState('asc');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const [formData, setFormData] = useState({
    nome: '',
    turno: 'Matutino',
    instituicaoid: '',
    status: true,
  });

  const [instituicoes, setInstituicoes] = useState([]);

  /**
   * Carrega a lista de cursos da API
   */
  const carregarCursos = useCallback(async () => {
    try {
      const response = await cursosService.listar();
      const data = response?.data?.cursos || response?.data;
      setCursos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar:', error);
      setCursos([]);
      mostrarSnackbar('Erro ao carregar cursos. Verifique se o backend está rodando.', 'error');
    }
  }, []);

  /**
   * Carrega a lista de instituições para o select
   */
  const carregarInstituicoes = async () => {
    try {
      const response = await instituicoesService.listar();
      console.log('Response instituições:', response);
      const data = response?.data;
      console.log('Data instituições:', data);
      setInstituicoes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar instituições:', error);
      setInstituicoes([]);
    }
  };

  /**
   * Exibe mensagem de feedback para o usuário
   * @param {string} message - Mensagem a ser exibida
   * @param {string} severity - Tipo da mensagem (success, error, warning, info)
   */
  const mostrarSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  /**
   * Abre o dialog para criação ou edição de curso
   * @param {Object|null} curso - Dados do curso para edição ou null para criação
   */
  const abrirDialog = async (curso = null) => {
    // Carrega instituições sempre que abre o dialog
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
    setDialogOpen(true);
  };

  /**
   * Fecha o dialog de criação/edição
   */
  const fecharDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
  };

  /**
   * Salva o curso (criação ou atualização)
   */
  const salvarCurso = async () => {
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
      mostrarSnackbar(message, 'error');
    }
  };

  /**
   * Remove um curso após confirmação
   * @param {string} id - ID do curso a ser removido
   */
  const removerCurso = async (id) => {
    if (window.confirm('Tem certeza que deseja remover este curso?')) {
      try {
        await cursosService.remover(id);
        mostrarSnackbar('Curso removido com sucesso');
        carregarCursos();
      } catch (error) {
        const message = error.response?.data?.message || 'Erro ao remover curso';
        mostrarSnackbar(message, 'error');
      }
    }
  };

  /**
   * Manipula a ordenação da tabela
   * @param {string} property - Propriedade pela qual ordenar
   */
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  /**
   * Função de comparação para ordenação
   * @param {Object} a - Primeiro objeto
   * @param {Object} b - Segundo objeto
   * @param {string} orderBy - Propriedade para ordenação
   * @returns {number} Resultado da comparação
   */
  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) return -1;
    if (b[orderBy] > a[orderBy]) return 1;
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
   * Filtra e ordena os cursos
   */
  const cursosFiltradosEOrdenados = Array.isArray(cursos) ? cursos
    .filter((curso) =>
      Object.values(curso || {}).some((value) =>
        String(value || '').toLowerCase().includes(filtro.toLowerCase())
      )
    )
    .sort(getComparator(order, orderBy)) : [];

  useEffect(() => {
    carregarCursos();
    carregarInstituicoes();
  }, [carregarCursos]);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => abrirDialog()}>
            Novo Curso
          </Button>
          <TextField
            size="small"
            placeholder="Filtrar cursos..."
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
                  active={orderBy === 'instituicaoid'}
                  direction={orderBy === 'instituicaoid' ? order : 'asc'}
                  onClick={() => handleRequestSort('instituicaoid')}
                >
                  Instituição
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'turno'}
                  direction={orderBy === 'turno' ? order : 'asc'}
                  onClick={() => handleRequestSort('turno')}
                >
                  Turno
                </TableSortLabel>
              </TableCell>
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
            {cursosFiltradosEOrdenados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body2" color="text.secondary">
                    {Array.isArray(cursos) && cursos.length === 0 ? 'Nenhum curso encontrado' : 'Nenhum curso corresponde ao filtro'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              cursosFiltradosEOrdenados.map((curso) => (
                <TableRow key={curso._id || Math.random()}>
                  <TableCell>{curso.nome || '-'}</TableCell>
                  <TableCell>{curso.instituicaoid?.nome || '-'}</TableCell>
                  <TableCell>{curso.turno || '-'}</TableCell>
                  <TableCell>
                    <Typography color={curso.status ? 'success.main' : 'error.main'}>
                      {curso.status ? 'Ativo' : 'Inativo'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => abrirDialog(curso)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => removerCurso(curso._id)} color="error">
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
          {editingId ? 'Editar Curso' : 'Novo Curso'}
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
            <FormControl fullWidth required>
              <InputLabel>Instituição *</InputLabel>
              <Select
                value={formData.instituicaoid}
                label="Instituição *"
                onChange={(e) => setFormData({ ...formData, instituicaoid: e.target.value })}
              >
                {instituicoes.map((instituicao) => (
                  <MenuItem key={instituicao._id} value={instituicao._id}>
                    {instituicao.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography variant="caption" color="text.secondary">
              Instituições carregadas: {instituicoes.length}
              {instituicoes.length > 0 && ` - Primeira: ${instituicoes[0]?.nome}`}
            </Typography>
            <FormControl fullWidth required>
              <InputLabel>Turno *</InputLabel>
              <Select
                value={formData.turno}
                label="Turno *"
                onChange={(e) => setFormData({ ...formData, turno: e.target.value })}
              >
                <MenuItem value="Matutino">Matutino</MenuItem>
                <MenuItem value="Vespertino">Vespertino</MenuItem>
                <MenuItem value="Noturno">Noturno</MenuItem>
                <MenuItem value="Integral">Integral</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <MenuItem value={true}>Ativo</MenuItem>
                <MenuItem value={false}>Inativo</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharDialog}>Cancelar</Button>
          <Button onClick={salvarCurso} variant="contained">
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

export default Cursos;