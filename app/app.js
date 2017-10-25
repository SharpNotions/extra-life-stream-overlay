const cfg = require('./config');
const http = require('http');
const path = require('path');
const express = require('express');
const hbs = require('express-handlebars');
const SocketServer = require('socket.io');

const routes = require('./routes/routes');
const sockets = require('./sockets/sockets');

const appRootDir = __dirname;
const staticDir = path.join(appRootDir, 'content');
const viewsDir = path.join(appRootDir, 'views');
const layoutsDir = path.join(appRootDir, 'views', 'layouts');
const partialsDir = path.join(appRootDir, 'views', 'layouts');

const webapp = express();
const server = http.createServer(webapp);
const io = SocketServer(server);
const publicSockets = io.of('/public');
const extraLife = require('./el');

webapp.set('views', viewsDir);
webapp.engine('hbs', hbs({
  extname: '.hbs',
  layoutsDir: layoutsDir,
  partialsDir: partialsDir,
  defaultLayout: 'main.hbs'
}));
webapp.set('view engine', 'hbs');
webapp.use('/content', express.static(staticDir));

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
