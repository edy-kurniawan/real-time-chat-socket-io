const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// set view engine
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/', (req, res) => {

    io.emit('chat message', req.body.message);

    return res.json({
        message: req.body
    });
});

io.on('connection', (socket) => {
  console.log('a user connected : '+ socket.id) ;

  //on message
  socket.on('chat message', (message) => {
    console.log(message);

    messageWithUsername = {
      message: message.message,
      username: message.username,
      timestamp: new Date()
    };

    //broadcast message
    io.emit('chat message', messageWithUsername);
  });

});

server.listen(3000, () => {
  console.log('listening on *:3000');
});