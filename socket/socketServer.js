const verifySocketToken = require("../controller/authSocket");
const { getChatHistory, chatHandler } = require("./chatHandler");
const updateFriends = require("./friendsLive");
const pendingInvitation = require("./invitationLive");
const {
  addSocketUser,
  removeSocketUser,
  setIO,
  getOnlineUsers,
} = require("./store");

const registerSockerServer = (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  setIO(io);

  io.use(verifySocketToken);

  const emitOnlineUsers = () => {
    const onlineUsers = getOnlineUsers();
    io.emit("onlineUsers", { onlineUsers });
  };

  io.on("connection", (socket) => {
    console.log("user connected: ", socket.id);
    addSocketUser(socket.id, socket.user);
    pendingInvitation(socket.user.userId);
    updateFriends(socket.user.userId);

    socket.on("sendMessage", (data) => {
      chatHandler(socket, data);
    });
    socket.on("chat-history", (data) => {
      getChatHistory(socket, data);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
      removeSocketUser(socket.id);
    });
  });

  setInterval(() => {
    emitOnlineUsers();
  }, [8000]);
};
module.exports = {
  registerSockerServer,
};
