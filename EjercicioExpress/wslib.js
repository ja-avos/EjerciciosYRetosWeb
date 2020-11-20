const WebSocket = require("ws");
const persistence = require("./persistence");

const clients = [];

const wsConnection = (server) => {
    const wss = new WebSocket.Server({ server });

    wss.on("connection", (ws) => {
        clients.push(ws);
        sendMessages();

        ws.on("message", (message) => {
			message = JSON.parse(message);
			let msg = {
				message: message.msg,
				author: message.author
			}
			persistence.guardarMensaje(msg);
            sendMessages();
        });
    });

};
const sendMessages = () => {
	clients.forEach((client) =>
		client.send(JSON.stringify(persistence.getAllMessages()))
	);
};

exports.wsConnection = wsConnection;
exports.sendMessages = sendMessages;
