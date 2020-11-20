const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017/?poolSize=20&w=majority";

// Create a new MongoClient
const connection = MongoClient.connect(uri, {useUnifiedTopology: true});

module.exports = connection;