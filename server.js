const static = require('node-static');
const http = require('http');
const socketIO = require('socket.io');
const _ = require('underscore');

const fileServer = new(static.Server)();
const app = http.createServer(function (req, res) {
fileServer.serve(req, res);
}).listen(2013, () => { console.log(`Server running at http://127.0.0.1:2013/`); });
const io = socketIO.listen(app);
let rooms=[];
io.sockets.on('connection', function (socket){
    if (io.sockets.connected[socket.id]) {
        _.findWhere(io.sockets.sockets, { id: socket.id }).emit('login', socket.id);
    }
    socket.on('message', function (mes) {
        console.log(mes)
        switch (mes.d){
            case "all":mes.r ? io.to(mes.r).emit("message", mes) : io.emit("message", mes);break;
            case "del":const player = _.findWhere(io.sockets.sockets, { id: mes.id });
                player && (mes.r ? player.leave(mes.r) : player.disconnect(true)) ;break;
            default: mes.r ? socket.broadcast.to(mes.r).emit('message', mes):socket.broadcast.emit('message', mes);
        }
    });
    socket.on('create or join', function (room) {
        var numClients = io.nsps['/'].adapter.rooms[room];
        if (numClients === undefined) {
            socket.join(room); rooms[rooms.length]=room;
            console.log(1,rooms,room)
            socket.emit('created', room);
            socket.emit('joined', { id: socket.id, room: room ,bool:false} );
        } else if (numClients.length < 3) {
            socket.join(room);
            socket.emit('joined', { id: socket.id, room: room, bool: true});
            socket.emit('getRoomPlayers', Object.keys(numClients.sockets));//通知自己获取房间的所有用户
            socket.broadcast.to(room).emit('playerCome', socket.id );//通知其他人我进来了
            if (numClients.length === 2)io.sockets.in(room).emit('ready');//获取在该房间的所有客户端
        }else { //最多3个玩家，超过了会提示客户端人满了。
            socket.emit('full', room);
        }
        socket.emit('log', 'Room ' + room + ' has ' + numClients + ' socket(s)');
    });
    socket.on("leaveRoom", function (room) {
        socket.leave(room);
        var numClients = io.nsps['/'].adapter.rooms[room];
        numClients = numClients ? numClients.length : 0;
        if (numClients === 0){
            io.emit("destroyRoom", room); 
            rooms.remove(rooms.findIndex(v => v === room));
            console.log("destroyRoom:"+rooms)
        }
        socket.emit("leaveRoom", room, socket.id)
    })
    socket.on("getRooms", function () {
        socket.emit("getRooms", rooms);
    })
    socket.on("getUsers", function () {
        socket.broadcast.emit('io', socket.id)
        var list = Object.keys(io.nsps['/'].adapter.rooms)
        if (rooms.length > 0) {
            for (i in rooms) {
                list.remove(list.findIndex(v => v === rooms[i]))
            }
        }
        socket.emit("getUsers", list);
    })
    socket.on("disconnect", function () {
        socket.broadcast.emit('exit', socket.id)
    });
});

Array.prototype.remove = function (from) {
    var rest = this.slice(from + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};