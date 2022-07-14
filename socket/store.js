// const users = new Map();
const users = {};
let io;
const setIO = (ioConnection) => (io = ioConnection);
const getIO = () => io;

const addSocketUser = (socketId, userId) => (users[userId.userId] = socketId);
const removeSocketUser = (socketId) => {
  for (let key in users) {
    if (users[key] === socketId) delete key;
  }
};

const getActiveConnections = (userId) => users[userId];
const getOnlineUsers = () => users;

module.exports = {
  addSocketUser,
  removeSocketUser,
  getActiveConnections,
  setIO,
  getIO,
  getOnlineUsers,
};
