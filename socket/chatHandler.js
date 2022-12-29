const MessageSchema = require("../schema/message");
const ChatSchema = require("../schema/chat");
const { getIO, getActiveConnections } = require("./store");

const updateChat = async (chatId, toSockedId) => {
  try {
    const io = getIO();
    const conversation = await ChatSchema.findById(chatId).populate({
      path: "messages",
      model: "message",
      populate: {
        path: "author",
        model: "user",
        select: "username _id",
      },
    });

    if (!conversation) return;

    if (toSockedId) return io.to(toSockedId).emit("chat-history", conversation);

    conversation.participants.forEach((user) => {
      let userSockedId = getActiveConnections(user.toString());
      io.to(userSockedId).emit("chat-history", conversation);
    });
  } catch (error) {
    console.log("updateChat", error.message);
  }
};

const chatHandler = async (socket, data) => {
  try {
    const { userId } = socket.user;
    const { receiverId, message } = data;
    if (!receiverId && !message) return;
    const newMessage = await MessageSchema.create({
      content: message,
      author: userId,
      date: new Date(),
      type: "Direct",
    });
    const existChat = await ChatSchema.findOne({
      participants: { $all: [userId, receiverId] },
    });
    if (existChat) {
      existChat.messages.push(newMessage._id);
      await existChat.save();
      await updateChat(existChat._id);
    } else {
      const newChat = await ChatSchema.create({
        messages: [newMessage._id],
        participants: [userId, receiverId],
      });
      await updateChat(newChat._id);
    }
  } catch (error) {
    console.log("chatHandler", error.message);
  }
};

const getChatHistory = async (socket, data) => {
  try {
    const { userId } = socket.user;
    const { receiverId } = data;
    if (!receiverId) return;
    const existChat = await ChatSchema.findOne({
      participants: { $all: [userId, receiverId] },
    });

    if (!existChat) return;
    updateChat(existChat._id, socket.id);
  } catch (error) {
    console.log("getChatHistory", error.message);
  }
};

module.exports = { chatHandler, getChatHistory };
