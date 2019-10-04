const http = require('http');
const path = require('path');
const express = require('express');
const SocketServer = require('socket.io');
const favicon = require('serve-favicon');

const routes = require('./routes/routes');
const sockets = require('./sockets/sockets');

const appRootDir = __dirname;
const staticDir = path.join(appRootDir, 'content');
const viewsDir = path.join(appRootDir, 'views');

const webapp = express();
const server = http.createServer(webapp);
const io = SocketServer(server);
const publicSockets = io.of('/public');
const extraLife = require('./el');

webapp.set('views', viewsDir);
webapp.set('view engine', 'ejs');
webapp.engine('ejs', require('ejs').renderFile);
webapp.use('/content', express.static(staticDir));
webapp.use(favicon(__dirname + '/favicon.ico'));

//initialize routes
routes(webapp);
//initialize sockets
sockets.public(publicSockets);

module.exports = {
  web: webapp,
  server: server,
  publicSockets: publicSockets,
  extraLifeApi: extraLife
};
