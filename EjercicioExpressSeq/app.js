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
const Msg = require("./models/message");

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/chat/api/messages', (req, res) => {
    Msg.findAll().then((result) => {
      res.send(result);
    })
});
app.get('/chat/api/messages/:id', (req, res) => {
    Msg.findByPk(req.params.id).then((response) => {
      if(response == null)
        return res.status(404).send("The message with the given timestamp was not found.");
      res.send(response);
    });
});
app.post('/chat/api/messages', (req, res) => {
      let error = validateMsg(req.body);

      if (error) {
        return res.status(400).send(error);
      }
    
      const msg = {
        ts: new Date().getTime(),
        message: req.body.message,
        author: req.body.author
      };
      Msg.create(msg).then((result) => {
        res.send(result);
        ws.sendMessages();
      });
});
app.put("/chat/api/messages/:id", (req, res) => {  
      let error = validateMsg(req.body);
    
      if (error) {
        return res.status(400).send(error);
      }
      const msg = {
        message: req.body.message + " (edited)",
        author: req.body.author,
        ts: req.params.id
      };
      Msg.update(msg, { where: { ts: req.params.id } }).then((response) => {
        if (response[0] !== 0) res.send({ message: "Message updated" });
        else res.status(404).send({ message: "Message was not found" });
        ws.sendMessages();
      });
  });

  app.delete("/chat/api/messages/:id", (req, res) => {
    Msg.destroy({
      where: {
        ts: req.params.id,
      },
    }).then((response) => {
      if (response === 1) res.status(204).send();
      else res.status(404).send({ message: "Message was not found" });
      ws.sendMessages();
    });
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
