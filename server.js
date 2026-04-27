import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import newsletterRoutes from "./routes/newsletterRoutes.js";
import donationRoutes from "./routes/donationRoutes.js";
import volunteerRoutes from "./routes/volunteerRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();
connectDB();

const app = express();

// ✅ Proper CORS setup (ONLY this, remove manual headers)
const allowedOrigins = [
  "https://swastikajankalyanfoundation.netlify.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// ✅ Explicitly handle preflight (important for Vercel)
app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "SJKF Backend API is running" });
});

app.use("/api/newsletter", newsletterRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/contact", contactRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});