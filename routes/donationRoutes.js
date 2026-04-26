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
router.get("/:donorId", getDonationByDonorId);


router.post("/create-order", createRazorpayOrder);
router.post("/verify-payment", verifyRazorpayPayment);

router.delete("/:id", deleteDonationById);
router.delete("/delete-all", deleteAllDonations);



export default router;