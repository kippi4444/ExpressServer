
const {Schema, model} = require('mongoose');

const photo = new Schema ({
    url:  {
        type: String,
        required: true
    },
    album:  {
        type: Schema.Types.ObjectId,
        ref: 'Album',
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }]
},{ timestamps: { createdAt: 'created_at' } });



module.exports = model('Photo', photo);
