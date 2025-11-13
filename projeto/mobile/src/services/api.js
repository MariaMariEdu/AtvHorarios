import axios from 'axios';

/**
 * Configuração da API para mobile
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

export default api;