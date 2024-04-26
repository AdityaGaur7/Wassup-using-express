const express = require('express');
const fs = require('fs');
const http = require('http');
const socketIO = require('socket.io');
require('dotenv').config();
const Ably = require('ably');
const app = express();
const server = http.createServer(app);
const ABLY_API_KEY = 'URT3Fg.GHgyhQ:j1nh_Z3iQeTl0JYO_wlcXwz-H1FR6Fz0Lc-IIlBPFYE';
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

async function publishSubscribe() {

  const ably = new Ably.Realtime(ABLY_API_KEY)
  ably.connection.once("connected", () => {
    console.log("Connected to Ably!")
  })

  const channel = ably.channels.get("get-started")
  await channel.subscribe("first", (message) => {
    console.log("Message received: " + message.data)
  });

  await channel.publish("first", "Here is my first message!")

  // setTimeout(async () => {
  //   ably.connection.close();
  //     await ably.connection.once("closed", function () {
  //       console.log("Closed the connection to Ably.")
  //     });
  // }, 5000);
}
publishSubscribe();

io.on('connection', (socket) => {
  console.log('Connected to a client');

  socket.on('message', (msg) => {
    socket.broadcast.emit('message', msg);
  });
});
