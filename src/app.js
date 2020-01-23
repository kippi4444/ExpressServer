const express = require('express');
const userRouter = require('./routers/user');
const petRouter = require('./routers/pet');
const uploadRouter = require('./routers/upload');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/files', express.static('public'));
app.use('/users', userRouter);
app.use('/pets', petRouter);
app.use('/upload', uploadRouter);

try {
    mongoose.connect('mongodb://127.0.0.1:27017/users', {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useCreateIndex: true
    });
    app.listen(8000, () => {
        console.log('server on port ' + 8000);
    });

} catch (e) {
    console.log(e);
}

