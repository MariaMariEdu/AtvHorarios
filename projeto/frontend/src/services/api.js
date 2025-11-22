import axios from 'axios';

/**
 * Configuração da API
 * @module API
 */

const API_BASE_URL = 'http://localhost:3000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Serviços para operações com instituições
 */
export const instituicoesService = {
  /**
   * Lista todas as instituições
   * @param {Object} params - Parâmetros de consulta
   * @returns {Promise} Promise com dados das instituições
   */
  listar: (params = {}) => api.get('/instituicoes', { params }),

  /**
   * Cria uma nova instituição
   * @param {Object} data - Dados da instituição
   * @returns {Promise} Promise com dados da instituição criada
   */
  criar: (data) => api.post('/instituicoes', data),

  /**
   * Atualiza uma instituição
   * @param {string} id - ID da instituição
   * @param {Object} data - Dados para atualização
   * @returns {Promise} Promise com dados da instituição atualizada
   */
  atualizar: (id, data) => api.put(`/instituicoes/${id}`, data),

  /**
   * Remove uma instituição
   * @param {string} id - ID da instituição
   * @returns {Promise} Promise da operação
   */
  remover: (id) => api.delete(`/instituicoes/${id}`),
};

/**
 * Serviços para operações com cursos
 */
export const cursosService = {
  /**
   * Lista todos os cursos
   * @param {Object} params - Parâmetros de consulta
   * @returns {Promise} Promise com dados dos cursos
   */
  listar: (params = {}) => api.get('/cursos', { params }),

  /**
   * Cria um novo curso
   * @param {Object} data - Dados do curso
   * @returns {Promise} Promise com dados do curso criado
   */
  criar: (data) => api.post('/cursos', data),

  /**
   * Atualiza um curso
   * @param {string} id - ID do curso
   * @param {Object} data - Dados para atualização
   * @returns {Promise} Promise com dados do curso atualizado
   */
  atualizar: (id, data) => api.put(`/cursos/${id}`, data),

  /**
   * Remove um curso
   * @param {string} id - ID do curso
   * @returns {Promise} Promise da operação
   */
  remover: (id) => api.delete(`/cursos/${id}`),
};

export default api;