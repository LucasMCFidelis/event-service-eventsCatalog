import Joi from "joi";
import { removeWhitespace } from "../utils/formatters/removeWhitespace.js";
import { AccessibilityLevel } from "../interfaces/eventInterface.js";

export const schemaEventUpdate = Joi.object({
  eventTitle: Joi.string()
    .optional()
    .custom((value) => removeWhitespace(value))
    .max(120)
    .messages({
      "string.base": "Título deve ser uma string",
      "string.max": "Título deve conter no máximo 120 caracteres",
    }),
  eventDescription: Joi.string()
    .optional()
    .custom((value) => removeWhitespace(value))
    .max(600)
    .messages({
      "string.base": "Descrição deve ser uma string",
      "string.max": "Descrição deve conter no máximo 600 caracteres",
    }),
  eventLink: Joi.string().uri().optional().messages({
    "string.base": "O link deve ser uma string",
    "string.uri": "O link deve ser uma URL válida",
  }),
  eventPrice: Joi.number()
    .precision(2)
    .min(0)
    .max(999999.99)
    .optional()
    .messages({
      "number.base": "Preço deve ser um número válido",
      "number.min": "Preço não pode ser negativo",
      "number.max": "Preço não pode ultrapassar R$ 999.999,99",
      "number.precision": "Preço deve ter no máximo 2 casas decimais",
    }),
  eventAddressStreet: Joi.string()
    .optional()
    .custom((value) => removeWhitespace(value))
    .min(10)
    .max(120)
    .messages({
      "string.base": "Rua deve ser uma string",
      "string.min": "Rua deve conter no mínimo 10 caracteres",
      "string.max": "Rua deve conter no máximo 120 caracteres",
    }),
  eventAddressNumber: Joi.string()
    .trim()
    .max(8)
    .pattern(new RegExp("^[a-zA-Z0-9\\s]+$"))
    .optional()
    .messages({
      "string.base": "Número deve ser uma string",
      "string.pattern.base":
        "Número deve conter apenas caracteres alfanuméricos",
      "string.max": "Número deve conter no máximo 8 caracteres",
    }),
  eventAddressNeighborhood: Joi.string()
    .optional()
    .custom((value) => removeWhitespace(value))
    .max(20)
    .messages({
      "string.base": "Bairro deve ser uma string",
      "string.max": "Bairro deve conter no máximo 20 caracteres",
    }),
  eventAddressComplement: Joi.string().trim().optional().max(30).messages({
    "string.base": "Complemento deve ser uma string",
    "string.max": "Complemento deve conter no máximo 30 caracteres",
  }),
  startDateTime: Joi.date().min("now").optional().messages({
    "date.base": "Data de início deve ser válida",
    "date.min": "Data de início não pode ser anterior à data atual",
  }),
  endDateTime: Joi.date()
    .greater(Joi.ref("startDateTime"))
    .optional()
    .messages({
      "date.base": "Data de término deve ser válida",
      "date.greater": "Data de término não pode ser menor que a data de início",
    }),
  eventAccessibilityLevel: Joi.string()
    .valid(...Object.values(AccessibilityLevel))
    .optional()
    .messages({
      "any.only": "Nível de acessibilidade inválido",
    }),
});
