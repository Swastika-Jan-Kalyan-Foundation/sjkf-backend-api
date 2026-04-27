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
await connectDB();

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

app.use("/api/newsletter", newsletterRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/contact", contactRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;