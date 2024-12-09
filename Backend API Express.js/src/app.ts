import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import router from "./routes";
import cors from "cors";

const app = express();

// Cors Option
app.use(
  cors({
    origin: "*",
    methods: "*",
    allowedHeaders: "*",
  })
);
app.use(express.json());

// APIs Route
app.use("/api", router);

app.listen(8080, () => {
  console.log("Server running on http://localhost:3000");
});
