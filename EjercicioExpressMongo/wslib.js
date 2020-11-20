const WebSocket = require("ws");
const persistence = require("./persistence");
//const Msg = require("./models/message");
const mongo = require("./controllers/messages");

const clients = [];

const wsConnection = (server) => {
    const wss = new WebSocket.Server({ server });

    wss.on("connection", (ws) => {
        clients.push(ws);
        sendMessages();

        ws.on("message", (message) => {
			message = JSON.parse(message);
			let msg = {
				ts: new Date().getTime(),
				message: message.msg,
				author: message.author
			}
			mongo.createMessage(msg, (response) => {
				console.log(response);
				sendMessages();
			});
			//persistence.guardarMensaje(msg);
        });
    });

};
const sendMessages = () => {
	clients.forEach((client) =>
		mongo.getMessages((data, err) => {
			client.send(JSON.stringify(data));
		})
		//client.send(JSON.stringify(persistence.getAllMessages()))
	);
};

exports.wsConnection = wsConnection;
exports.sendMessages = sendMessages;
