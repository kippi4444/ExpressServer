const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const dialogService = require('../services/dialog-message-service');
const userService = require('../services/user-service');
require('events').EventEmitter.defaultMaxListeners = 25;

async function start() {

io.engine.generateId = function (socket) {
    // generate a new custom id
    return socket._query.sender
};

io.use(function(socket, next) {
    if (socket.handshake.query.sender !== undefined) {
        next();
    } else {
        next(new Error('WRONG SOCKET'));
    }
});

io.of('/main').on('connection', function connection(socket) {
        const sender = socket.handshake.query.sender;
        let room = '';
        userService.changeStatus({id: sender, online: true});

        socket.on(('goRoom'), function goRoom(dialog) {
            room = dialog;
            socket.join(dialog.dialog);
        });
        socket.on('chat message', function(msg){
            async function fu(){
                try {
                    let res = await dialogService.addMes(msg);
                    if (res){
                        io.of('main').to(room.dialog).emit('chat message', res);
                        msg.dialog.person.forEach(user => {
                            if (user !== msg.user){
                                io.of('main').to(`/main#${user}`).emit('message', {event: 'newMes', mes: res});

                            }
                        });
                    }
                }
                catch (e) {
                    console.log(e)
                }
            }
            fu();
        });
        socket.on(('leftRoom'), function () {
            socket.leave(room.dialog);
        });
        socket.on(('notification'), function (notification) {
            io.of('main').to(`/main#${notification.mes.id}`).emit('message',  notification);
        });

        socket.on(('disconnect'), function () {
            userService.changeStatus({id: sender, online: false});
            socket.removeListener('connection', connection);
            socket.disconnect();
        });
    });



http.listen(8080, () => {
    console.log('chat started')});
}

start().then().catch(e => console.log(e));


