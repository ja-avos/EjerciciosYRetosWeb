var express = require('express');
var joi = require('joi');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var persistence = require('./persistence');
const ws = require("./wslib");
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/chat/api/messages', (req, res) => {
    res.send(persistence.getAllMessages());
});
app.get('/chat/api/messages/:id', (req, res) => {
    let msg = persistence.obtenerMensaje(req.params.id);
    if (!msg)
      return res.status(404).send("The message with the given timestamp was not found.");
    res.send(msg);
});
app.post('/chat/api/messages', (req, res) => {
      let error = validateMsg(req.body);

      if (error) {
        return res.status(400).send(error);
      }
    
      const msg = {
        message: req.body.message,
        author: req.body.author
      };
      persistence.guardarMensaje(msg);
      ws.sendMessages();
      res.send(msg);
});
app.put("/chat/api/messages/:id", (req, res) => {
    if (!persistence.obtenerMensaje(req.params.id))
      return res.status(404).send("The message with the given timestamp was not found.");
  
      let error = validateMsg(req.body);
    
      if (error) {
        return res.status(400).send(error);
      }
      const msg = {
        message: req.body.message + " (edited)",
        author: req.body.author,
        ts: req.params.id
      };
      persistence.actualizarMensaje(msg);
      ws.sendMessages();
      res.send(msg);
  });

  app.delete("/chat/api/messages/:id", (req, res) => {
    if (!persistence.obtenerMensaje(req.params.id))
      return res.status(404).send("The message with the given timestamp was not found.");
  
      let msg = persistence.borrarMensaje(req.params.id);
      ws.sendMessages();
      res.send(msg);
  });
  
//   app.listen(3001, () => {
//     console.log("Listening on port 3000");
//   });

  const validateMsg = (msg) => {
    const schema = joi.object({
        message: joi.string().min(5).required(),
        author: joi.string().pattern(/^[a-zA-Z]+\s[a-zA-Z]+$/).required(),
      });
    
      const { error } = schema.validate(msg);
      return error;
  }

module.exports = app;
