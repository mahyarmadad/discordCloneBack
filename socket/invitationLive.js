const invitation = require("../schema/invitation");
const { getActiveConnections, getIO } = require("./store");

const pendingInvitation = async (userId) => {
  try {
    const pendingInvite = await invitation
      .find({ receiverId: userId })
      .populate("senderId", "_id email username");
    const userSocketId = getActiveConnections(userId.toString());
    if (!userSocketId) return;
    const io = getIO();
    io.to(userSocketId).emit("invitation", {
      pendingInvitation: pendingInvite || [],
    });
  } catch (error) {
    console.log("pendingInvitation", error.message);
  }
};

module.exports = pendingInvitation;
