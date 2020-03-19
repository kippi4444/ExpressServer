const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const dialogService = require('../services/dialog-message-service');
const userService = require('../services/user-service');
const photoService = require('../services/photo-service');
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

io.on('connection', function connection(socket) {
        const sender = socket.handshake.query.sender;
        let room = '';
        userService.changeStatus({id: sender, online: true});

        socket.on(('goRoom'), function goRoom(dialog) {
            room = dialog;
            socket.join(dialog.dialog);
            async function updateMes(){
                try {
                    await dialogService.editMes(dialog);

                }
                catch (e) {
                    console.log(e)
                }
            }
            updateMes();

        });
        socket.on(('getAllMes'), function(dialog) {
        async function allMes(){
            try {
                let res = await dialogService.getMessages(dialog);
                io.to(`${socket.handshake.query.sender}`).emit('allMes', res[0]);
                if(io.sockets.adapter.rooms[room.dialog]){
                    const allConnected = Object.keys(io.sockets.adapter.rooms[room.dialog].sockets).filter(user => user !== room.sender);
                    if (allConnected.length) {
                        io.to(`${room.sender}`).emit('message', {event: 'isRead', mes:{dialog:room.dialog}});
                    }
                    allConnected.forEach( user =>{
                        io.to(`${user}`).emit('message', {event: 'isRead', mes:{dialog:room.dialog}});
                    });
                }

            }
            catch (e) {
                console.log(e)
            }
        }
        allMes();
         });
        socket.on(('getScrollMes'), function(dialog) {
            async function scrollMes(){
                try {
                    let res = await dialogService.getMessages(dialog);
                    if (res[0]){
                        io.to(`${socket.handshake.query.sender}`).emit('scrollMes', res[0]);
                    }
                }
                catch (e) {
                    console.log(e)
                }
            }
            scrollMes();
        });
        socket.on('chat message', function(msg){
            async function mes(){
                try {
                    let res = await dialogService.addMes(msg);
                    if (res){

                        io.to(room.dialog).emit('chat message', res);

                        msg.dialog.person.forEach(user => {
                            if (user !== msg.user){

                                io.to(`${user}`).emit('message', {event: 'newMes', mes: res});

                            }
                        });
                    }
                }
                catch (e) {
                    console.log(e)
                }
            }
            mes();
        });
        socket.on('read', function (user) {
            dialogService.editMes({dialog: room.dialog, sender: socket.handshake.query.sender});
            io.to(`${user}`).emit('message', {event: 'isRead', mes:{}})
        });
        socket.on('addLike', async function (photo) {
            try {
               const result = await photoService.addLike(photo);
                io.to(`${photo.photo.owner._id}`).emit('message', {event: 'newLike', mes: {photo: photo.photo, who: photo.like, like: result}})
                io.to(`${photo.like._id}`).emit('message', {event: 'yourLike', mes: {photo: photo.photo, who: photo.like, like: result}})
            }catch (e) {
            }
        });
        socket.on(('leftRoom'), function () {
            socket.leave(room.dialog);
        });
        socket.on(('notification'), function (notification) {
            io.to(`${notification.mes.id}`).emit('message',  notification);
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


