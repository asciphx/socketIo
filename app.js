const s = require('node-static'),o = require('os'),h = require('http'),
socketIO = require('socket.io'),_ = require('underscore');
const fileServer = new(s.Server)(),app = h.createServer((req, res)=>{
  fileServer.serve(req, res);
}).listen(2013, () => { console.log(`Server running at http://127.0.0.1:2013/`); });
const io = socketIO.listen(app);
//修正，当用户失去连接的时候，只给用户所在的房间发送用户离开房间的指令（以往是通知所有房间浪费性能）
//当用户退出某个房间，房间组的那个房间内部用户组也会更新
let rooms = new Array(), userNum = 0;
io.sockets.on('connection', socket => {
  // if (io.sockets.connected[socket.id]) {
  //   _.findWhere(io.sockets.sockets, { id: socket.id }).emit('login', socket.id);
  // }
  socket.emit('login', socket.id);
  socket.on('message', mes => {
    console.log(mes)
    switch (mes.d){
      case "all":mes.r ? io.to(mes.r).emit("message", mes) : io.emit("message", mes);break
      case "del":const player = _.findWhere(io.sockets.sockets, { id: mes.id });
          player && (mes.r ? player.leave(mes.r) : player.disconnect(true)) ;break
      default: mes.r ? socket.broadcast.to(mes.r).emit('message', mes):socket.broadcast.emit('message', mes)
    }
  });
  socket.on('create or join', room=> {
    let num = io.nsps['/'].adapter.rooms[room]
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
    } else if (num.length < 3) {
      rooms[rooms.findIndex(v => Object.keys(v)[0] === room)][room].push(socket.id)
      socket.join(room);socket.emit('joined', socket.id, room )
      socket.emit('getRoomPlayers', Object.keys(num.sockets))
      socket.broadcast.to(room).emit('playerCome', socket.id )
      if (num.length === 3)io.sockets.in(room).emit('ready')
    }else {
      socket.emit('full', room);
    }
    socket.emit('log', '房间：' + room + ' 有 ' + (num ? num.length:1) + '个用户');
  });
  socket.on("leaveRoom", room => { if (room === "") return;
    let idex = rooms.findIndex(v => Object.keys(v)[0] === room)
    let players = rooms[idex][room]
    players.splice(players.findIndex(v => v === socket.id),1)
    io.to(room).emit("leaveRoom", room, socket.id)
    socket.leave(room)
    let num = io.nsps['/'].adapter.rooms[room]
    num = (num ? num.length : 0)
    if (num === 0){
      io.emit("destroyRoom", room);
      rooms.splice(idex, 1)
    }
  })
  socket.on("getRooms", () => {let list=[];
    rooms.forEach(v=>{list.push(Object.keys(v)[0])})
    socket.emit("getRooms", list )
  })
  socket.on("getUsers", bool => {
    let list = io.nsps['/'].adapter.rooms,users = [];
    for(i in list){
      if (i.length === 20) users.push(i)
    }; userNum = users.length
    if (bool) socket.broadcast.emit('userCome', socket.id, userNum)
    socket.emit("getUsers", users, userNum);
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
  socket.on("disconnect", () => {
    const idex = rooms.findIndex(v => Object.entries(v)[0][1].toString().indexOf(socket.id) > -1)
    if (idex === -1) { socket.broadcast.emit('exit', socket.id); return; } 
    const apartment = Object.keys(rooms[idex])[0];
    let room = io.nsps['/'].adapter.rooms[apartment];
    if (room === undefined) {
      rooms.splice(idex, 1)
      socket.broadcast.emit('exit', socket.id, true);
      return
    } else socket.broadcast.to(apartment).emit("leaveRoom", apartment, socket.id)
    socket.broadcast.emit('exit', socket.id)
  });
});