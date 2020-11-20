const express = require("express");
const router = express.Router();
//const Msg = require("../models/message");
const joi = require("joi");
//const persistence = require("../persistence");
const mongo = require("../controllers/messages");
const ws = require("../wslib");

/** GET all messages */
router.get("/", (req, res) => {
    mongo.getMessages((data, err) => {
        res.send(data);
    });
});

/** GET messages with specified id */
router.get("/:id", (req, res) => {
    mongo.getMessage(parseInt(req.params.id), (response) => {
        if(response == null) {
            return res
                .status(404)
                .send("The message with the given timestamp was not found.");
        }
        res.send(response);
    });
});

/** POST create message */
router.post("/", (req, res) => {
    let error = validateMsg(req.body);

    if (error) {
        return res.status(400).send(error);
    }

    const msg = {
        ts: new Date().getTime(),
        message: req.body.message,
        author: req.body.author,
    };

    mongo.createMessage(msg, result => {
        res.send(msg);
        ws.sendMessages();
    });
});

/** PUT update a message */
router.put("/:id", (req, res) => {
    let error = validateMsg(req.body);

    if (error) {
        return res.status(400).send(error);
    }
    const msg = {
        message: req.body.message + " (edited)",
        author: req.body.author,
        ts: parseInt(req.params.id),
    };

    mongo.getMessage(parseInt(req.params.id), (response) => {
        if(response == null) {
            res.status(404)
                .send("The message with the given timestamp was not found.");
        } else {
            mongo.updateMessage(msg, (response) => {
                res.send({ message: "Message updated" });
                ws.sendMessages();
            });
        }
    });

});

/** DELETE delete a message */
router.delete("/:id", (req, res) => {
    mongo.getMessage(parseInt(req.params.id), (response) => {
        console.log(response);
        if(response == null) {
            res.status(404)
                .send("The message with the given timestamp was not found.");
        } else {
            mongo.deleteMessage(parseInt(req.params.id), (response) => {
                res.send({ message: "Message deleted" });
                ws.sendMessages();
            });
        }
    });

});

/** Validator for message */
const validateMsg = (msg) => {
    const schema = joi.object({
        message: joi.string().min(5).required(),
        author: joi
            .string()
            .pattern(/^[a-zA-Z]+\s[a-zA-Z]+$/)
            .required(),
    });

    const { error } = schema.validate(msg);
    return error;
};

module.exports = router;
