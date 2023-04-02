import express from "express";
import WebSocket from "ws";
import http from "http"; // node.js에 이미 설치되어 있기 때문에 따로 설치할 필요 없음

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

// http 서버 생성
const server = http.createServer(app);
// ws 서버 생성
const wss = new WebSocket.Server({ server });

// 연결된 socket 저장
const sockets = [];

wss.on("connection", (socket) => {
  sockets.push(socket);
  socket["nickname"] = "Anon";
  console.log("Connected to Browser ✅");
  socket.on("close", () => console.log("Disconnected from Browser ❌"));
  socket.on("message", (message) => {
    const msg = JSON.parse(message);
    switch (msg.type) {
      case "new_msg":
        sockets.forEach((aSocket) =>
          aSocket.send(`${socket.nickname} : ${msg.payload}`)
        );
        break;
      case "nickname":
        socket["nickname"] = msg.payload;
        break;
      default:
        break;
    }
  });
});

server.listen(3000, handleListen);
