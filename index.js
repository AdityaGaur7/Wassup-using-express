const express = require('express');
const fs = require('fs');
const http = require('http');
const socketIO = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    credentials: true,
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
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

io.on('connection', (socket) => {
  console.log('Connected to a client');

  socket.on('message', (msg) => {
    socket.broadcast.emit('message', msg);
  });
});
