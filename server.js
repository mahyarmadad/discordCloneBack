require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const PORT = process.env.PORT;

const authRoutes = require("./routes/authRoutes");
const socketServer = require("./socketServer");
const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);

const server = require("http").createServer(app);
socketServer.registerSockerServer(server);

mongoose
  .connect(process.env.mongoURL)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is listening on ${PORT}`);
    });
    console.log(`Database Connected`);
  })
  .catch((e) => console.error(e.message));
