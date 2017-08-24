const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const path = require('path');

const appPort = process.env.PORT || 4444;

app.get('/', (req, res) => {
  return res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('New connection');

  socket.emit('news', { data: 'Hello World' });

  socket.on('my-other-event', (data) => {
    console.log(data);
  });

  socket.on('disconnect', () => {
    console.log('Disconnected');
  });
});

server.listen(appPort, () => {
  console.log(`Server listening on ${appPort}.`);
});


// var app = require('express')();
// var http = require('http').Server(app);
// var io = require('socket.io')(http);

// app.get('/', function(req, res){
//   res.sendFile(__dirname + '/index.html');
// });

// io.on('connection', function(socket){
//   console.log('a user connected');

//   socket.on('disconnect', () => {

//   })
// });

// http.listen(3000, function(){
//   console.log('listening on *:3000');
// });