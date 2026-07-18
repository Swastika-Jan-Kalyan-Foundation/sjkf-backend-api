import { nanoid } from "nanoid";
import { Certificate } from "../models/Certificate.js";

export const issueCertificate = async (req, res, next) => {
    try {
        console.log("BODY:", req.body);
        

        const certificate = await Certificate.create(req.body);
        
        console.log("SAVED:", certificate);

        res.status(201).json({
            message: "Certificate successfully issued", 
            data: certificate
        });
    } catch (error) {
        next(error);
    }
}

export const getCertificateByCertificateId = async (req, res, next) => {
    try {
      const id = req.params.certificateId.trim();
      const { issueDate } = req.query;
  
      const start = new Date(issueDate);
      start.setHours(0, 0, 0, 0);
  
      const end = new Date(issueDate);
      end.setHours(23, 59, 59, 999);
  
      const certificate = await Certificate.findOne({
        certificateId: { $regex: `^${id}$`, $options: "i" },
        issueDate: {
          $gte: start,
          $lte: end
        }
      });
  
      if (!certificate) {
        return res.status(404).json({ message: "Certificate not found" });
      }
  
      res.status(200).json({ data: certificate });
    } catch (error) {
      next(error);
    }
  };

export const getAllCertificates = async (req, res, next) => {
  try {
    const certificates = await Certificate.find().sort({ createdAt: -1 });
 

    res.status(200).json({
      count: certificates.length,
      data: certificates
    });
  } catch (error) {
    next(error);
  }
};