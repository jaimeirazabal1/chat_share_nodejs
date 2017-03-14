var express = require("express");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var users = [];

app.use('/static',express.static(__dirname+'/static'));
app.set('views',__dirname+'/views');
app.set('view engine','jade');




app.get('/',function(req,res){
	res.render('home');
});

http.listen(3000,function(){
	console.log("Listen port 3000");
});

//sockets
io.on('connection',function(socket){
	//console.log("se conecto: ",socket.id)
	io.sockets.connected[socket.id].emit("newid",socket.id);

	socket.on('user image',function(image){
		io.sockets.emit('addimage',image.user,image.file);
	});
	socket.on('new user',function(user){
		console.log("user id:",user)
		users.push({
			id:user.id,
			nickname:user.newuser
		});
		io.sockets.emit("refreshusers",users);
		console.log(users);
	});
	socket.on('new message',function(newMessage){
		io.sockets.emit('newmessage',newMessage.user,newMessage.message);
	});
	socket.on("writing",function(id){
          	for (i = 0; i < users.length; i++) { 
          		if (users[i]) {

		          	if (users[i].id == id.id) {
		          		for (var j = 0; j <users.length ; j++) {

		          			if (users[j] && users[j].id != id.id) {

		          				io.sockets.connected[users[j].id].emit("write","Esta Escribiendo "+users[i].nickname);
		          			}
		          		}
		          		
		          	}
          		}
			}		
	});
	socket.on("writingstop",function(id){
          	for (i = 0; i < users.length; i++) { 
          		if (users[i]) {

		          	if (users[i].id == id.id) {
		          		io.sockets.emit("writestop","");
		          		
		          	}
          		}
			}		
	});
	socket.on ( "disconnect" , function ()
       {
          
          console.log(users);
          	for (i = 0; i < users.length; i++) { 
          		if (users[i]) {

		          	if (users[i].id == socket.id) {
		          		io.sockets.emit("disconnect",users[i].nickname);
		          		delete users[i]
		          		console.log("Se borró una vaina!");
		          	}
          		}
			}
          console.log(users);
          
          io.sockets.emit("refreshusers",users);

       })
});