var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/test', function(req, res){
    res.send(listUser);
  });

var listUser = [{ver: "1.5",
name: "Cupcake",
api: "API level 3",
link:"https://imgur.com/a/Zrm63MQ"},{ver: "1.5",
name: "Cupcake",
api: "API level 4",
link:"https://imgur.com/a/Zrm63MQ"},{ver: "1.5",
name: "Cupcake",
api: "API level 5",
link:"https://imgur.com/a/Zrm63MQ"}];
  
io.on("connection", function(socket){
    console.log(socket.id+" is connecting...");

    socket.on("client-create-user",function(data){
        if(listUser.indexOf(data)>-1){
            socket.emit("server-user-exist");
        }else{
            listUser.push(data);
            socket.Username = data;
            listUser.forEach(function(item){
                console.log("server:"+item);
            })
            socket.emit("server-create-success",data);

            io.emit("server-update-list-user",listUser);
        }
    });

    socket.on("client-send-message",function(data){
        io.emit("server-update-message",{user:socket.Username,data:data});
    });

    socket.on("user-request-yellow",function(data){
        console.log(data);
        socket.broadcast.emit("server-response",data);
    });

    socket.on("disconnect",function(){
        console.log(socket.Username+" is disconnecting...");
        listUser.splice(listUser.indexOf(socket.Username), 1);

        io.emit("server-update-list-user",listUser);

        // console.log(socket.id+" is disconnecting...");
    });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});