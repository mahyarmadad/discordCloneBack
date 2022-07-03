const users = new Map();
let io;

const setIO = (ioConnection) => (io = ioConnection);
const getIO = () => io;

const addSocketUser = (socketId, userId) =>
  users.set(socketId, { userId: userId.userId });

const removeSocketUser = (socketId) =>
  users.has(socketId) && users.delete(socketId);

const getActiveConnections = (userId) => {
  let activeConnections = [];
  users.forEach((value, key) => {
    if (value.userId === userId) activeConnections.push(key);
  });
  return activeConnections;
};

module.exports = {
  addSocketUser,
  removeSocketUser,
  getActiveConnections,
  setIO,
  getIO,
};
