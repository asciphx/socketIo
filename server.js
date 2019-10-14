const s = require('node-static'),o = require('os'),h = require('http'),
socketIO = require('socket.io'),_ = require('underscore');
Array.prototype.remove = function (f) {const r = this.slice(f + 1 || this.length); 
  this.length = f < 0 ? this.length + f : f;return this.push.apply(this, r)}
let rooms = new Array(),userNum=0;
const fileServer = new(s.Server)();
const app = h.createServer((req, res)=>{
fileServer.serve(req, res);
}).listen(2013, () => { console.log(`Server running at http://127.0.0.1:2013/`); });
const io = socketIO.listen(app);
io.sockets.on('connection', (socket) => {
  // if (io.sockets.connected[socket.id]) {
  //   _.findWhere(io.sockets.sockets, { id: socket.id }).emit('login', socket.id);
  // }
  socket.emit('login', socket.id);
  socket.on('message', (mes) => {
    console.log(mes)
    switch (mes.d){
      case "all":mes.r ? io.to(mes.r).emit("message", mes) : io.emit("message", mes);break;
      case "del":const player = _.findWhere(io.sockets.sockets, { id: mes.id });
          player && (mes.r ? player.leave(mes.r) : player.disconnect(true)) ;break;
      default: mes.r ? socket.broadcast.to(mes.r).emit('message', mes):socket.broadcast.emit('message', mes);
    }
  });
  socket.on('create or join',  (room) => {
    let num = io.nsps['/'].adapter.rooms[room];
    if (num === undefined) {
      socket.join(room); io.emit('created', room);rooms.push(room); 
      socket.emit('joined', socket.id, room );
    } else if (num.length < 3) {
      socket.join(room);
      socket.emit('joined', socket.id, room );
      socket.emit('getRoomPlayers', Object.keys(num.sockets));
      socket.broadcast.to(room).emit('playerCome', socket.id );
      if (num.length === 3)io.sockets.in(room).emit('ready');
    }else {
      socket.emit('full', room);
    }
    socket.emit('log', '房间：' + room + ' 有 ' + (num ? num.length:1) + '个用户');
  });
  socket.on("leaveRoom", (room) => {if(room==="")return;
    io.to(room).emit("leaveRoom", room, socket.id);
    socket.leave(room);
    let num = io.nsps['/'].adapter.rooms[room];
    num = (num ? num.length : 0);
    if (num === 0){
      io.emit("destroyRoom", room); 
      rooms.remove(rooms.findIndex(v => v === room));
    }
  })
  socket.on("getRooms", () => {
    socket.emit("getRooms", rooms);
  })
  socket.on("getUsers", (bool) => {
    let list = io.nsps['/'].adapter.rooms,users = [];
    for(i in list){
      if (i.length === 20) users.push(i);
    }; userNum = users.length;
    if (bool) socket.broadcast.emit('userCome', socket.id, userNum)
    socket.emit("getUsers", users, userNum);
  })
  socket.on('IPv4', () => {
    var ifaces = o.networkInterfaces();
    for (dev in ifaces) {
      ifaces[dev].forEach(function (details) {
        if (details.family === 'IPv4' && details.address !== '127.0.0.1') {
          socket.emit('IPv4', details.address);
        }
      });
    }
  });
  socket.on("disconnect", () => {
    for (i in rooms) {
      if(typeof rooms[i]==='function')break;
      io.to(rooms[i]).emit("leaveRoom", rooms[i], socket.id);
      if (io.nsps['/'].adapter.rooms[rooms[i]] === undefined){
        rooms.remove(rooms.findIndex(v => v === rooms[i]));
        socket.broadcast.emit('exit', socket.id,true);
        return;
      }
    }
    socket.broadcast.emit('exit', socket.id,false);
  });
});