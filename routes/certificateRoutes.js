import express from "express";
import {
    issueCertificate,
    getCertificateByCertificateId,
    getAllCertificates,

} from "../controllers/certificateController.js";

const router = express.Router();

router.post("/", issueCertificate);
router.get("/", getAllCertificates);

router.get("/:certificateId", getCertificateByCertificateId);


export default router;