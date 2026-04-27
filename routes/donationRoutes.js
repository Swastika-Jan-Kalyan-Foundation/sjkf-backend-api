import express from "express";
import {
  createDonation,
  getAllDonations,
  getDonationByDonorId,
  deleteDonationById,
  deleteAllDonations,
  createRazorpayOrder,
  verifyRazorpayPayment
} from "../controllers/donationController.js";

const router = express.Router();

router.post("/", createDonation);
router.get("/", getAllDonations);

// ✅ Static routes first
router.post("/create-order", createRazorpayOrder);
router.post("/verify-payment", verifyRazorpayPayment);
router.delete("/delete-all", deleteAllDonations);

// ✅ Param routes last
router.get("/:donorId", getDonationByDonorId);
router.delete("/:id", deleteDonationById);

export default router;