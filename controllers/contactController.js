import ContactMessage from "../models/ContactMessage.js";

export const createContactMessage = async (req, res, next) => {
  try {
    const { fullName, phoneNumber, email, concern, message } = req.body;

    if (!fullName || !phoneNumber || !email || !concern || !message) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const contactMessage = await ContactMessage.create({
      fullName,
      phoneNumber,
      email,
      concern,
      message
    });

    res.status(201).json({
      message: "Your message has been submitted successfully",
      data: contactMessage
    });
  } catch (error) {
    next(error);
  }
};

export const getAllContactMessages = async (req, res, next) => {
  try {
    const contactMessages = await ContactMessage.find().sort({ createdAt: -1 });

    res.status(200).json({
      count: contactMessages.length,
      data: contactMessages
    });
  } catch (error) {
    next(error);
  }
};