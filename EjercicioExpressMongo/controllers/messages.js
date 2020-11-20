const connection = require("../lib/mongodb");

function getMessages(callback) {
    connection.then(client => {
        client.db("chatdb")
        .collection("messages")
        .find({})
        .toArray((err, data) => {
            callback(data, err);
        });
    });
}

function getMessage(ts, callback) {
    connection.then(client => {
        client.db("chatdb")
        .collection("messages")
        .findOne({ts: ts})
        .then(data => {
            callback(data);
        });
    });
}

function createMessage(message, callback) {
    message["ts"] = new Date().getTime();
    connection.then(client => {
        client.db("chatdb")
        .collection("messages")
        .insertOne(message);
        callback(message);
    });
}

function updateMessage(message, callback) {
    connection.then(client => {
        client.db("chatdb")
        .collection("messages")
        .updateOne({ts: message.ts}, {$set : { author: message.author, message: message.message}});
        callback(message);
    });
}

function deleteMessage(ts, callback) {
    connection.then(client => {
        client.db("chatdb")
        .collection("messages")
        .deleteOne({ts: ts});
        callback();
    });
}

module.exports = {
    getMessages,
    getMessage,
    createMessage,
    updateMessage,
    deleteMessage
};