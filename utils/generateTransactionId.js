import Donation from "../models/Donation.js";
import { nanoid } from "nanoid";
const generateRandomFourDigits = () => {
  return Math.floor(1000 + Math.random() * 9000);
};

const generateTransactionId = async () => {
  
  let transactionId;
  let exists = true;
  const count = await Donation.countDocuments();

  const position = String(count + 1).padStart(4, "0");
  

const year = new Date().getFullYear();
  while (exists) {
    const randomPart = nanoid(5);
    transactionId = `SJKF-TXN-${year}-${position}-${randomPart}`;

    const existing = await Donation.findOne({ transactionId });
    exists = !!existing;
  }

  return transactionId;
};

export default generateTransactionId;