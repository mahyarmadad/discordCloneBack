require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const PORT = process.env.PORT;

const authRoutes = require("./routes/authRoutes");
const friendRoutes = require("./routes/friendRoutes");
const socketServer = require("./socket/socketServer");
const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/friend", friendRoutes);

const server = require("http").createServer(app);
socketServer.registerSockerServer(server);

mongoose
  .connect(process.env.mongoURL)
  .then(() => {
    console.log(`Database Connected`);
    server.listen(PORT, () => {
      console.log(`Server is listening on ${PORT}`);
    });
  })
  .catch((e) => console.error(e.message));
