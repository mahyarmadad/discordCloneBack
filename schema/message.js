const mongoose = require("mongoose");
const messageSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  content: { type: String },
  date: { type: Date },
  type: { type: String },
});
module.exports = mongoose.model("message", messageSchema);
