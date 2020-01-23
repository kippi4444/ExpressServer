const valid = function  (schema) {
    return async (req, res, next) => {
        try {
            await schema.validateAsync(req.body);
            next();
        }
        catch (err) {
            res.status(400).send({Error: err.message});
        }
    }
};

module.exports = valid;
