import express from "express";
import {
  createVolunteer,
  getAllVolunteers,
  deleteVolunteerApplicationById,
  rejectVolunteerApplication,
  acceptVolunteerApplication,
  deleteAllVolunteerApplications
} from "../controllers/volunteerController.js";

const router = express.Router();

router.post("/", createVolunteer);
router.get("/", getAllVolunteers);

router.delete("/delete-all", deleteAllVolunteerApplications);
router.delete("/:id", deleteVolunteerApplicationById);

router.post("/:id/reject", rejectVolunteerApplication);
router.post("/:id/accept", acceptVolunteerApplication);

export default router;