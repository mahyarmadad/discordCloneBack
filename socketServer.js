const registerSockerServer = (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("user connected: ", socket.id);
  });
};
module.exports = {
  registerSockerServer,
};
