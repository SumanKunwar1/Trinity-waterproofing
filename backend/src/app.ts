import express, { Request, Response, NextFunction } from "express";
import cors from "cors"; // Ensure CORS is imported
import routes from "./routers";
import cookieParser from "cookie-parser";
import { BASE_URL, environment } from "./config/uploadConstants";

const app = express();
app.use(cookieParser());

declare global {
  namespace Express {
    interface Request {
      email: string;
      role: string;
    }
  }
}
// Middleware
app.use(express.json({ limit: "50mb" })); // Increase the limit to 50mb for JSON payloads
app.use(express.urlencoded({ extended: true, limit: "50mb" })); // Increase the limit to 50mb for URL-encoded payloads

const corsOptions =
  environment === "production"
    ? {
        origin: BASE_URL,
        methods: ["GET", "POST", "PUT", "DELETE"],
      }
    : {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
      };

app.use(cors(corsOptions));
// Route handlers
app.use("/api", routes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, welcome to the Express + TypeScript app!");
});

export default app;
