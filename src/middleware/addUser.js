require('dotenv').config({path:"../config.env"});
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const addUserReq = async (req, res, next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET_FRAZE);
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token });
        req.token = token;
        req.user = user;
        next()
    } catch (e) {
        res.status(401).send('Please, authenticate');
    }
};

module.exports = addUserReq;
