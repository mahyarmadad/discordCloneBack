const verifySocketToken = require("../controller/authSocket");
const { getChatHistory, chatHandler } = require("./chatHandler");
const updateFriends = require("./friendsLive");
const pendingInvitation = require("./invitationLive");
const {
  createRoom,
  joinRoom,
  leaveRoom,
  updateRooms,
  initializeConn,
  roomSignal,
} = require("./roomHandler");
const {
  addSocketUser,
  removeSocketUser,
  setIO,
  getOnlineUsers,
  leaveActiveRoom,
  getActiveRooms,
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
    updateRooms(socket.id);

    socket.on("sendMessage", (data) => {
      chatHandler(socket, data);
    });
    socket.on("chat-history", (data) => {
      getChatHistory(socket, data);
    });
    socket.on("room-create", () => {
      createRoom(socket);
    });
    socket.on("room-join", (data) => {
      joinRoom(socket, data);
    });
    socket.on("room-leave", (data) => {
      leaveRoom(socket, data);
    });
    socket.on("conn-init", (data) => {
      initializeConn(socket, data);
    });
    socket.on("conn-signal", (data) => {
      roomSignal(socket, data);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
      removeSocketUser(socket.id);
      const rooms = getActiveRooms();
      rooms.forEach((room) => {
        let userinRoom = room.participants.some(
          (p) => p.socketId === socket.id
        );
        if (userinRoom) leaveActiveRoom(room, socket.id);
      });
    });
  });

  setInterval(() => {
    emitOnlineUsers();
  }, [8000]);
};
module.exports = {
  registerSockerServer,
};
