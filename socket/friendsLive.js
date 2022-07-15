const UserSchema = require("../schema/user");
const { getActiveConnections, getIO } = require("./store");

const updateFriends = async (userId) => {
  try {
    const userSocketId = getActiveConnections(userId.toString());
    if (!userSocketId) return;

    const user = await UserSchema.findById(userId).populate(
      "friends",
      "-password"
    );
    if (!user) return;
    const friendsList = user.friends.map((item) => {
      return {
        id: item._id,
        email: item.email,
        username: item.username,
      };
    });
    const io = getIO();
    io.to(userSocketId).emit("friends", { friendsList: friendsList || [] });
  } catch (error) {
    console.log("updateFriends", error.message);
  }
};

module.exports = updateFriends;
