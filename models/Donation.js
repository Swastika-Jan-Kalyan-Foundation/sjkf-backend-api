import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    donorId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    transactionId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    gatewayTransactionId: {
      type: String,
      trim: true,
      default: "RZPAY-1234-2026"
    },

    gatewayName: {
      type: String,
      trim: true,
      default: "Razorpay"
    },
    paymentMethod: {
      type: String,
      trim: true,
      default: "UPI(Razorpay)"
    },

    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]
    },

    phoneNumber: {
      type: String,
      trim: true
    },

    amount: {
      type: Number,
      required: [true, "Donation amount is required"],
      min: [1, "Donation amount must be at least 1"]
    },

    currency: {
      type: String,
      default: "INR",
      trim: true,
      uppercase: true
    },

    donationPurpose: {
      type: String,
      trim: true,
      default: "General Donation"
    },

    message: {
      type: String,
      trim: true,
      default: ""
    },

    isAnonymous: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const Donation = mongoose.model("Donation", donationSchema);

export default Donation;