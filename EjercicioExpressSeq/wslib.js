const WebSocket = require("ws");
const persistence = require("./persistence");
const Msg = require("./models/message");

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
			Msg.create(msg).then((response) => {
				console.log(response);
				sendMessages();
			});
			//persistence.guardarMensaje(msg);
        });
    });

};
const sendMessages = () => {
	clients.forEach((client) =>
		Msg.findAll().then((result) => {
			console.log(result.map(ob => ob.get({
				plain: true
			})));
			client.send(JSON.stringify(result.map(ob => ob.get({
				plain: true
			}))));
		})
		//client.send(JSON.stringify(persistence.getAllMessages()))
	);
};

exports.wsConnection = wsConnection;
exports.sendMessages = sendMessages;
