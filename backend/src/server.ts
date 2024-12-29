import dotenv from "dotenv";
import http from "http";
import app from "./app";
import { connectToDatabase } from "./middlewares";
import { initializeAdminUser } from "./config/initializeAdmin";
import { initializeSocket } from "./config/socket";

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectToDatabase();
    await initializeAdminUser();

    const server = http.createServer(app);

    initializeSocket(server);

    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();
