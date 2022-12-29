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

  room.participants.forEach((person) => {
    if (person.socketId !== participants.socketId) {
      socket.to(person.socketId).emit("conn-prepare", {
        connectedUserSocketId: participants.socketId,
      });
    }
  });
  updateRooms();
};

const leaveRoom = (socket, data) => {
  const roomId = data.roomId;
  const room = getActiveRoom(roomId);
  if (!room) return;
  leaveActiveRoom(room, socket.id);

  const updatedRoom = getActiveRoom(roomId);
  if (updatedRoom)
    updatedRoom.participants.forEach((person) => {
      socket.to(person.sockedId).emit("room-participant-left", {
        connectedUserSocketId: socket.id,
      });
    });
  updateRooms();
};
const initializeConn = (socket, data) => {
  const initData = { connectedUserSocketId: socket.id };
  socket.to(data).emit("conn-init", initData);
};

const roomSignal = (socket, data) => {
  const { signal, connectedUserSocketId } = data;
  const signalData = { signal, connectedUserSocketId: socket.id };
  socket.to(connectedUserSocketId).emit("conn-signal", signalData);
};

module.exports = {
  createRoom,
  joinRoom,
  leaveRoom,
  updateRooms,
  initializeConn,
  roomSignal,
};
