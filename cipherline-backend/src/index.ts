import "dotenv/config";
import express from "express";
import morgan from "morgan";
import { errorHandler } from "./middlewares/error_handler.js";
import router from "./routers.js";

const app = express();
const PORT = process.env.PORT ?? 3000;
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? "http://localhost:5173";
const ALLOWED_ORIGINS = [CORS_ORIGIN, CORS_ORIGIN.replace("localhost", "127.0.0.1")];

app.use((req, res, next) => {
  const origin = req.headers.origin ?? "";
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : CORS_ORIGIN;
  res.setHeader("Access-Control-Allow-Origin", allowed);
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
});
app.use(morgan("dev"));
app.use(express.json());

app.use("/api", router);

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
