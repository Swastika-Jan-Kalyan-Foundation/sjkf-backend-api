import NewsletterSubscriber from "../models/NewsletterSubscriber.js";

export const subscribeNewsletter = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const existingSubscriber = await NewsletterSubscriber.findOne({
      email: email.toLowerCase()
    });

    if (existingSubscriber) {
      return res.status(409).json({
        message: "This email is already subscribed to the newsletter"
      });
    }

    const subscriber = await NewsletterSubscriber.create({ email });

    res.status(201).json({
      message: "Newsletter subscription successful",
      data: subscriber
    });
  } catch (error) {
    next(error);
  }
};

export const getAllSubscribers = async (req, res, next) => {
  try {
    const subscribers = await NewsletterSubscriber.find().sort({ createdAt: -1 });

    res.status(200).json({
      count: subscribers.length,
      data: subscribers
    });
  } catch (error) {
    next(error);
  }
};