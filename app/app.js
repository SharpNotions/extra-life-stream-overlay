const cfg = require('./config');
var http = require('http');
var path = require('path');
var express = require('express');
var hbs = require('express-handlebars');
var SocketServer = require('socket.io');

var routes = require('./routes/routes');
var sockets = require('./sockets/sockets');

var appRootDir = __dirname;
var staticDir = path.join(appRootDir, 'content');
var viewsDir = path.join(appRootDir, 'views');
var layoutsDir = path.join(appRootDir, 'views', 'layouts');
var partialsDir = path.join(appRootDir, 'views', 'layouts');

var webapp = express();
var server = http.createServer(webapp);
var io = SocketServer(server);
var publicSockets = io.of('/public');
var extraLife = require('./el');

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