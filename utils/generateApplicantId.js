import Donation from "../models/Donation.js";

const generateRandomFourDigits = () => {
  return Math.floor(1000 + Math.random() * 9000);
};

const generateApplicantId = async () => {
  const year = new Date().getFullYear();
  let donorId;
  let exists = true;

  while (exists) {
    
    const randomPart = generateRandomFourDigits();
    donorId = `SJKF-${year}-${randomPart}`;

    const existingDonation = await Donation.findOne({ donorId });
    exists = !!existingDonation;
  }

  return donorId;
};

export default generateApplicantId;