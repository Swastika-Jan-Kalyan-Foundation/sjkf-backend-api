import { nanoid } from "nanoid";
import { Certificate } from "../models/Certificate.js";

export const issueCertificate = async (req, res, next) => {
    try {
        const certiCount = await Certificate.countDocuments()
        const randomPart = nanoid(5)
        const org = "SJKF"
        const type = "CERTI"
        const year = new Date().getFullYear()
        const certiId = `${org}-${type}-${year}-${certiCount}-${randomPart}`
        
        console.log("BODY:", req.body);
        const rawId = req.body.certificateId || "";
        const finalCertificateId = rawId.trim() !== "" ? rawId.trim() : certiId;

        const certificate = await Certificate.create({
          ...req.body,
          certificateId: finalCertificateId,
        });
        
        console.log("SAVED:", certificate);

        res.status(201).json({
            message: "Certificate successfully issued", 
            data: certificate
        })
    } catch (error) {
        next(error)
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