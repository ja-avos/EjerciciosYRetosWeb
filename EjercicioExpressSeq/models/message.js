const { DataTypes, Model } = require("sequelize");
const sequelize = require("../lib/sequelize");

class Message extends Model {}

Message.init(
  {
    ts: {
      type: DataTypes.NUMBER,
      primaryKey: true,
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Message",
  }
);

Message.sync();

module.exports = Message;