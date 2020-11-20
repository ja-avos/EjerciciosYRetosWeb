const role = {
    none: ["viewStores", "viewProducts"],
    client: ["viewStores", "viewClient", "viewProducts", "viewCart", "buyProducts", "checkout", "editUser"],
    owner: ["viewStores", "viewProducts", "addProduct", "deleteProduct", "editStore"],
    admin: ["viewClients", "viewStores", "viewProducts", "addProduct", "editStores"]
};

module.exports = role;