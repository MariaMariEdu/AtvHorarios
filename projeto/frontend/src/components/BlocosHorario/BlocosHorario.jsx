import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import axios from 'axios';

const BlocosHorario = () => {
  const [blocosHorario, setBlocosHorario] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBloco, setEditingBloco] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [formData, setFormData] = useState({
    turno: '',
    diaSemana: '',
    inicio: '',
    fim: '',
    ordem: 1,
  });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchBlocosHorario = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/v1/blocos-horario');
      setBlocosHorario(response.data.blocos || []);
    } catch (error) {
      console.error('Erro:', error);
      setBlocosHorario([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlocosHorario();
  }, []);

  const filteredBlocos = Array.isArray(blocosHorario) ? blocosHorario.filter(bloco =>
    bloco.turno?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bloco.diaSemana?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const handleOpenDialog = (bloco = null) => {
    if (bloco) {
      setEditingBloco(bloco);
      setFormData({
        turno: bloco.turno || '',
        diaSemana: bloco.diaSemana || '',
        inicio: bloco.inicio || '',
        fim: bloco.fim || '',
        ordem: bloco.ordem || 1,
      });
    } else {
      setEditingBloco(null);
      setFormData({
        turno: '',
        diaSemana: '',
        inicio: '',
        fim: '',
        ordem: 1,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingBloco(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (editingBloco) {
        await axios.put(`http://localhost:3000/api/v1/blocos-horario/${editingBloco._id}`, formData);
        showSnackbar('Bloco atualizado com sucesso');
      } else {
        await axios.post('http://localhost:3000/api/v1/blocos-horario', formData);
        showSnackbar('Bloco criado com sucesso');
      }
      handleCloseDialog();
      fetchBlocosHorario();
    } catch (error) {
      console.error('Erro:', error);
      showSnackbar('Erro ao salvar', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Excluir este bloco?')) return;
    try {
      setLoading(true);
      await axios.delete(`http://localhost:3000/api/v1/blocos-horario/${id}`);
      showSnackbar('Bloco excluído');
      fetchBlocosHorario();
    } catch (error) {
      showSnackbar('Erro ao excluir', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <TextField
          label="Pesquisar"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por turno ou dia da semana..."
          sx={{ minWidth: 250, flexGrow: 1 }}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          disabled={loading}
        >
          Adicionar Bloco
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ flexGrow: 1, overflow: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Turno</TableCell>
              <TableCell>Dia da Semana</TableCell>
              <TableCell>Início</TableCell>
              <TableCell>Fim</TableCell>
              <TableCell>Ordem</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBlocos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" color="textSecondary">
                    {loading ? 'Carregando...' : 'Nenhum bloco encontrado'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredBlocos.map((bloco) => (
                <TableRow key={bloco._id} hover>
                  <TableCell>{bloco.turno}</TableCell>
                  <TableCell>{bloco.diaSemana}</TableCell>
                  <TableCell>{bloco.inicio}</TableCell>
                  <TableCell>{bloco.fim}</TableCell>
                  <TableCell>{bloco.ordem}</TableCell>
                  <TableCell align="center">
                    <IconButton size="small" onClick={() => handleOpenDialog(bloco)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(bloco._id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingBloco ? 'Editar Bloco de Horário' : 'Novo Bloco de Horário'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              name="turno"
              label="Turno"
              value={formData.turno}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              name="diaSemana"
              label="Dia da Semana"
              value={formData.diaSemana}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                name="inicio"
                label="Início"
                type="time"
                value={formData.inicio}
                onChange={handleInputChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                name="fim"
                label="Fim"
                type="time"
                value={formData.fim}
                onChange={handleInputChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            <TextField
              name="ordem"
              label="Ordem"
              type="number"
              value={formData.ordem}
              onChange={handleInputChange}
              fullWidth
              required
              inputProps={{ min: 1 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained" disabled={loading}>
            {editingBloco ? 'Atualizar' : 'Criar'}
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

export default BlocosHorario;