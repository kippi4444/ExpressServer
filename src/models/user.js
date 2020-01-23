const {Schema, model} = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const user = new Schema ({
    login: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    name: {
        type: String,
        required: true
    },
    number: String,
    surname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
});

user.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({_id: user._id.toString() }, 'hightquality');
    user.tokens = user.tokens.concat({ token });
    user.save();

    return token
};

user.statics.findByCredentials = async (login, password) => {

    const user = await User.findOne({login});
    if(!user) {
        throw new Error('Unable user')
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
};

user.pre('save', async function(next){
    const user = this;
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
});


const User = model('User', user);
module.exports = User;
