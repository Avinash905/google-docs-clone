import express from "express";
import { Server } from "socket.io";
import mongoconn from "./db/conn.js";
import { getDocument, updateDocument } from "./controller/controller.js";
import cors from "cors";
import * as dotenv from "dotenv";
dotenv.config();
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.static(path.join(__dirname, "./client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

const io = new Server(port, {
  cors: {
    origin: process.env.ORIGIN,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("get-document", async (docId) => {
    const document = await getDocument(docId);
    socket.join(docId);
    socket.emit("load-document", document.data);

    socket.on("send-changes", (delta) => {
      socket.broadcast.to(docId).emit("recieve-changes", delta);
    });

    socket.on("save-document", async (data) => {
      await updateDocument(docId, data);
    });
  });
});
