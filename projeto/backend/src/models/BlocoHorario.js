const mongoose = require('mongoose');

/**
 * @fileoverview Modelo Mongoose para Blocos de Horário
 * @description Define a estrutura de dados para blocos de horário no sistema
 */

/**
 * Schema para Bloco de Horário
 * @typedef {Object} BlocoHorario
 * @property {string} turno - Turno do bloco (Manhã, Tarde, Noite)
 * @property {string} diaSemana - Dia da semana (Segunda, Terça, Quarta, etc.)
 * @property {string} inicio - Horário inicial do bloco (formato HH:MM)
 * @property {string} fim - Horário final do bloco (formato HH:MM)
 * @property {number} ordem - Número que representa a ordem do bloco dentro do turno
 * @property {Date} createdAt - Data de criação do registro
 * @property {Date} updatedAt - Data da última atualização do registro
 */

const blocoHorarioSchema = new mongoose.Schema({
  /**
   * Turno do bloco de horário
   * @type {String}
   * @required
   * @example 'Manhã'
   */
  turno: {
    type: String,
    required: [true, 'Turno é obrigatório'],
    trim: true
  },

  /**
   * Dia da semana do bloco
   * @type {String}
   * @required
   * @example 'Segunda'
   */
  diaSemana: {
    type: String,
    required: [true, 'Dia da semana é obrigatório'],
    trim: true
  },

  /**
   * Horário de início do bloco
   * @type {String}
   * @required
   * @format HH:MM
   * @example '08:00'
   */
  inicio: {
    type: String,
    required: [true, 'Horário de início é obrigatório'],
    trim: true,
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de horário inválido (HH:MM)']
  },

  /**
   * Horário de fim do bloco
   * @type {String}
   * @required
   * @format HH:MM
   * @example '09:50'
   */
  fim: {
    type: String,
    required: [true, 'Horário de fim é obrigatório'],
    trim: true,
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de horário inválido (HH:MM)']
  },

  /**
   * Ordem do bloco dentro do turno
   * @type {Number}
   * @required
   * @example 1
   */
  ordem: {
    type: Number,
    required: [true, 'Ordem é obrigatória'],
    min: [1, 'Ordem deve ser maior que 0']
  }
}, {
  timestamps: true,
  collection: 'blocosHorario'
});

/**
 * Modelo Mongoose para Bloco de Horário
 * @type {mongoose.Model<BlocoHorario>}
 */
const BlocoHorario = mongoose.model('BlocoHorario', blocoHorarioSchema);

module.exports = BlocoHorario;