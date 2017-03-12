var express = require("express");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


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
	console.log("se conecto: ",socket.id)
	socket.on('user image',function(image){
		io.sockets.emit('addimage',image.user,image.file);
	});
	socket.on('new message',function(newMessage){
		io.sockets.emit('newmessage',newMessage.user,newMessage.message);
	});
});