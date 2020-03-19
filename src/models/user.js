require('dotenv').config({path: "../config.env"});
const {Schema, model} = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Photo = require('photo');
const user = new Schema({
    login: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        trim: true
    },
    birthday: {
        type: Date,
        required: true,
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
    avatar: {
        type: Photo,
    },
    number: String,
    online: {
        type: Boolean,
        default: false
    },
    surname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
},{ timestamps: { createdAt: 'created_at' } });

user.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET_FRAZE);
    user.tokens = user.tokens.concat({token});
    user.save();
    return token
};


user.statics.findByCredentials = async (login, password) => {
    const user = await User.findOne({login});
    if (!user) {
        throw new Error('User not found');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Wrong password ');
    }
    return user
};

user.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

user.pre('findOneAndUpdate', async function (next) {
    const user = this;
    if (user._update.password) {
        user._update.password = await bcrypt.hash(user._update.password, 8);
    } else delete user._update.password;
    next();
});

const User = model('User', user);
module.exports = User;
