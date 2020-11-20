let jwt = require("jsonwebtoken");
let config = require("./config");
let conmongo = require("./controllers/conmongo");
let md5 = require("md5");
let roles = require("./roles");

// Clase encargada de la creación del token
class HandlerGenerator {
    static login(req, res) {
        let username = req.body.username;
        username = req.body.usuario;
        let password = req.body.password;

        password = md5(md5(password));

        if (username && password) {
            conmongo.getClient(username, (data) => {
                let user = data;

                if (
                    user &&
                    username == user.username &&
                    password == user.password
                ) {
                    let tk = jwt.sign(
                        { username: username, rol: "client" },
                        config.secret,
                        { expiresIn: "24h" }
                    );
                    res.send({
                        success: true,
                        message: "Client logged in!",
                        user: {
                            usuario: username,
                            nombre: user.name,
                            email: user.email,
                            rol: 'client',
                            tk: tk
                        }
                    });
                } else {
                    conmongo.getStore(username, (data) => {
                        let store = data;
                        if (
                            store &&
                            username == store.storename &&
                            password == store.password
                        ) {
                            let tk = jwt.sign(
                                { username: username, rol: "owner" },
                                config.secret,
                                { expiresIn: "24h" }
                            );
                            res.send({
                                success: true,
                                message: "Store logged in!",
                                user: {
                                    usuario: username,
                                    nombre: user.name,
                                    email: user.email,
                                    rol: 'owner',
                                    tk: tk
                                }
                            });
                        } else {
                            conmongo.getAdmin(username, (data) => {
                                let admin = data;

                                if (
                                    admin &&
                                    username == admin.adminname &&
                                    password == admin.password
                                ) {
                                    let tk = jwt.sign(
                                        { username: username, rol: "admin" },
                                        config.secret,
                                        { expiresIn: "1h" }
                                    );
                                    res.send({
                                        success: true,
                                        message: "Admin logged in!",
                                        user: {
                                            usuario: username,
                                            nombre: user.name,
                                            email: user.email,
                                            rol: 'admin',
                                            tk: tk
                                        }
                                    });
                                } else {
                                    res.status(403).json({
                                        success: false,
                                        message:
                                            "Username or password invalid.",
                                    });
                                }
                            });
                        }
                    });
                }
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Please, enter a username and a password.",
            });
        }
    }

    static register(req, res) {
        let username = req.body.username;
        let password = req.body.password;
        let role = req.body.role;

        //Check if username already exists
        let user;
        conmongo.getClient(username, (data) => {
            user = data;
            let store;
            conmongo.getStore(username, (data) => {
                store = data;
                if (user || store) {
                    res.status(400).json({
                        success: false,
                        message: "Username already taken. Choose other",
                    });
                } else {
                    console.log(req.body);
                    password = md5(md5(password));
                    if (role != "client" && role != "owner") {
                        res.status(400).json({
                            success: false,
                            message:
                                "Invalid role. Select between 'client' or 'owner'.",
                        });
                    } else if (role == "client") {
                        let new_client = {
                            username: username,
                            password: password,
                            role: role,
                        };
                        conmongo.createClient(new_client, (resp) => {
                            let client = Object.assign({}, resp);
                            delete client.password;
                            delete client._id;
                            res.send({
                                success: true,
                                message: "Client created. Log in to navigate!",
                                client: client,
                            });
                        });
                    } else if (role == "owner") {
                        let new_store = {
                            storename: username,
                            password: password,
                            role: role,
                        };
                        conmongo.createStore(new_store, (resp) => {
                            let store = Object.assign({}, resp);
                            delete store.password;
                            delete store._id;
                            res.send({
                                success: true,
                                message: "Store created. Log in to navigate!",
                                store: store,
                            });
                        });
                    }
                }
            });
        });
    }

    static sendClients(req, res) {
        if (roles[req.decoded.rol].includes("viewClients")) {
            conmongo.getClients((data) => {
                res.send(data);
            });
        } else {
            res.status(403).send({
                success: false,
                message: "Your role is not allowed to access this endpoint.",
            });
        }
    }

    static sendClient(req, res) {
        let username = req.params.user;
        if (roles[req.decoded.rol].includes("viewClient")) {
            if (username == req.decoded.username) {
                conmongo.getClient(username, (data) => {
                    res.send(data);
                });
            } else {
                res.status(403).json({
                    success: false,
                    message:
                        "Your account is not allowed to access this resource.",
                });
            }
        } else if (roles[req.decoded.rol].includes("viewClients")) {
            conmongo.getClient(username, (data) => {
                res.send(data);
            });
        } else {
            res.status(403).json({
                success: false,
                message: "Your role is not allowed to access this endpoint.",
            });
        }
    }

    static sendProducts(req, res) {
        if (roles[req.decoded.rol].includes("viewProducts")) {
            conmongo.getProducts((data) => {
                res.send(data);
            });
        } else {
            res.status(403).json({
                success: false,
                message: "You are not authorized to access this resource.",
            });
        }
    }

