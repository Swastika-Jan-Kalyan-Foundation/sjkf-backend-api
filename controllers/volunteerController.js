import Volunteer from "../models/Volunteer.js";
import {v4 as uuidv4} from "uuid"
import { nanoid } from "nanoid";
import AcceptedVolunteer from "../models/AcceptedVolunteers.js";
export const createVolunteer = async (req, res, next) => {
  try {
    const count = await Volunteer.countDocuments();

    const position = String(count + 1).padStart(4, "0");
    const randomPart = nanoid(5);
    const org = "sjkf";
    const type = "appl"; // or APPL
    const year = new Date().getFullYear();
    const volunteerId = `${org}-${type}-${year}-${position}-${randomPart}`;
    const volunteer = await Volunteer.create({
      ...req.body,
      applicantId: volunteerId 
    });

    res.status(201).json({
      message: "Volunteer application submitted successfully",
      data: volunteer
    });
  } catch (error) {
    next(error);
  }
};

export const getAllVolunteers = async (req, res, next) => {
  try {
    const volunteers = await Volunteer.find().sort({ createdAt: -1 });

    res.status(200).json({
      count: volunteers.length,
      data: volunteers
    });
  } catch (error) {
    next(error);
  }
};

export const deleteVolunteerApplicationById = async (req, res, next) => {
  try {
    const volunteer = await Volunteer.findByIdAndDelete(req.params.id);

    if (!volunteer) {
      return res.status(404).json({
        message: "Volunteer application not found"
      });
    }

    res.status(200).json({
      message: "Volunteer application deleted successfully",
      data: volunteer
    });
  } catch (error) {
    next(error);
  }
};

export const rejectVolunteerApplication = async (req, res, next) => {
  try {
    const volunteer = await Volunteer.findByIdAndDelete(req.params.id);

    if (!volunteer) {
      return res.status(404).json({
        message: "Volunteer application not found"
      });
    }

    res.status(200).json({
      message: "Volunteer application rejected and deleted successfully",
      data: volunteer
    });
  } catch (error) {
    next(error);
  }
};

export const acceptVolunteerApplication = async (req, res, next) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id);

    if (!volunteer) {
      return res.status(404).json({
        message: "Volunteer application not found"
      });
    }

    const acceptedVolunteer = await AcceptedVolunteer.create({
      originalApplicationId: volunteer._id,
      name: volunteer.name,
      gender: volunteer.gender,
      dateOfBirth: volunteer.dateOfBirth,
      phoneNumber: volunteer.phoneNumber,
      email: volunteer.email,
      address: volunteer.address,
      instagramId: volunteer.instagramId,
      highestEducationalQualification: volunteer.highestEducationalQualification,
      currentCareerStatus: volunteer.currentCareerStatus,
      skillsAndInterest: volunteer.skillsAndInterest,
      interestedTeams: volunteer.interestedTeams,
      leadershipPreference: volunteer.leadershipPreference,
      previousVolunteerExperience: volunteer.previousVolunteerExperience,
      whyJoinUs: volunteer.whyJoinUs
    });

    await Volunteer.findByIdAndDelete(req.params.id);

    res.status(201).json({
      message: "Volunteer application accepted successfully",
      data: acceptedVolunteer
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAllVolunteerApplications = async (req, res, next) => {
  try {
    const result = await Volunteer.deleteMany({});

    res.status(200).json({
      message: "All volunteer applications deleted successfully",
      deletedCount: result.deletedCount
    });
  } catch (error) {
    next(error);
  }
};

export const getAllAcceptedVolunteers = async (req, res, next) => {
  try {
    const acceptedVolunteers = await AcceptedVolunteer.find().sort({
      createdAt: -1
    });

    res.status(200).json({
      count: acceptedVolunteers.length,
      data: acceptedVolunteers
    });
  } catch (error) {
    next(error);
  }
};