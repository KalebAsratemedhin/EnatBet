import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import setupSwagger from "./config/swagger.js";
import authRoutes from "./routes/auth.js";
import ratingRoutes from "./routes/rating.js";
import userRoutes from "./routes/user.js";
import restaurantRoutes from "./routes/restaurant.js";
import deliveryRoutes from "./routes/delivery.js";
import notificationRoutes from "./routes/notification.js";

import menuRoutes from "./routes/menu.js";
import orderRoutes from "./routes/order.js";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import dashboardRoutes from "./routes/dashboard.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

connectDB();
setupSwagger(app);

app.use("/auth", authRoutes);
app.use("/user", userRoutes);

app.use("/restaurant", restaurantRoutes);
app.use("/menu", menuRoutes);
app.use("/order", orderRoutes);
app.use("/notification", notificationRoutes);
app.use("/rating", ratingRoutes);
app.use("/delivery", deliveryRoutes);
app.use("/dashboard", dashboardRoutes);



const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000", // Explicit default
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ["websocket"], 
  path: "/socket.io/"
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their notification room`);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
}); 

app.set("io", io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT}`)
);
