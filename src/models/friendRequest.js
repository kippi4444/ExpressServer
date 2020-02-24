
const {Schema, model} = require('mongoose');

const request = new Schema ({
    friend: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},{ timestamps: { createdAt: 'created_at' } });



module.exports = model('Request', request);
