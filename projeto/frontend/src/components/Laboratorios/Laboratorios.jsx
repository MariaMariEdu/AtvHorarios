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
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { laboratoriosService } from '../../services/api';

/**
 * Componente para gerenciamento de laboratórios
 * Implementa CRUD completo com ordenação e filtros
 * @component
 */
const Laboratorios = () => {
  const [laboratorios, setLaboratorios] = useState([]);
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
    capacidade: '',
    descricao: '',
    localizacao: '',
    equipamentos: [],
    status: true,
  });

  /**
   * Carrega a lista de laboratórios da API
   */
  const carregarLaboratorios = async () => {
    setLoading(true);
    try {
      const response = await laboratoriosService.listar();
      setLaboratorios(response.data);
    } catch (error) {
      console.error('Erro ao carregar:', error);
      mostrarSnackbar('Erro ao carregar laboratórios', 'error');
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
   * Abre o dialog para criar ou editar laboratório
   * @param {Object|null} laboratorio - Dados do laboratório para edição ou null para criação
   */
  const abrirDialog = (laboratorio = null) => {
    if (laboratorio) {
      setEditingId(laboratorio._id);
      setFormData({
        nome: laboratorio.nome || '',
        codigo: laboratorio.codigo || '',
        capacidade: laboratorio.capacidade || '',
        descricao: laboratorio.descricao || '',
        localizacao: laboratorio.localizacao || '',
        equipamentos: Array.isArray(laboratorio.equipamentos) ? laboratorio.equipamentos : [],
        status: laboratorio.status !== undefined ? laboratorio.status : true,
      });
    } else {
      setEditingId(null);
      setFormData({
        nome: '',
        codigo: '',
        capacidade: '',
        descricao: '',
        localizacao: '',
        equipamentos: [],
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
   * Salva o laboratório (criar ou atualizar)
   */
  const salvarLaboratorio = async () => {
    try {
      const dadosParaSalvar = {
        ...formData,
        capacidade: parseInt(formData.capacidade) || 0,
        equipamentos: typeof formData.equipamentos === 'string' 
          ? formData.equipamentos.split(',').map(eq => eq.trim()).filter(eq => eq)
          : formData.equipamentos,
      };

      if (editingId) {
        await laboratoriosService.atualizar(editingId, dadosParaSalvar);
        mostrarSnackbar('Laboratório atualizado com sucesso');
      } else {
        await laboratoriosService.criar(dadosParaSalvar);
        mostrarSnackbar('Laboratório criado com sucesso');
      }
      fecharDialog();
      carregarLaboratorios();
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao salvar laboratório';
      mostrarSnackbar(message, 'error');
    }
  };

  /**
   * Remove um laboratório
   * @param {string} id - ID do laboratório a ser removido
   */
  const removerLaboratorio = async (id) => {
    if (window.confirm('Tem certeza que deseja remover este laboratório?')) {
      try {
        await laboratoriosService.remover(id);
        mostrarSnackbar('Laboratório removido com sucesso');
        carregarLaboratorios();
      } catch (error) {
        const message = error.response?.data?.message || 'Erro ao remover laboratório';
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
   * @param {Object} a - Primeiro item
   * @param {Object} b - Segundo item
   * @param {string} orderBy - Propriedade de ordenação
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
   * Obtém o comparador para ordenação
   * @param {string} order - Direção da ordenação (asc/desc)
   * @param {string} orderBy - Propriedade de ordenação
   * @returns {Function} Função comparadora
   */
  const getComparator = (order, orderBy) => {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  /**
   * Filtra e ordena os laboratórios
   */
  const laboratoriosFiltradosEOrdenados = laboratorios
    .filter((laboratorio) =>
      Object.values(laboratorio).some((value) =>
        String(value).toLowerCase().includes(filtro.toLowerCase())
      )
    )
    .sort(getComparator(order, orderBy));

  useEffect(() => {
    carregarLaboratorios();
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
            Novo Laboratório
          </Button>
          
          <TextField
            size="small"
            placeholder="Filtrar laboratórios..."
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
                  active={orderBy === 'capacidade'}
                  direction={orderBy === 'capacidade' ? order : 'asc'}
                  onClick={() => handleRequestSort('capacidade')}
                >
                  Capacidade
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'localizacao'}
                  direction={orderBy === 'localizacao' ? order : 'asc'}
                  onClick={() => handleRequestSort('localizacao')}
                >
                  Localização
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
            {laboratoriosFiltradosEOrdenados.map((laboratorio) => (
              <TableRow key={laboratorio._id}>
                <TableCell>{laboratorio.nome}</TableCell>
                <TableCell>{laboratorio.codigo}</TableCell>
                <TableCell>{laboratorio.capacidade}</TableCell>
                <TableCell>{laboratorio.localizacao}</TableCell>
                <TableCell>
                  <Typography color={laboratorio.status ? 'success.main' : 'error.main'}>
                    {laboratorio.status ? 'Ativo' : 'Inativo'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => abrirDialog(laboratorio)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => removerLaboratorio(laboratorio._id)}
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
          {editingId ? 'Editar Laboratório' : 'Novo Laboratório'}
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
              onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Capacidade *"
              type="number"
              value={formData.capacidade}
              onChange={(e) => setFormData({ ...formData, capacidade: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Localização *"
              value={formData.localizacao}
              onChange={(e) => setFormData({ ...formData, localizacao: e.target.value })}
              fullWidth
              required
              placeholder="Ex: Bloco A - Sala 101"
            />
            <TextField
              label="Descrição"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              fullWidth
              multiline
              rows={2}
              placeholder="Descrição do laboratório..."
            />
            <TextField
              label="Equipamentos"
              value={Array.isArray(formData.equipamentos) ? formData.equipamentos.join(', ') : formData.equipamentos}
              onChange={(e) => setFormData({ ...formData, equipamentos: e.target.value })}
              fullWidth
              multiline
              rows={3}
              placeholder="Separe os equipamentos por vírgula..."
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                />
              }
              label="Ativo"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharDialog}>Cancelar</Button>
          <Button onClick={salvarLaboratorio} variant="contained">
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

export default Laboratorios;