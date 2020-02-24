const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const dialogService = require('../services/dialog-message-service');


async function start() {

let  nameSpaces = await dialogService.getAllDialogs();

let sockets  = [];
    io.on('connection', (socket) => {
        socket.on('addSession', function(session) {
            socket.session = session;
            console.log('user joined');
            if(!sockets.includes(socket)){
                sockets.push(socket);
            }
for (let space of nameSpaces){
    io.of(space.id).on('connection', (socket) => {

            console.log('user joined');
            socket.on(('disconnect'), function () {
                console.log('user disconnected')   ;
            });

            socket.on('chat message', function(msg){
                io.of(msg.dialog).emit('chat message', msg);
                 (async function (){await dialogService.addMes(msg);})();

            });

    });
}
        });
    });

http.listen(8080, () => {
    console.log('chat started')});
}
start();


