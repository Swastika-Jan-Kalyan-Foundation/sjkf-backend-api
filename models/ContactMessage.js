import mongoose from "mongoose";

const contactMessageSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true
    },

    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true
    },

    email: {
      type: String,
      required: [true, "Email address is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]
    },

    concern: {
      type: String,
      required: [true, "Concern is required"],
      enum: [
        "General Query",
        "Volunteering",
        "Donations & Funding",
        "Tree Plantation Drive",
        "Partnership & Collaboration",
        "Media and Press",
        "Careers",
        "Report an Issue"
      ]
    },

    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const ContactMessage = mongoose.model("ContactMessage", contactMessageSchema);

export default ContactMessage;