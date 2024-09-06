const Joi = require('joi');

const goalSchema = Joi.object({
  name: Joi.string().required().min(3).max(50).messages({
    'string.empty': 'O nome é obrigatório.',
    'any.required': 'O nome é obrigatório.',
    'string.min': 'O nome deve ter pelo menos 3 caracteres',
    'string.max': 'O nome deve ter no máximo 50 caracteres',
  }),
  amount: Joi.number().positive().required().messages({
    'number.base': 'O valor deve ser um número.',
    'number.positive': 'O valor deve ser positivo.',
    'any.required': 'O valor é obrigatório.'
  }),
  description: Joi.string().max(255).optional().messages({
    'string.base': 'A descrição deve ser uma string',
    'string.max': 'A descrição deve ter no máximo 255 caracteres'
  }),
  currentAmount: Joi.number().positive().default(0).messages({
    'number.base': 'O valor atual deve ser um número.',
    'number.positive': 'O valor atual deve ser positivo.'
  }),
  target_date: Joi.date().required().messages({
    'date.base': 'A data deve ser uma data válida',
    'any.required': 'A data é obrigatória'
  }),
  categoryId: Joi.number().integer().positive().required().messages({
    'number.base': 'O ID da categoria deve ser um número.',
    'number.integer': 'O ID da categoria deve ser um número inteiro.',
    'number.positive': 'O ID da categoria deve ser positivo.',
    'any.required': 'O ID da categoria é obrigatório.'
  })
});

const updateGoalSchema = Joi.object({
  name: Joi.string().optional().min(3).max(50).messages({
    'string.min': 'O nome deve ter pelo menos 3 caracteres',
    'string.max': 'O nome deve ter no máximo 50 caracteres',
  }),
  amount: Joi.number().positive().optional().messages({
    'number.base': 'O valor deve ser um número.',
    'number.positive': 'O valor deve ser positivo.',
  }),
  description: Joi.string().max(255).optional().messages({
    'string.base': 'A descrição deve ser uma string',
    'string.max': 'A descrição deve ter no máximo 255 caracteres'
  }),
  currentAmount: Joi.number().positive().default(0).messages({
    'number.base': 'O valor atual deve ser um número.',
    'number.positive': 'O valor atual deve ser positivo.'
  }),
  target_date: Joi.date().optional().messages({
    'date.base': 'A data deve ser uma data válida',
  }),
  categoryId: Joi.number().integer().positive().optional().messages({
    'number.base': 'O ID da categoria deve ser um número.',
    'number.integer': 'O ID da categoria deve ser um número inteiro.',
    'number.positive': 'O ID da categoria deve ser positivo.',
  })
});

module.exports = { goalSchema, updateGoalSchema }