import express from "express";
import {
  createContactMessage,
  getAllContactMessages
} from "../controllers/contactController.js";

const router = express.Router();

router.post("/", createContactMessage);
router.get("/", getAllContactMessages);

export default router;