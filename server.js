import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import newsletterRoutes from "./routes/newsletterRoutes.js";
import donationRoutes from "./routes/donationRoutes.js";
import volunteerRoutes from "./routes/volunteerRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";
import { Resend } from "resend";
dotenv.config();
connectDB();

const app = express();

// ✅ Updated Manual CORS (supports multiple origins)
const allowedOrigins = [
  "https://swastikajankalyanfoundation.netlify.app","https://sjkfadmindashboard.netlify.app"
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "SJKF Backend API is running" });
});


const resend = new Resend("re_ZRPhTi66_693narJsbA65dhzMdB5ZzbA3");


app.post("/send-email", async (req, res) => {
  try {
    const { to, subject, message } = req.body;

    const data = await resend.emails.send({
      from: "Your App <swastikajankalyanfoundation@gmail.com>", 
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