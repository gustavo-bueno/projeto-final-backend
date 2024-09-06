const Joi = require('joi');

const userSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    'string.base': 'O nome deve ser uma string',
    'string.empty': 'O nome é obrigatório',
    'string.min': 'O nome deve ter pelo menos 3 caracteres',
    'string.max': 'O nome deve ter no máximo 30 caracteres',
    'any.required': 'O nome é obrigatório'
  }),
  email: Joi.string().email().required().messages({
    'string.base': 'O e-mail deve ser uma string',
    'string.email': 'O e-mail deve ser válido',
    'string.empty': 'O e-mail é obrigatório',
    'any.required': 'O e-mail é obrigatório'
  }),
  password: Joi.string().min(6).required().messages({
    'string.base': 'A senha deve ser uma string',
    'string.empty': 'A senha é obrigatória',
    'string.min': 'A senha deve ter pelo menos 6 caracteres',
    'any.required': 'A senha é obrigatória'
  })
});

const updateUserSchema = Joi.object({
  name: Joi.string().min(3).optional().max(30).messages({
    'string.base': 'O nome deve ser uma string',
    'string.min': 'O nome deve ter pelo menos 3 caracteres',
    'string.max': 'O nome deve ter no máximo 30 caracteres',
  }),
  email: Joi.string().email().optional().messages({
    'string.base': 'O e-mail deve ser uma string',
    'string.email': 'O e-mail deve ser válido',
  }),
  password: Joi.string().min(6).optional().messages({
    'string.base': 'A senha deve ser uma string',
    'string.min': 'A senha deve ter pelo menos 6 caracteres',
  })
});

const authSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.base': 'O e-mail deve ser uma string',
    'string.email': 'O e-mail deve ser válido',
    'string.empty': 'O e-mail é obrigatório',
    'any.required': 'O e-mail é obrigatório'
  }),
  password: Joi.string().min(6).required().messages({
    'string.base': 'A senha deve ser uma string',
    'string.empty': 'A senha é obrigatória',
    'string.min': 'A senha deve ter pelo menos 6 caracteres',
    'any.required': 'A senha é obrigatória'
  })
});

module.exports = { userSchema, authSchema, updateUserSchema };
