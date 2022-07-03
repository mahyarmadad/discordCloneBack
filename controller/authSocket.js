const jwt = require("jsonwebtoken");

const verifySocketToken = (socket, next) => {
  let token = socket.handshake.auth?.token;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
  } catch (error) {
    const socketErr = new Error("NOT_AUTHORIZED");
    return next(socketErr);
  }
  next();
};

module.exports = verifySocketToken;
