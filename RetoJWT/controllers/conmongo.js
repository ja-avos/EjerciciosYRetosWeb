const connection = require("./mongodb");

function createClient(pClient, callback) {
    connection.then(client => {
        client.db("store")
        .collection("clients")
        .insertOne(pClient);
        callback(pClient);
    });
}

function updateClient(pClient, callback) {
    connection.then(client => {
        client.db("store")
        .collection("clients")
        .updateOne({username: pClient.username}, {$set : pClient});
        callback(pClient);
    });
}

function getClient(username, callback) {
    connection.then(client => {
        client.db("store")
        .collection("clients")
        .findOne({username: username})
        .then(data => {
            callback(data);
        });
    });
}

function getClients(callback) {
    connection.then(client => {
        client.db("store")
        .collection("clients")
        .find({})
        .toArray((err, data) => {
            callback(data, err);
        });
    });
}

function getProducts(callback) {
    connection.then(client => {
        client.db("store")
        .collection("products")
        .find({})
        .toArray((err, data) => {
            callback(data, err);
        });
    });
}

function createProduct(storename, product, callback) {
    product['storename'] = storename;
    connection.then(client => {
        client.db("store")
        .collection("products")
        .insertOne(product);
        callback(product);
    });
}

function deleteProduct(storename, product, callback) {
    connection.then(client => {
        client.db("store")
        .collection("products")
        .deleteOne({storename: storename, id: product.id});
        callback();
    });
}

function createStore(store, callback) {
    connection.then(client => {
        client.db("store")
        .collection("stores")
        .insertOne(store);
        callback(store);
    });
}

function getStore(storename, callback) {
    connection.then(client => {
        client.db("store")
        .collection("stores")
        .findOne({storename: storename})
        .then(data => {
            callback(data);
        });
    });
}

function updateStore(store, callback) {
    connection.then(client => {
        client.db("store")
        .collection("stores")
        .updateOne({storename: store.storename}, {$set : store});
        callback(store);
    });
}

function getStores(callback) {
    connection.then(client => {
        client.db("store")
        .collection("stores")
        .find({})
        .toArray((err, data) => {
            callback(data, err);
        });
    });
}

function getCart(username, callback) {
    connection.then(client => {
        client.db("store")
        .collection("cart")
        .find({username: username})
        .toArray((err, data) => {
            callback(data, err);
        });
    });
}

function addToCart(username, product, qty, callback) {
    pCart = {
        username: username,
        product: product,
        qty: qty
    }
    connection.then(client => {
        client.db("store")
        .collection("cart")
        .insertOne(pCart);
        callback(pCart);
    });
}

function buyAll(username, callback) {
    connection.then(client => {
        client.db("store")
        .collection("cart")
        .deleteMany({username: username});
        callback();
    });
}

function deleteClient(username, callback) {
    connection.then(client => {
        client.db("store")
        .collection("clients")
        .deleteOne({username: username});
        callback();
    });
}

function deleteStore(storename, callback) {
    connection.then(client => {
        client.db("store")
        .collection("stores")
        .deleteOne({storename: storename});
        callback();
    });
}

function createAdmin(admin, callback) {
    connection.then(client => {
        client.db("store")
        .collection("admins")
        .insertOne(admin);
        callback(admin);
    })
}

function getAdmin(adminname, callback) {
    connection.then(client => {
        client.db("store")
        .collection("admins")
        .findOne({adminname: adminname})
        .then(data => {
            callback(data);
        });
    });
}

module.exports = {
    createClient,
    createProduct,
    createStore,
    updateClient,
    updateStore,
    getCart,
    getClient,
    getClients,
    getProducts,
    getStore,
    getStores,
    deleteClient,
    deleteProduct,
    deleteStore,
    buyAll,
    addToCart,
    createAdmin,
    getAdmin
};