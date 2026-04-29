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

router.get("/accepted", getAllAcceptedVolunteers);

// ✅ Static routes first
router.delete("/delete-all", deleteAllVolunteerApplications);

// ✅ Param routes last
router.post("/:id/reject", rejectVolunteerApplication);
router.post("/:id/accept", acceptVolunteerApplication);
router.delete("/:id", deleteVolunteerApplicationById);

export default router;