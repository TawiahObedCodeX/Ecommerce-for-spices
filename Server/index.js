import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import paymentRoutes from "./routes/payment.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev")); // Logging middleware

app.use("/api/payment", paymentRoutes);

app.get("/", (req, res) => res.send("Backend is running"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));