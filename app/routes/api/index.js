const express = require('express');
const multer = require('multer');
const extraLife = require('../../el');
const path = require('path');
const fs = require('fs');
const audio = require('../../data/audio');

const audioFolder = path.resolve(__dirname, '../../content/audio/');

const upload = multer({ dest: audioFolder });
const api = express.Router();

api.get('/team', (req, res) => {
  res.json(extraLife.monitor.getTeamInfo());
});

api.get('/roster', (req, res) => {
  res.json(extraLife.monitor.getRoster());
});

api.get('/member/:id', (req, res) => {
  const member = extraLife.monitor.getMemberInfo(parseInt(req.params.id, 10));
  if(member){
    res.json(member);
  } else {
    res.sendStatus(404);
  }
});

api.get('/audio', (req, res) => {
  const files = fs.readdirSync(audioFolder);
  res.json({ files: files });
});

api.get('/audio/random', (req, res) => {
  const files = fs.readdirSync(audioFolder);
  const filename = files[Math.floor(Math.random() * files.length)];
  res.json({ file: filename });
});

api.post('/audio', upload.single('sound'), (req, res) => {
  const file = req.file;
  console.log(`Uploaded ${file.originalname} to ${file.destination} as ${file.filename}`);
  const uploadedFile = path.join(file.destination, file.filename);
  audio.fileUploaded(uploadedFile, file.originalname)
    .then(file => {
      res.sendStatus(200);
    }, err => {
      res.status(500).send(err);
    });
});

module.exports = (app) => {
  app.use('/api', api);
};
