import Joi from "joi";
import { removeWhitespace } from "../utils/formatters/removeWhitespace.js";
import { AccessibilityLevel } from "../interfaces/eventInterface.js";

export const schemaEventUpdate = Joi.object({
    title: Joi.string().optional().custom(
        (value) => removeWhitespace(value)
    ).max(120).messages({
        'string.base': 'Título deve ser uma string',
        'string.max': 'Título deve conter no máximo 120 caracteres'
    }),
    description: Joi.string().optional().custom(
        (value) => removeWhitespace(value)
    ).messages({
        'string.base': 'Descrição deve ser uma string',
        'string.max': 'Descrição deve conter no máximo 120 caracteres'
    }),
    linkEvent: Joi.string().uri().optional().messages({
        'string.base': 'O link deve ser uma string',
        'string.uri': 'O link deve ser uma URL válida',
    }),
    address: Joi.object({
        street: Joi.string().optional().custom(
            (value) => removeWhitespace(value)
        ).min(10).max(120).messages({
            'string.base': 'Rua deve ser uma string'
        }),
        number: Joi.string().trim().max(8).pattern(new RegExp('^[a-zA-Z0-9\\s]+$')).optional().messages({
            'string.base': 'Número deve ser uma string',
            'string.pattern.base': 'Número deve conter apenas caracteres alfanuméricos',
            'string.max': 'Número deve conter no máximo 8 caracteres'
        }),
        neighborhood: Joi.string().optional().custom(
            (value) => removeWhitespace(value)
        ).max(20).messages({
            'string.base': 'Bairro deve ser uma string',
            'string.max': 'Bairro deve conter no máximo 20 caracteres'
        }),
        complement: Joi.string().trim().optional().max(30).messages({
            'string.base': 'Complemento deve ser uma string',
            'string.max': 'Complemento deve conter no máximo 30 caracteres'
        }),
    }).optional(),
    startDateTime: Joi.date().min('now').optional().messages({
        'date.base': 'Data de início deve ser válida',
        'date.min': 'Data de início não pode ser anterior à data atual',
    }),
    endDateTime: Joi.date().greater(Joi.ref('startDateTime')).optional().messages({
        'date.base': 'Data de término deve ser válida',
        'date.greater': 'Data de término não pode ser menor que a data de início',
    }),
    accessibilityLevel: Joi.string().valid(...Object.values(AccessibilityLevel)).optional().messages({
        'any.only': 'Nível de acessibilidade inválido',
    })
})