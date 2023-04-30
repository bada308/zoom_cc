import express from "express";
import { Server } from "socket.io";
import http from "http"; // node.js에 이미 설치되어 있기 때문에 따로 설치할 필요 없음

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

// http 서버 생성
const httpServer = http.createServer(app);
// io 서버 생성
const wsServer = new Server(httpServer);

const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);
