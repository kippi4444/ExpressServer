const express = require('express');
const userRouter = require('./router/user');


const app = express();

app.use(express.json());
app.use('/', userRouter);
app.listen(8000, () => {
    console.log('server on port ' + 8000);
});