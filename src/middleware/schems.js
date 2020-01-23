const Joi = require('@hapi/joi');

const user = Joi.object({
        login: Joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required(),
        surname: Joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required(),

        name: Joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required(),

        password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: {} }),

        number: Joi.string()
            .pattern(new RegExp('^(375(29|33|25|44)|\\+375(29|33|25|44)|8\\s\\(0(29|33|25|44)\\)\\s)[1-9]{1}([0-9]{6}|[0-9]{2}-[0-9]{2}-[0-9]{2})$')),
    });

const pet = Joi.object({

        name: Joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required(),

        number: Joi.string()
            .min(10)
            .required(),
});


module.exports = {user, pet};
