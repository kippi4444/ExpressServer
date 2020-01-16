const express = require('express');
const userRouter = require('./router/user');
const mongoose = require('mongoose');



const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/', userRouter);

try {
    mongoose.connect('mongodb://127.0.0.1:27017/users', {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    });
    app.listen(8000, () => {
        console.log('server on port ' + 8000);
    });
} catch (e) {
    console.log(e);
}

