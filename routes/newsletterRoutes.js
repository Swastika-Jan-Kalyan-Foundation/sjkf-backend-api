import express from "express";
import { subscribeNewsletter, getAllSubscribers } from "../controllers/newsletterController.js";
const router = express.Router()

router.post("/subscribe", subscribeNewsletter)
router.get("/", getAllSubscribers)

export default router