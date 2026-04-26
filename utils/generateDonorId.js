import Donation from "../models/Donation.js";
import { nanoid } from "nanoid";
const generateRandomFourDigits = () => {
  return Math.floor(1000 + Math.random() * 9000);
};

const generateDonorId = async () => {
  const count = await Donation.countDocuments();

    const position = String(count + 1).padStart(4, "0");
    
  
  const year = new Date().getFullYear();
  let donorId;
  let exists = true;

  while (exists) {
    const randomPart = nanoid(5);
    donorId = `SJK-DON-${year}-${position}-${randomPart}`;

    const existingDonation = await Donation.findOne({ donorId });
    exists = !!existingDonation;
  }

  return donorId;
};

export default generateDonorId;