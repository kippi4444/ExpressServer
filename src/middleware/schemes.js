const Joi = require('@hapi/joi');

const user = Joi.object({
        login: Joi.string()
            .empty()
            .alphanum()
            .min(3)
            .max(30)
            .required()
            .error((errors) => new Error('"login" no valid')),

        surname: Joi.string()
            .empty()
            .alphanum()
            .min(3)
            .max(30)
            .required()
            .error((errors) => new Error('"surname" no valid')),

        name: Joi.string()
            .empty()
            .alphanum()
            .min(3)
            .max(30)
            .required()
            .error((errors) => new Error('"name" no valid')),

        password: Joi.string()
            .empty()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
            .error((errors) => new Error('"password" no valid')),

        email: Joi.string()
            .empty()
            .email({ minDomainSegments: 2, tlds: {} })
            .error((errors) => new Error('"email" no valid')),

        number: Joi.string()
            .pattern(new RegExp('^(375|\\+375|80)(?:\\s(44|29|25|33)\\s|\\((44|29|25|33)\\)|(44|29|25|33))[1-9]{1}([0-9]{6}|[0-9]{2}-[0-9]{2}-[0-9]{2})$'))
            .error((errors) => new Error('"number" no valid')),
        });

const pet = Joi.object({

        name: Joi.string()
            .empty()
            .alphanum()
            .min(2)
            .max(30)
            .required()
            .error((errors) => new Error('"Pet Name" no valid')),

        species: Joi.string()
            .empty()
            .alphanum()
            .min(3)
            .max(30)
            .required()
            .error((errors) => new Error('"Pet species" no valid')),

        owner: Joi.string()
            .empty()
            .min(20)
            .required()
            .error((errors) => new Error('"Id owner" no valid')),
        });

module.exports = {user, pet};
