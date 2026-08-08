import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import connectDB from "./config/db.js";
import newsletterRoutes from "./routes/newsletterRoutes.js";
import donationRoutes from "./routes/donationRoutes.js";
import volunteerRoutes from "./routes/volunteerRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import certificateRoutes from './routes/certificateRoutes.js'
import authRoutes from "./routes/authRoutes.js";
import requireAuth from "./middleware/requireAuth.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";
import { Resend } from "resend";
dotenv.config();

const REQUIRED_ENV = ["MONGO_URI", "JWT_SECRET"];
const missingEnv = REQUIRED_ENV.filter((k) => !process.env[k]);
if (missingEnv.length) {
  console.error(`[startup] Missing required env vars: ${missingEnv.join(", ")}`);
  process.exit(1);
}

connectDB();

const app = express();

app.set("trust proxy", 1); 

app.use(helmet());


const allowedOrigins = [
  "https://swastikajankalyanfoundation.netlify.app","https://sjkfadmindashboard.netlify.app", "https://swastikajankalyanfoundation.com", "http://localhost:5173"
];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ message: "SJKF Backend API is running" });
});

/** 
const resend = new Resend(".");


app.post("/send", async (req, res) => {
  try {
    const { to, subject, message } = req.body;

    const data = await resend.emails.send({
      from: "Swastika Jan Kalyan Foundation <ngo@swastikajankalyanfoundation.com>", 
      to,
      subject,
      html: `<p>${message}</p>`,
    });

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});
**/

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);

app.use("/api/newsletter", newsletterRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/contact", contactRoutes);

app.use("/api/certificate", requireAuth, certificateRoutes)

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});