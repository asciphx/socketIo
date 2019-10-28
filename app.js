const s = require('node-static'),o = require('os'),h = require('http'),
socketIO = require('socket.io'),_ = require('underscore');
const fileServer = new(s.Server)(),app = h.createServer((req, res)=>{
  fileServer.serve(req, res);
}).listen(2013, () => { console.log(`Server running at http://127.0.0.1:2013/`); });
const io = socketIO.listen(app);
let rooms = new Array(), userNum = 0,users = {}
io.sockets.on('connection', socket => {
  socket.emit('login', socket.id);userNum++; users[socket.id]=1;
  socket.on('message', mes => {
    console.log(mes)
    switch (mes.d){
      case "all":mes.r ? io.to(mes.r).emit("message", mes) : io.emit("message", mes);break
      case "del":mes.r ? socket.leave(mes.r) : socket.disconnect(true) ;break
      default: mes.r ? socket.broadcast.to(mes.r).emit('message', mes):socket.broadcast.emit('message', mes)
    }
  });
  socket.on('create or join', room=> {
    const num = io.nsps['/'].adapter.rooms[room]
    if (num === undefined) {let obj = {}
      socket.join(room); io.emit('created', room);
      Object.defineProperty(obj, room, {
        enumerable: true,
        configurable: false,
        writable: true,
        value: new Array(socket.id)
      });
      rooms.push(obj); 
      socket.emit('joined', socket.id, room )
    } else if (num.length < 4) {
      rooms[rooms.findIndex(v => Object.keys(v)[0] === room)][room].push(socket.id)
      socket.emit('getRoomPlayers', Object.keys(num.sockets));
      socket.join(room); socket.emit('joined', socket.id, room)
      socket.broadcast.to(room).emit('playerCome', socket.id )
      if (num.length === 4)io.sockets.in(room).emit('ready')
    }else {
      socket.emit('full', room);
    }
    socket.emit('log', '房间：' + room + ' 有 ' + (num ? num.length:1) + '个用户');
  });
  socket.on("leaveRoom", room => { if (room === "") return;
    const idex = rooms.findIndex(v => Object.keys(v)[0] === room)
    let players = rooms[idex][room]
    players.splice(players.findIndex(v => v === socket.id),1)
    io.to(room).emit("leaveRoom", room, socket.id);socket.leave(room)
    if (io.nsps['/'].adapter.rooms[room] === undefined){
      io.emit("destroyRoom", room);
      rooms.splice(idex, 1)
    }
  })
  socket.on("getRooms", () => {let list=[];
    rooms.forEach(v=>{list.push(Object.keys(v)[0])})
    socket.emit("getRooms", list )
  })
  socket.on("getUsers", bool => {
    if (bool) socket.broadcast.emit('userCome', socket.id, userNum)
    socket.emit("getUsers", Object.keys(users), userNum);
  })
  socket.on('IPv4', () => {
    var ifaces = o.networkInterfaces();
    for (dev in ifaces) {
      ifaces[dev].forEach(details=> {
        if (details.family === 'IPv4' && details.address !== '127.0.0.1') {
          socket.emit('IPv4', details.address)
        }
      });
    }
  });
  socket.on("disconnect", () => {userNum--;delete users[socket.id];
    const idex = rooms.findIndex(v => Object.entries(v)[0][1].toString().indexOf(socket.id) > -1)
    if (idex === -1) { socket.broadcast.emit('exit', socket.id); return; } 
    const room = Object.keys(rooms[idex])[0];
    if (io.nsps['/'].adapter.rooms[room] === undefined) {
      rooms.splice(idex, 1)
      socket.broadcast.emit('exit', socket.id, true);
      return
    } else socket.broadcast.to(room).emit("leaveRoom", room, socket.id)
    socket.broadcast.emit('exit', socket.id)
  });
  socket.on("shuffle", (room, arr) => {
    var rnd, temp;
    for (i in arr) {
      rnd = Math.random() * i | 0;
      temp = arr[i];
      arr[i] = arr[rnd];
      arr[rnd] = temp;
    }
    io.to(room).emit("shuffle", arr)
  })
  socket.on("intro", room => {
    io.to(room).emit("intro")
  })
  socket.on("bysuit", room => {
    io.to(room).emit("bysuit")
  })
  socket.on("poker", room => {
    io.to(room).emit("poker")
  })
  socket.on("fan", room => {
    io.to(room).emit("fan")
  })
  socket.on("sort", room => {
    io.to(room).emit("sort")
  })
});
exports.delUser = function (id){
  if (io.sockets.connected[id]) {
    _.findWhere(io.sockets.sockets, { id: id }).disconnect(true);
  }
}