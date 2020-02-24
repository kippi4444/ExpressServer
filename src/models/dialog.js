const  {Schema, model} = require('mongoose');

const dialog = new Schema ({
    title: String,
    person: [{id: {
            type: Schema.Types.ObjectId,
            require: true,
            ref: 'User'}
        }]

});

module.exports = model('Dialog', dialog);
