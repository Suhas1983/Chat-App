import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRoutes from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";
import { Socket } from "dgram";


const app = express();
const server = http.createServer(app);

export const io = new Server(server,
  {
    cors:{origin:"*"}
  }
)

export const userSocketMap={};

io.on("connection",(Socket)=>{
  const userId=Socket.handshake.query.userId;
  console.log("User Connected",userId);

  if(userId) userSocketMap[userId]=Socket.id;

  io.emit("getOnlineUsers",Object.keys(userSocketMap));
  Socket.on("disconnect",()=>{
    console.log("User Disconnecte",userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers",Object.keys(userSocketMap))
  })

})

app.use(express.json({ limit: "10mb" }));
app.use(cors());

app.use("/api/status", (req, res) => 
  res.send("server is live"));
app.use("/api/auth",userRoutes);
app.use("/api/messages",messageRouter);

await connectDB();
const PORT = process.env.PORT || 5000;


server.listen(PORT, () => {
  console.log(`Server is live on port ${PORT}`);
});