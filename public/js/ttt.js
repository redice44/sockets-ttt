var socket = io.connect();
var game = [null, null, null, null, null, null, null, null, null];
var cells = document.querySelectorAll('.cell');
var gameId = document.getElementById('game').dataset.gameId;
var me = document.getElementById('game').dataset.player;
var yourTurn;
var completed;

socket.emit('load', { gameId: gameId });

for (var cell of cells) {
  cell.addEventListener('click', (e) => {
    var index = e.currentTarget.dataset.cell;

    if (!game[index] && yourTurn && !completed) {
      socket.emit('move', { gameId: gameId, index: index });
    }

  });
}

socket.on('update', (data) => {
  console.log(data);
  if (data.gameId === gameId) {
    yourTurn = data.player === me;
    game = data.game;
    completed = data.completed
    for (let i = 0; i < cells.length; i++) {
      cells[i].innerText = game[i];
    }

    if (completed) {
      document.getElementById('title').innerText = `${completed} Wins!`;
    }
  }
});