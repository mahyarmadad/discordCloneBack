// const users = new Map();
const users = {};
let io;
const setIO = (ioConnection) => (io = ioConnection);
const getIO = () => io;

const addSocketUser = (socketId, userId) =>
  // users.set(socketId, { userId: userId.userId });
  (users[userId.userId] = socketId);

const removeSocketUser = (socketId) => {
  // users.has(socketId) && users.delete(socketId);
  for (let key in users) {
    if (users[key] === socketId) delete key;
  }
};

const getActiveConnections = (userId) => {
  // let activeConnections = [];
  // users.forEach((value, key) => {
  //   if (value.userId === userId) activeConnections.push(key);
  // });
  // return activeConnections;
  return users[userId];
};
const getOnlineUsers = () => {
  // let activeConnections = [];
  // users.forEach((value, key) => {
  //   activeConnections.push({
  //     socketId: key,
  //     userId: value.userId,
  //   });
  // });
  // return activeConnections;
  return users;
};

module.exports = {
  addSocketUser,
  removeSocketUser,
  getActiveConnections,
  setIO,
  getIO,
  getOnlineUsers,
};
