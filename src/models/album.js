
const {Schema, model} = require('mongoose');

const album = new Schema ({
    title: {
        type: String,
        default: "My Album"
    },
    description: {
        type: String,
        default: "My photo album"
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},{ timestamps: { createdAt: 'created_at' } });



module.exports = model('Album', album);
