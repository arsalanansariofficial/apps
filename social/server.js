const next = require('next');
const { Server } = require('socket.io');
const { createServer } = require('node:http');

const port = 3000;
const hostname = 'localhost';
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(function () {
  const httpServer = createServer(handler);
  const io = new Server(httpServer);

  io.on('connection', function (socket) {
    console.log('New client connected');
    socket.on('broadcast', function (msg) {
      console.log(`Received message: ${msg}`);
      socket.broadcast.emit('notify', msg);
    });
  });

  httpServer
    .once('error', function (error) {
      console.error(error);
      process.exit(1);
    })
    .listen(port, function () {
      console.log(`Ready on http://${hostname}:${port}`);
    });
});
