const mongoose = require("mongoose");
const invitationSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
});
module.exports = mongoose.model("invitation", invitationSchema);
