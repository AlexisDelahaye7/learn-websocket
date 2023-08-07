import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import { Server } from "socket.io";

import "dotenv/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(`${__dirname}/public`));

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("client-nickname", (nickname) => {
    socket.data.nickname = nickname;
  });

  socket.on("client-message", (msg) => {
    console.log(msg);
    io.emit("server-message", { id: socket.id, message: msg, nickname: socket.data.nickname });
  });

  socket.on("client-mousemove", (pos) => {
    io.emit("server-mousemove", { pos, nickname: socket.data.nickname });
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Listening to http://localhost:${process.env.PORT || 3000}`);
});
