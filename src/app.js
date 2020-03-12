require('dotenv').config({path:"./config.env"});
const express = require('express');
const userRouter = require('./routers/user');
const cors = require('cors');
const petRouter = require('./routers/pet');
const albumRouter = require('./routers/album');
const photoRouter = require('./routers/photo');
const friendRouter = require('./routers/friend');
const diologRouter = require('./routers/dialog');
const mongoose = require('mongoose');
const app = express();
const Port = process.env.PORT | 8000;




app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/files', express.static('public'));
app.use('/users', userRouter);
app.use('/pets', petRouter);
app.use('/albums', albumRouter);
app.use('/photos', photoRouter);
app.use('/friends', friendRouter);
app.use('/dialogs', diologRouter);


try {
    mongoose.connect(process.env.MONGO_DB, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useCreateIndex: true
    });
    app.listen(Port, () => {
        console.log('server on port ' + Port);
        const chat = require('./chat/chat');
    });

} catch (e) {
    console.log(e);
}

