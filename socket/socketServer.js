const verifySocketToken = require("../controller/authSocket");
const { addSocketUser, removeSocketUser, setIO } = require("./store");

const registerSockerServer = (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  setIO(io);

  io.use(verifySocketToken);

  io.on("connection", (socket) => {
    console.log("user connected: ", socket.id);
    addSocketUser(socket.id, socket.user);

    socket.on("disconnect", () => {
      console.log("user disconnected");
      removeSocketUser(socket.id);
    });
  });
};
module.exports = {
  registerSockerServer,
};
