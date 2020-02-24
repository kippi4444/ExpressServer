const  {Schema, model} = require('mongoose');

const message = new Schema ({
    dialog: {
        type: Schema.Types.ObjectId,
        ref: 'Dialog',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isReading: {
        type: Boolean,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
},{ timestamps: { createdAt: 'created_at' } });

module.exports = model('Message', message);
