import Donation from "../models/Donation.js";
import generateDonorId from "../utils/generateDonorId.js";
import razorpay from "../config/razorpay.js";

import crypto from 'crypto'
import generateTransactionId from "../utils/generateTransactionId.js";

export const createDonation = async (req, res, next) => {
  try {
    const donorId = await generateDonorId();
    const transactionId = await generateTransactionId();

    const donation = await Donation.create({
      donorId,
      transactionId, // 👈 auto-generated here
      gatewayTransactionId: req.body.gatewayTransactionId || "",
      gatewayName: req.body.gatewayName || "",
      fullName: req.body.fullName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      amount: req.body.amount,
      currency: req.body.currency,
      donationPurpose: req.body.donationPurpose,
      message: req.body.message,
      isAnonymous: req.body.isAnonymous
    });

    res.status(201).json({
      message: "Donation recorded successfully",
      data: donation
    });
  } catch (error) {
    next(error);
  }
};

export const getAllDonations = async (req, res, next) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });

    res.status(200).json({
      count: donations.length,
      data: donations
    });
  } catch (error) {
    next(error);
  }
};

export const getDonationByDonorId = async (req, res, next) => {
  try {
    const id = req.params.donorId.trim();

    const donation = await Donation.findOne({
      donorId: { $regex: `^${id}$`, $options: "i" }
    });

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    res.status(200).json({ data: donation });
  } catch (error) {
    next(error);
  }
};


export const deleteDonationById = async (req, res, next) => {
  try {
    const donation = await Donation.findByIdAndDelete(req.params.id);

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    res.status(200).json({
      message: "Donation deleted successfully",
      data: donation
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAllDonations = async (req, res, next) => {
  try {
    const result = await Donation.deleteMany({});

    res.status(200).json({
      message: "All donations deleted successfully",
      deletedCount: result.deletedCount
    });
  } catch (error) {
    next(error);
  }
};

export const createRazorpayOrder = async (req, res, next) => {
  try {
    const { amount } = req.body;

    if (!amount || amount < 1) {
      return res.status(400).json({ message: "Valid amount is required" });
    }

    const options = {
      amount: Math.round(Number(amount) * 100), // rupees to paise
      currency: "INR",
      receipt: `SJKF-RZP${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    res.status(201).json({
      message: "Razorpay order created successfully",
      order,
      keyId: process.env.RZP_PROD_KEY_ID
    });
  } catch (error) {
    next(error);
  }
};

export const verifyRazorpayPayment = async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,

      fullName,
      email,
      phoneNumber,
      amount,
      currency,
      donationPurpose,
      message,
      isAnonymous
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Razorpay payment details are required" });
    }

    if (!fullName || !email || !amount) {
      return res.status(400).json({ message: "Full name, email, and amount are required" });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RZP_PROD_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    const existingDonation = await Donation.findOne({
      gatewayTransactionId: razorpay_payment_id
    });

    if (existingDonation) {
      return res.status(409).json({
        message: "This payment has already been recorded",
        data: existingDonation
      });
    }

    const donorId = await generateDonorId();
    const transactionId = await generateTransactionId();

    const donation = await Donation.create({
      donorId,
      transactionId,
      gatewayTransactionId: razorpay_payment_id,
      gatewayName: "Razorpay",
      fullName,
      email,
      phoneNumber,
      amount,
      currency: currency || "INR",
      donationPurpose,
      paymentMethod: "UPI(Razorpay)",
      message,
      isAnonymous
    });

    res.status(201).json({
      message: "Payment verified and donation recorded successfully",
      data: donation
    });
  } catch (error) {
    next(error);
  }
};