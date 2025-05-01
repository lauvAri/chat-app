import {Server} from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);

// 记录在线用户 {userId:socketId}
const onlineUsersMap = {}

export function getReceiverSocketId(userId) {
    return onlineUsersMap[userId]
}

const io = new Server(server, {
    cors: {
        origin:['http://localhost:5173'],
    }
});

// on(event, listener)
io.on('connection', (socket) => {
    console.log('a user connected.', "socket id:", socket.id);
    // 通过握手获取登陆用户的id
    const userId = socket.handshake.query.userId;
    if (userId) {
        onlineUsersMap[userId] = socket.id;
    }

    // 广播给其他用户
    io.emit('getOnlineUsers', Object.keys(onlineUsersMap));

    socket.on('disconnect',()=>{
        console.log('a user disconnected', socket.id);
        delete onlineUsersMap[userId]; // 删除这个键值对
        io.emit('getOnlineUsers', Object.keys(onlineUsersMap));
    })
});

export {io, app, server};
