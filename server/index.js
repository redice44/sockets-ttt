const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const path = require('path');

const appPort = process.env.PORT || 4444;

app.set('view engine', 'pug');
app.set('views', './server/views')
app.use(express.static(path.join(__dirname, '..', 'public')));

// app.get('/', (req, res) => {
//   return res.render('game');
// });

app.get('/:gameId/:player', (req, res) => {
  let player = req.params.player === 'one' ? 'O' : 'X';

  return res.render('game', { player: player, gameId: req.params.gameId });
});

let games = {};
let players = {};

io.on('connection', (socket) => {
  console.log('New connection');

  socket.on('load', (data) => {
    if (!games[data.gameId]) {
      games[data.gameId] = [null, null, null, null, null, null, null, null, null];
      players[data.gameId] = true;
    }
    socket.emit('update', { gameId: data.gameId, game: games[data.gameId], player: players[data.gameId] ? 'O' : 'X' });
  });

  socket.on('move', (data) => {
    console.log(`Move: ${data.gameId} - ${data.index}`);
    games[data.gameId][data.index] = players[data.gameId] ? 'O' : 'X';
    players[data.gameId] = !players[data.gameId];
    io.emit('update', { gameId: data.gameId, game: games[data.gameId], player: players[data.gameId] ? 'O' : 'X' });
  });

  socket.on('disconnect', () => {
    console.log('Disconnected');
  });
});

server.listen(appPort, () => {
  console.log(`Server listening on ${appPort}.`);
});
