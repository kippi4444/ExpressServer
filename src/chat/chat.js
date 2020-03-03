const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const dialogService = require('../services/dialog-message-service');
const userService = require('../services/user-service');
require('events').EventEmitter.defaultMaxListeners = 25;

async function start() {

let sockets  = [];
let room = [];
// ===== GeneralChannelStart ========= //
    io.on('connection', (generalSocket) => {
        generalSocket.on('addSession', function(session) {
            generalSocket.session = session;
            userService.changeStatus({id: session.sender, online: true});
            if(!sockets.includes(generalSocket)) {
                sockets.push(generalSocket);
            }
// =================== NameSpacesStart ======= //
            io.of('/private').on('connection', (socket) => {
                socket.on('goRoom', function(session) {
                    socket.session = session;
                    if(!room.includes(socket)) {
                        room.push(socket);
                        socket.join(session.dialog._id);
                        socket.on('chat message', function(msg){
                            async function fu(){
                                try {
                                  let res = await dialogService.addMes(msg);
                                  if (res){
                                    io.of('private').to(session.dialog._id).emit('chat message', res);
                                    socket.session.dialog.person.forEach(user => {
                                        if (user !== msg.user){
                                            const userSocket = sockets.filter(sckt => {
                                                return sckt.session.sender === user});
                                            if (userSocket.length > 0){
                                                userSocket.forEach(usr => {
                                                    io.to(`${usr.id}`).emit('message', res);
                                                });
                                            }
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
                    }
                    socket.on(('disconnect'), function () {
                        socket.leave(socket.session.dialog._id);
                        room = room.filter(room => room !== socket);
                        socket.removeAllListeners();
                    });
                });

            });
// =================== NameSpacesEnd ======= //
        });
        generalSocket.on(('disconnect'), function () {
            if (generalSocket.session){
                userService.changeStatus({id: generalSocket.session.sender, online: false});
            }
            sockets = sockets.filter(socket => socket !== generalSocket);
            generalSocket.removeAllListeners();
        });
    });
// ===== GeneralChannelEnd ========= //


http.listen(8080, () => {
    console.log('chat started')});
}

start().then().catch(e => console.log(e));


