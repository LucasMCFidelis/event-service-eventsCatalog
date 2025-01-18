import Joi from "joi";
import { removeWhitespace } from "../utils/formatters/removeWhitespace.js";

const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
const phoneRegex = /^\(\d{2}\)\d{5}-\d{4}$/;

export const schemaEventOrganizerUpdate = Joi.object({
    organizerName: Joi.string().optional().custom(
        (value) => removeWhitespace(value)
    ).min(3).max(100).messages({
        'string.base': 'Nome do organizador deve ser uma string',
        'string.min': 'Nome do organizador deve conter no mínimo 3 caracteres',
        'string.max': 'Nome do organizador deve conter no máximo 100 caracteres'
    }),
    organizerCnpj: Joi.string().optional().custom(
        (value) => removeWhitespace(value)
    ).pattern(cnpjRegex).messages({
        'string.base': 'CNPJ do organizador deve ser uma string',
        'string.pattern.base': 'CNPJ deve estar no formato 99.999.999/9999-99'
    }),
    organizerEmail: Joi.string().email().optional().messages({
        'string.base': 'Email do organizador deve ser uma string',
        'string.email': 'Email do organizador deve ser um email válido',
    }),
    organizerPhoneNumber: Joi.string().optional().custom(
        (value) => removeWhitespace(value)
    ).pattern(phoneRegex).messages({
        'string.base': 'Telefone deve ser uma string',
        'string.pattern.base': 'Telefone deve estar no formato (83)99999-9999'
    })
});
