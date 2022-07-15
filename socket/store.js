const crypto = require("crypto");
const users = {};
let activeRooms = [];
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

const addNewRoom = (userId, socketId) => {
  let newRoom = {
    creator: { userId, socketId },
    participants: [{ userId, socketId }],
    roomId: crypto.randomBytes(16).toString("hex"),
  };
  activeRooms.push(newRoom);
  return newRoom;
};
const joinActiveRoom = (room, newParticipants) => {
  activeRooms = activeRooms.filter((r) => r.roomId !== room.roomId);
  let updateRoom = {
    ...room,
    participants: [...room.participants, newParticipants],
  };
  activeRooms.push(updateRoom);
};
const leaveActiveRoom = (room, socketId) => {
  let cache = { ...room };
  cache.participants = cache.participants.filter(
    (item) => item.socketId !== socketId
  );
  activeRooms = activeRooms.filter((r) => r.roomId !== room.roomId);
  if (cache.participants.length) activeRooms.push(cache);
};

const getActiveRooms = () => [...activeRooms];
const getActiveRoom = (roomId) =>
  activeRooms.find((room) => room.roomId === roomId);

module.exports = {
  addSocketUser,
  removeSocketUser,
  getActiveConnections,
  setIO,
  getIO,
  getOnlineUsers,
  addNewRoom,
  getActiveRooms,
  getActiveRoom,
  joinActiveRoom,
  leaveActiveRoom,
};
