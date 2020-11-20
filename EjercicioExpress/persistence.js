const fs = require("fs");

const file = "./data/messages.json";

function cargarChat(rutaChat) {
    file = rutaChat;
}

function obtenerMensaje(timestamp) {
    let json = loadJSON();
    let msg = json.find(each => each.ts == timestamp);
    return msg;
}

function guardarMensaje(mensaje) {
    let json = loadJSON();
    mensaje["ts"] = new Date().getTime();
    json.push(mensaje);
    saveJSON(json);
    return mensaje
}

function actualizarMensaje(mensaje) {
    let json = loadJSON();
    let msg = json.find(each => each.ts == mensaje.ts);
    msg.message = mensaje.message;
    msg.author = mensaje.author;
    saveJSON(json);
    return msg;
}

function borrarMensaje(timestamp) {
    let json = loadJSON();
    let msg = json.find(each => each.ts == timestamp);
    let i = json.indexOf(msg);
    if (i > -1) {
        json.splice(i, 1);
        saveJSON(json);
        return msg;
    }
    return null;
}

const getAllMessages = () => {
    return loadJSON();
}

function loadJSON() {
    return JSON.parse(fs.readFileSync(file));
}

function saveJSON(json) {
    fs.writeFileSync(path=file, data=JSON.stringify(json));
}

exports.obtenerMensaje = obtenerMensaje;
exports.guardarMensaje = guardarMensaje;
exports.actualizarMensaje = actualizarMensaje;
exports.borrarMensaje = borrarMensaje;
exports.getAllMessages = getAllMessages;
