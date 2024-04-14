const express = require('express');
const fs = require('fs');
const app = express();
require('dotenv').config();
const http = require('http').createServer(app);
const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  fs.readFile(__dirname + '/public/ok.html', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.send(data);
  });
});

const io = require('socket.io')(http);

io.on('connection', (socket) => {
  console.log('connected...');

  socket.on('message', (msg) => {
    // console.log(msg);
    socket.broadcast.emit('message', msg);
  });
});
