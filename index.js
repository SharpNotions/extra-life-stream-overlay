const app = require('./app/app.js');
const copyFile = require('./copyFile');

app.server.listen(3000, function(){
  console.info("Server is now listening on port 3000");
  app.extraLifeApi.monitor.startPolling();
  
  //copy in a few content assets
  copyFile([
    './node_modules/popmotion/dist/popmotion.min.js'
  ], './app/content/').catch(err => {
    console.error('Unhandled error copying files.');
    console.error(err);
  });
});