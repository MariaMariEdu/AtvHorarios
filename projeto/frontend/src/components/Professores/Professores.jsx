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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { professoresService } from '../../services/api';

/**
 * Componente para gerenciamento de professores
 * Implementa CRUD completo com filtros e ordenação
 * @component
 */
const Professores = () => {
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
    email: '',
    telefone: '',
    especialidade: '',
    ativo: true,
  });

  /**
   * Carrega a lista de professores da API
   */
  const carregarProfessores = async () => {
    setLoading(true);
    try {
      const response = await professoresService.listar();
      setProfessores(response.data);
    } catch (error) {
      console.error('Erro ao carregar:', error);
      mostrarSnackbar('Erro ao carregar professores', 'error');
    } finally {
      setLoading(false);
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
   * Abre o modal para criar ou editar professor
   * @param {Object|null} professor - Dados do professor para edição ou null para criação
   */
  const abrirDialog = (professor = null) => {
    if (professor) {
      setEditingId(professor._id);
      setFormData({
        nome: professor.nome || '',
        email: professor.email || '',
        telefone: professor.telefone || '',
        especialidade: professor.especialidade || '',
        ativo: professor.ativo !== undefined ? professor.ativo : true,
      });
    } else {
      setEditingId(null);
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        especialidade: '',
        ativo: true,
      });
    }
    setDialogOpen(true);
  };

  /**
   * Fecha o modal de criação/edição
   */
  const fecharDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
  };

  /**
   * Salva os dados do professor (criar ou atualizar)
   */
  const salvarProfessor = async () => {
    try {
      if (editingId) {
        await professoresService.atualizar(editingId, formData);
        mostrarSnackbar('Professor atualizado com sucesso');
      } else {
        await professoresService.criar(formData);
        mostrarSnackbar('Professor criado com sucesso');
      }
      fecharDialog();
      carregarProfessores();
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao salvar professor';
      mostrarSnackbar(message, 'error');
    }
  };

  /**
   * Remove um professor
   * @param {string} id - ID do professor a ser removido
   */
  const removerProfessor = async (id) => {
    if (window.confirm('Tem certeza que deseja remover este professor?')) {
      try {
        await professoresService.remover(id);
        mostrarSnackbar('Professor removido com sucesso');
        carregarProfessores();
      } catch (error) {
        const message = error.response?.data?.message || 'Erro ao remover professor';
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
   * Compara dois valores para ordenação
   * @param {any} a - Primeiro valor
   * @param {any} b - Segundo valor
   * @param {string} orderBy - Propriedade para ordenação
   * @returns {number} Resultado da comparação
   */
  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };

  /**
   * Função de comparação para ordenação
   * @param {string} order - Direção da ordenação (asc/desc)
   * @param {string} orderBy - Propriedade para ordenação
   * @returns {Function} Função de comparação
   */
  const getComparator = (order, orderBy) => {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  /**
   * Filtra e ordena a lista de professores
   */
  const professoresFiltrados = professores
    .filter((professor) =>
      Object.values(professor).some((value) =>
        String(value).toLowerCase().includes(filtro.toLowerCase())
      )
    )
    .sort(getComparator(order, orderBy));

  useEffect(() => {
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
            Novo Professor
          </Button>
          
          <TextField
            size="small"
            placeholder="Filtrar professores..."
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
                  active={orderBy === 'email'}
                  direction={orderBy === 'email' ? order : 'asc'}
                  onClick={() => handleRequestSort('email')}
                >
                  Email
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'especialidade'}
                  direction={orderBy === 'especialidade' ? order : 'asc'}
                  onClick={() => handleRequestSort('especialidade')}
                >
                  Especialidade
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'ativo'}
                  direction={orderBy === 'ativo' ? order : 'asc'}
                  onClick={() => handleRequestSort('ativo')}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {professoresFiltrados.map((professor) => (
              <TableRow key={professor._id}>
                <TableCell>{professor.nome}</TableCell>
                <TableCell>{professor.email}</TableCell>
                <TableCell>{professor.especialidade}</TableCell>
                <TableCell>
                  <Typography color={professor.ativo ? 'success.main' : 'error.main'}>
                    {professor.ativo ? 'Ativo' : 'Inativo'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => abrirDialog(professor)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => removerProfessor(professor._id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={fecharDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingId ? 'Editar Professor' : 'Novo Professor'}
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
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              fullWidth
            />
            <TextField
              label="Telefone"
              value={formData.telefone}
              onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
              fullWidth
            />
            <TextField
              label="Especialidade"
              value={formData.especialidade}
              onChange={(e) => setFormData({ ...formData, especialidade: e.target.value })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharDialog}>Cancelar</Button>
          <Button onClick={salvarProfessor} variant="contained">
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

export default Professores;