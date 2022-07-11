const mongoose = require("mongoose");
const chatSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "message" }],
});
module.exports = mongoose.model("chat", chatSchema);
