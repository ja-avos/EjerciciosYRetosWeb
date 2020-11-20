const axios = require("axios");
const http = require("http");
const url = require("url");
const fs = require("fs");
const { resolve } = require("path");
const { rejects } = require("assert");
const { info } = require("console");

const clientsUrl =
    "https://gist.githubusercontent.com/josejbocanegra/986182ce2dd3e6246adcf960f9cda061/raw/f013c156f37c34117c0d4ba9779b15d427fb8dcd/clientes.json";
const suppliersUrl =
    "https://gist.githubusercontent.com/josejbocanegra/d3b26f97573a823a9d0df4ec68fef45f/raw/66440575649e007a9770bcd480badcbbc6a41ba7/proveedores.json";

const basePath = "index.html";
const clientsPath = "clients.html";
const suppliersPath = "suppliers.html";

axios.get(clientsUrl).then((request) => processClients(request.data));
axios.get(suppliersUrl).then((request) => processSuppliers(request.data));

http.createServer((req, res) => processRequest(req, res)).listen(8081);

function processRequest(req, res) {
	let q = url.parse(req.url);
	let filename = "error";
	if(q.pathname === "/api/clientes") {
		filename = clientsPath;
	} else if(q.pathname === "/api/proveedores") {
		filename = suppliersPath;
	}
    fs.readFile(filename, function (err, data) {
        if (err) {
            res.writeHead(404, { "Content-Type": "text/html" });
            return res.end("404 Not Found");
        }
		res.writeHead(200, { "Content-Type": "text/html" });
        res.write(data);
        return res.end();
    });
}

function processSuppliers(data) {
    let info = [];
    data.forEach((supplier) => {
        info.push([
            supplier["idproveedor"],
            supplier["nombrecompania"],
            supplier["nombrecontacto"],
        ]);
    });
    fillSuppliers(info);
}

function processClients(data) {
    let info = [];
    data.forEach((client) => {
        info.push([
            client["idCliente"],
            client["NombreCompania"],
            client["NombreContacto"],
        ]);
	});
	fillClients(info);
}

function fillClients(info) {
	let fileText = "";
		fs.readFile(basePath, (err, data) => {
			if (err) {
				fileText = "Server-side error";
				console.log(err, fileText);
			} else {
				fileText = data.toString();
				fileText = fileText.replace(/{{entidad}}/g, "clientes");
				fileText = fillTable(info, fileText);
				fs.writeFile(clientsPath, fileText, (err) => {if(err) console.log(err, "Error en escritura de archivo clientes :(")});
        	}
		});
}

function fillSuppliers(info) {
	let fileText = "";
		fs.readFile(basePath, (err, data) => {
			if (err) {
				fileText = "Server-side error";
				console.log(err, fileText);
			} else {
				fileText = data.toString();
				fileText = fileText.replace(/{{entidad}}/g, "proveedores");
				fileText = fillTable(info, fileText);
				fs.writeFile(suppliersPath, fileText, (err) => {if(err) console.log(err, "Error en escritura de archivo proveedores :(")});
        	}
		});
}

function fillTable(info, text) {
	let tableRows = "";
	for (const element of info) {
		tableRows +=	`\t\t<tr class="d-flex"> \
						\n\t\t\t<th scope="row" class="col-1">${element[0]}</th> \
						\n\t\t\t<td class="col-6">${element[1]}</td> \
						\n\t\t\t<td class="col-5">${element[2]}</td> \
					\t\t</tr> \n`;
	}
	return text.replace("{{tableRows}}", tableRows);
}
