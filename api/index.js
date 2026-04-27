import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "../config/db.js";

import newsletterRoutes from "../routes/newsletterRoutes.js";
import donationRoutes from "../routes/donationRoutes.js";
import volunteerRoutes from "../routes/volunteerRoutes.js";
import contactRoutes from "../routes/contactRoutes.js";

import notFound from "../middleware/notFound.js";
import errorHandler from "../middleware/errorHandler.js";

dotenv.config();

const app = express();

// connect DB inside handler (important)
import mongoose from "mongoose";

let isConnected = false;

const connectDBOnce = async () => {
  if (isConnected) return;

  await connectDB();
  isConnected = true;
};

app.use(
  cors({
    origin: "https://swastikajankalyanfoundation.netlify.app",
    credentials: true
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API running" });
});

app.use("/newsletter", newsletterRoutes);
app.use("/donations", donationRoutes);
app.use("/volunteers", volunteerRoutes);
app.use("/contact", contactRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;