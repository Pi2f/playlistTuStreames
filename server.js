const http = require('http');
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const config = require('./config.js');
const methodOverride = require('method-override');
const helmet = require('helmet');
const playlist = require('./playlist.js');

const app = express();


app.use(logger('dev'));
app.use(methodOverride());
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(express.static(__dirname));


app.use(function onError(err, req, res, next) {
  res.status(500).send(err);
});

app.post('/playlist', function(req,res) {
  playlist.add(req.body, function(err){
      if(err) res.status(500).send();
      else res.status(201).send();
  });
});

app.get('/playlist/:id', function(req, res) {  
  playlist.getByUserId(req.params.id, function(err, playlists){
      if(err) res.status(500).send(err);
      else res.status(200).send(JSON.stringify(playlists));
  });
});

app.post('/playlist/video', function(req, res) {
  playlist.updatePlaylist(req.body, function(err){
      if(err) res.status(500).send(err);
      else res.status(200).send();
  });
});

app.delete('/playlist/:id', function(req, res) {
  playlist.deletePlaylist(req.params.id, function(err){
      if(err) res.status(500).send(err);
      else res.status(200).send();
  });
});

const server = http.createServer(app)
.listen(config.port, function(){ 
  console.log(`Example app listening on port ${config.port}!`)
});
