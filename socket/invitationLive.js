const invitation = require("../schema/invitation");
const { getActiveConnections, getIO } = require("./store");

const pendingInvitation = async (userId) => {
  try {
    const pendingInvite = await invitation
      .find({ receiverId: userId })
      .populate("senderId", "_id email username");

    const list = getActiveConnections(userId.toString());
    const io = getIO();
    list.forEach((item) => {
      io.to(item).emit("invitation", {
        pendingInvitation: pendingInvite || [],
      });
    });
  } catch (error) {
    console.log("pendingInvitation", error.message);
  }
};

module.exports = pendingInvitation;
