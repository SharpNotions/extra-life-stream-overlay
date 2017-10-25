const app = require('./app/app.js');

app.server.listen(3000, function(){
  console.info("Server is now listening on port 3000");
  app.extraLifeApi.monitor.startPolling();
});