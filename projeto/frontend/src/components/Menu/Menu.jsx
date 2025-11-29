import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Box,
  Modal,
  IconButton,
  Button,
} from '@mui/material';
import {
  Business as BusinessIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  MenuBook as MenuBookIcon,
  Science as ScienceIcon,
  Schedule as ScheduleIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import Instituicoes from '../Instituicoes/Instituicoes';
import Cursos from '../Cursos/Cursos';
import Professores from '../Professores/Professores';
import Disciplinas from '../Disciplinas/Disciplinas';
import Laboratorios from '../Laboratorios/Laboratorios';
import BlocosHorario from '../BlocosHorario/BlocosHorario';

const Menu = ({ open, onClose }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState('');

  const handleOpenModal = (title, content) => {
    setModalTitle(title);
    setModalContent(content);
    setModalOpen(true);
    onClose();
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalContent(null);
    setModalTitle('');
  };

  const handleInstituicoesClick = () => {
    handleOpenModal('Gerenciar Instituições', <Instituicoes />);
  };

  /**
   * Manipula o clique no menu de Cursos
   * Abre o modal com o componente de gerenciamento de cursos
   */
  const handleCursosClick = () => {
    handleOpenModal('Gerenciar Cursos', <Cursos />);
  };

  /**
   * Manipula o clique no menu de Professores
   * Abre o modal com o componente de gerenciamento de professores
   */
  const handleProfessoresClick = () => {
    handleOpenModal('Gerenciar Professores', <Professores />);
  };

  /**
   * Manipula o clique no menu de Disciplinas
   * Abre o modal com o componente de gerenciamento de disciplinas
   */
  const handleDisciplinasClick = () => {
    handleOpenModal('Gerenciar Disciplinas', <Disciplinas />);
  };

  /**
   * Manipula o clique no menu de Laboratórios
   * Abre o modal com o componente de gerenciamento de laboratórios
   */
  const handleLaboratoriosClick = () => {
    handleOpenModal('Gerenciar Laboratórios', <Laboratorios />);
  };

  /**
   * Manipula o clique no menu de Blocos de Horário
   * Abre o modal com o componente de gerenciamento de blocos de horário
   */
  const handleBlocosHorarioClick = () => {
    handleOpenModal('Gerenciar Blocos de Horário', <BlocosHorario />);
  };

  return (
    <>
      <Drawer anchor="left" open={open} onClose={onClose}>
        <Box sx={{ width: 280 }}>
          <Box sx={{ p: 2, backgroundColor: '#1976d2', color: 'white' }}>
            <Typography variant="h6">
              Menu Principal
            </Typography>
          </Box>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={handleInstituicoesClick}>
                <ListItemIcon>
                  <BusinessIcon />
                </ListItemIcon>
                <ListItemText primary="Instituições" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={handleCursosClick}>
                <ListItemIcon>
                  <SchoolIcon />
                </ListItemIcon>
                <ListItemText primary="Cursos" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={handleProfessoresClick}>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Professores" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={handleDisciplinasClick}>
                <ListItemIcon>
                  <MenuBookIcon />
                </ListItemIcon>
                <ListItemText primary="Disciplinas" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={handleLaboratoriosClick}>
                <ListItemIcon>
                  <ScienceIcon />
                </ListItemIcon>
                <ListItemText primary="Laboratórios" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={handleBlocosHorarioClick}>
                <ListItemIcon>
                  <ScheduleIcon />
                </ListItemIcon>
                <ListItemText primary="Blocos de Horário" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            width: '90%',
            maxWidth: '1200px',
            height: '90%',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 2,
              borderBottom: '1px solid #e0e0e0',
            }}
          >
            <Typography variant="h6">
              {modalTitle}
            </Typography>
            <IconButton onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
            {modalContent}
          </Box>

          <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
            <Button onClick={handleCloseModal} variant="contained">
              Fechar
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default Menu;