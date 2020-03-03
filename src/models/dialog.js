const  {Schema, model} = require('mongoose');

const dialog = new Schema ({
    title: String,
    person: [{
            type: Schema.Types.ObjectId,
            require: true
            }]

});

module.exports = model('Dialog', dialog);
