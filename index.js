const os = require('os');
const app = require('./app/app.js');
const copyFile = require('./copyFile');

app.server.listen(3000, function(){
  console.info("Server is now listening on:");
  
  const netInfo = os.networkInterfaces();
  Object.keys(netInfo)
    .map(key => {
      return netInfo[key].filter(nfo => nfo.family === 'IPv4');
    })
    .reduce((acc, item) => {
      acc.push(...item);
      return acc;
    }, [])
    .forEach(nfo => {
      console.log(`    http://${nfo.address}:3000`);
    });

  app.extraLifeApi.monitor.startPolling();
  

  //copy in a few content assets
  copyFile([
    './node_modules/popmotion/dist/popmotion.global.min.js',
    './node_modules/dropzone/dist/min/basic.min.css',
    './node_modules/dropzone/dist/min/dropzone.min.js'
  ], './app/content/').catch(err => {
    console.error('Unhandled error copying files.');
    console.error(err);
  });
});