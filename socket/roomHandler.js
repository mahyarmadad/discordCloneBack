const {
  addNewRoom,
  getActiveRooms,
  getIO,
  getActiveRoom,
  joinActiveRoom,
  leaveActiveRoom,
} = require("./store");

const updateRooms = (toSockedId) => {
  const activeRooms = getActiveRooms();
  const io = getIO();
  if (toSockedId) return io.to(toSockedId).emit("active-Rooms", activeRooms);
  return io.emit("active-Rooms", activeRooms);
};

const createRoom = (socket) => {
  const { userId } = socket.user;
  const socketId = socket.id;
  const newRoom = addNewRoom(userId, socketId);
  socket.emit("room-create", newRoom);
  updateRooms();
};

const joinRoom = (socket, data) => {
  const { userId } = socket.user;
  const socketId = socket.id;
  const roomId = data.roomId;
  const room = getActiveRoom(roomId);
  if (!room) return;
  const participants = { userId, socketId };
  joinActiveRoom(room, participants);
  updateRooms();
};

const leaveRoom = (socket, data) => {
  const roomId = data.roomId;
  const room = getActiveRoom(roomId);
  if (!room) return;
  leaveActiveRoom(room, socket.id);
  updateRooms();
};

module.exports = { createRoom, joinRoom, leaveRoom, updateRooms };