    static sendStores(req, res) {
        if (roles[req.decoded.rol].includes("viewStores")) {
            conmongo.getStores((data) => {
                let stores = Object.assign([], data);
                for (const store of stores) {
                    delete store.password;
                    delete store._id;
                }
                res.send(data);
            });
        } else {
            res.status(403).json({
                success: false,
                message: "You are not authorized to access this resource",
            });
        }
    }

    static sendCart(req, res) {
        let username = req.decoded.username;
        if (roles[req.decoded.rol].includes("viewCart")) {
            if (req.decoded.username) {
                conmongo.getCart(username, (data) => {
                    res.send(data);
                });
            } else {
                res.status(403).json({
                    success: false,
                    message:
                        "Your account is not allowed to access this resource.",
                });
            }
        } else {
            res.status(403).json({
                success: false,
                message: "Your role is not allowed to access this endpoint.",
            });
        }
    }

    static buyProducts(req, res) {
        let username = req.decoded.username;
        let product = req.body.product;
        let qty = req.body.quantity;
        if (username && roles[req.decoded.rol].includes("buyProducts")) {
            conmongo.addToCart(username, product, qty, (data) => {
                res.send({
                    success: true,
                    message: "Products added to " + username + " cart",
                    product: data.product,
                    qty: data.qty,
                });
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Only logged clients can add produtcs to cart",
            });
        }
    }

    static checkout(req, res) {
        let username = req.decoded.username;

        if (username && roles[req.decoded.rol].includes("checkout")) {
            conmongo.buyAll(username, () => {
                res.send({
                    success: true,
                    message: "Products on their way!",
                });
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Only logged clients can checkout",
            });
        }
    }

    static editClient(req, res) {
        let username = req.decoded.username;
        let new_user = req.body;

        new_user.username = username;
        if(new_user.password) {
            new_user.password = md5(md5(new_user.password));
        }

        if (username && req.params.user == username && roles[req.decoded.rol].includes("editUser")) {
            conmongo.updateClient(new_user, (data) => {
                res.send({
                    success: true,
                    message: "Client succesfully edited.",
                });
            });
        } else {
            res.status(403).json({
                success: false,
                message: "You are not allowed to edit this client.",
            });
        }
    }

    static addProduct(req, res) {
        let storename = req.decoded.username;
        let product = req.body;

        if (storename && roles[req.decoded.rol].includes("addProduct") && req.decoded.rol == "owner") {
            if (product && product.id) {
                conmongo.createProduct(storename, product, (data) => {
                    res.send({
                        success: true,
                        message:
                            "Product created and added to " +
                            storename +
                            " store.",
                        product: data,
                    });
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: "Product information must exist.",
                });
            }
        } else if (req.decoded.rol == "admin") {
            storename = req.params.storename;
            if (storename) {
                if (product && product.id) {
                    conmongo.createProduct(storename, product, (data) => {
                        res.send({
                            success: true,
                            message:
                                "Product created and added to " +
                                storename +
                                " store.",
                            product: data,
                        });
                    });
                } else {
                    res.status(400).json({
                        success: false,
                        message: "Product information must exist.",
                    });
                }
            } else {
                res.status(400).json({
                    success: false,
                    message: "Must include storename in url.",
                });
            }
        } else {
            res.status(403).json({
                success: false,
                message: "You are not allowed to create new products.",
            });
        }
    }

    static deleteProduct(req, res) {
        let storename = req.decoded.username;
        let product = req.body;

        if (storename && roles[req.decoded.rol].includes("deleteProduct")) {
            if (product && product.id) {
                conmongo.deleteProduct(storename, product, () => {
                    res.send({
                        success: true,
                        message:
                            "Product with id " +
                            product.id +
                            " of " +
                            storename +
                            " store deleted",
                    });
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: "Invalid product. Check product info.",
                });
            }
        } else {
            res.status(403).json({
                success: false,
                message: "You are not allowed to delete any product.",
            });
        }
    }

    static editStore(req, res) {
        let storename = req.decoded.username;
        let new_store = req.body;

        new_store.storename = storename;

        if(new_store.password) { new_store.password = md5(md5(new_store.password));}

        if (storename && roles[req.decoded.rol].includes("editStore")) {
            conmongo.updateStore(new_store, (data) => {
                res.send({
                    success: true,
                    message: "Store succesfully edited.",
                });
            });
        } else if(roles[req.decoded.rol].includes('editStores')) {
            storename = req.params.storename;
            new_store.storename = storename;
            if (storename) {
                    conmongo.updateStore(new_store, (data) => {
                        res.send({
                            success: true,
                            message:
                                "Store " +
                                storename +
                                " updated."
                        });
                    });
            } else {
                res.status(400).json({
                    success: false,
                    message: "Must include storename in url.",
                });
            }
        }
        else {
            res.status(403).json({
                success: false,
                message: "You are not allowed to edit any store.",
            });
        }
    }
}

module.exports = HandlerGenerator;
