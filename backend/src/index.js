import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import {connectDB} from "./lib/db.js";
import cookieParser from "cookie-parser";
import {server, app} from './lib/socket.js';
import cors from "cors";

dotenv.config();
//const app = express();
const port = process.env.PORT || 5001;

// 从request中获取body
app.use(express.json()).use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

server.listen(port, () => {
    console.log('Server is running on port', port);
    connectDB();
})