import Volunteer from "../models/Volunteer.js";
import {v4 as uuidv4} from "uuid"
import { nanoid } from "nanoid";
import AcceptedVolunteer from "../models/AcceptedVolunteers.js";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API);
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

  
    await resend.emails.send({
      from: "Swastika Jan Kalyan Foundation <ngo@swastikajankalyanfoundation.com>", 
      to: req.body.email,
      subject: "Volunteer Application to Swastika Jan Kalyan Foundation",
      html: `
  <div style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 0;">
      <tr>
        <td align="center">
          
          <!-- Container -->
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
            
            <!-- Header -->
            <tr>
              <td style="background:#0d6efd;padding:20px;text-align:center;color:#ffffff;">
                <h1 style="margin:0;font-size:22px;">Swastika Jan Kalyan Foundation</h1>
                <p style="margin:5px 0 0;font-size:14px;opacity:0.9;">Volunteer Application Confirmation</p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:30px;">
                <h2 style="margin-top:0;color:#333;">Thank you for applying!</h2>
                
                <p style="color:#555;font-size:15px;line-height:1.6;">
                  We’ve successfully received your volunteer application. Our team will review your submission and get back to you shortly.
                </p>

                <!-- Application ID Box -->
                <div style="margin:25px 0;padding:15px;background:#f1f5ff;border-left:4px solid #0d6efd;border-radius:6px;">
                  <p style="margin:0;font-size:14px;color:#333;">
                    <strong>Application ID:</strong><br/>
                    <span style="font-size:16px;color:#0d6efd;font-weight:bold;">
                      ${volunteerId}
                    </span>
                  </p>
                </div>

                <p style="color:#555;font-size:15px;line-height:1.6;">
                  Please keep this ID for future reference regarding your application status.
                </p>

                <!-- CTA Button -->
                <div style="text-align:center;margin:30px 0;">
                  <a href="https://swastikajankalyanfoundation.com" 
                     style="background:#0d6efd;color:#ffffff;text-decoration:none;padding:12px 25px;border-radius:6px;font-size:14px;display:inline-block;">
                    Visit Our Website
                  </a>
                </div>

                <p style="color:#777;font-size:13px;line-height:1.5;">
                  If you have any questions, feel free to reach out to us. We appreciate your interest in contributing to our mission.
                </p>

                <p style="margin-top:25px;color:#333;font-size:14px;">
                  Warm regards,<br/>
                  <strong>Swastika Jan Kalyan Foundation Team</strong>
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f8f9fa;padding:15px;text-align:center;font-size:12px;color:#888;">
                © ${new Date().getFullYear()} Swastika Jan Kalyan Foundation<br/>
                <a href="https://swastikajankalyanfoundation.com" style="color:#0d6efd;text-decoration:none;">
                  swastikajankalyanfoundation.com
                </a>
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>
  </div>
`
    })

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
    res.set("Cache-Control", "no-store, no-cache, must-revalidate");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");

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

export const deleteAcceptedVolunteerById = async (req, res, next) => {
  try {
    const acceptedVolunteer = await AcceptedVolunteer.findByIdAndDelete(req.params.id);

    if (!acceptedVolunteer) {
      return res.status(404).json({
        message: "Accepted volunteer not found"
      });
    }

    res.status(200).json({
      message: "Accepted volunteer deleted successfully",
      data: acceptedVolunteer
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