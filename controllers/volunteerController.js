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
      <div style="background-color:#f4f7f5;padding:32px 16px;font-family:Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td align="center">
            <table width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">
    
              <!-- LOGO / ORG NAME -->
              <tr>
                <td align="center" style="padding-bottom:24px;">
                  <p style="margin:0;font-size:13px;font-weight:bold;color:#2a6644;letter-spacing:1px;text-transform:uppercase;">Swastika Jan Kalyan Foundation</p>
                </td>
              </tr>
    
              <!-- CARD -->
              <tr>
                <td style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #dde8e3;">
    
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    
                    <!-- GREEN HEADER BAND -->
                    <tr>
                      <td style="background:#1f5f46;padding:36px 40px;border-radius:12px 12px 0 0;">
                        <p style="margin:0 0 8px;font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:#74d4a0;">Volunteer Program</p>
                        <h1 style="margin:0 0 10px;font-size:32px;font-weight:bold;color:#ffffff;font-family:Georgia,serif;line-height:1.2;">Application Confirmed</h1>
                        <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.65);line-height:1.6;">Your application has been received. We're honoured to have you with us.</p>
                      </td>
                    </tr>
    
                    <!-- APPLICATION ID BOX -->
                    <tr>
                      <td style="background:#174d38;padding:20px 40px;">
                        <p style="margin:0 0 4px;font-size:10px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.4);">Application ID</p>
                        <p style="margin:0;font-size:22px;font-weight:bold;color:#74d4a0;font-family:Georgia,serif;letter-spacing:1px;">${volunteer.applicantId}</p>
                      </td>
                    </tr>
    
                    <!-- BODY -->
                    <tr>
                      <td style="padding:40px;">
    
                        <!-- Greeting -->
                        <p style="margin:0 0 20px;font-size:15px;color:#2a3d35;line-height:1.7;">
                          Dear <strong>${volunteer.name}</strong>,
                        </p>
                        <p style="margin:0 0 32px;font-size:15px;color:#4a6358;line-height:1.7;">
                          Thank you for choosing to volunteer with us. Our team has received your application and will carefully review everything you've shared.
                        </p>
    
                        <!-- Divider -->
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
                          <tr><td style="height:1px;background:#e4ede8;"></td></tr>
                        </table>
    
                        <!-- What's next label -->
                        <p style="margin:0 0 16px;font-size:10px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:#a0b8ad;">What happens next</p>
    
                        <!-- Step 1 -->
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:14px;">
                          <tr>
                            <td width="36" valign="top">
                              <div style="width:28px;height:28px;border-radius:50%;background:#eaf4ee;border:1px solid #c0ddc9;text-align:center;line-height:28px;font-size:13px;font-weight:bold;color:#2a6644;">1</div>
                            </td>
                            <td style="padding-left:12px;">
                              <p style="margin:0 0 2px;font-size:14px;font-weight:bold;color:#1a2b22;">Application Review</p>
                              <p style="margin:0;font-size:13px;color:#7a9589;line-height:1.5;">Our team will review your application within 3–5 business days.</p>
                            </td>
                          </tr>
                        </table>
    
                        <!-- Step 2 -->
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:14px;">
                          <tr>
                            <td width="36" valign="top">
                              <div style="width:28px;height:28px;border-radius:50%;background:#eaf4ee;border:1px solid #c0ddc9;text-align:center;line-height:28px;font-size:13px;font-weight:bold;color:#2a6644;">2</div>
                            </td>
                            <td style="padding-left:12px;">
                              <p style="margin:0 0 2px;font-size:14px;font-weight:bold;color:#1a2b22;">Introductory Call</p>
                              <p style="margin:0;font-size:13px;color:#7a9589;line-height:1.5;">If shortlisted, we'll reach out to schedule a brief call with you.</p>
                            </td>
                          </tr>
                        </table>
    
                        <!-- Step 3 -->
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
                          <tr>
                            <td width="36" valign="top">
                              <div style="width:28px;height:28px;border-radius:50%;background:#eaf4ee;border:1px solid #c0ddc9;text-align:center;line-height:28px;font-size:13px;font-weight:bold;color:#2a6644;">3</div>
                            </td>
                            <td style="padding-left:12px;">
                              <p style="margin:0 0 2px;font-size:14px;font-weight:bold;color:#1a2b22;">Welcome Onboard</p>
                              <p style="margin:0;font-size:13px;color:#7a9589;line-height:1.5;">Successful applicants receive a welcome kit and programme match.</p>
                            </td>
                          </tr>
                        </table>
    
                        <!-- Divider -->
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
                          <tr><td style="height:1px;background:#e4ede8;"></td></tr>
                        </table>
    
                        <!-- CTA Button -->
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
                          <tr>
                            <td align="center">
                              <a href="https://swastikajankalyanfoundation.com" style="display:inline-block;background:#1f5f46;color:#ffffff;text-decoration:none;font-size:14px;font-weight:bold;padding:14px 32px;border-radius:6px;letter-spacing:0.3px;">Visit Our Website</a>
                            </td>
                          </tr>
                        </table>
    
                        <!-- Sign off -->
                        <p style="margin:0 0 4px;font-size:14px;color:#4a6358;line-height:1.7;">
                          If you have any questions, feel free to reach out. We're grateful for your willingness to make a difference.
                        </p>
                        <p style="margin:20px 0 0;font-size:14px;color:#1a2b22;">
                          Warm regards,<br/>
                          <strong>Swastika Jan Kalyan Foundation Team</strong>
                        </p>
    
                      </td>
                    </tr>
    
                    <!-- FOOTER -->
                    <tr>
                      <td style="background:#f1f6f3;border-top:1px solid #dde8e3;padding:20px 40px;border-radius:0 0 12px 12px;">
                        <p style="margin:0;font-size:11px;color:#8faa9e;text-align:center;line-height:1.8;">
                          © ${new Date().getFullYear()} Swastika Jan Kalyan Foundation &nbsp;·&nbsp;
                          <a href="https://swastikajankalyanfoundation.com" style="color:#2a6644;text-decoration:none;font-weight:bold;">swastikajankalyanfoundation.com</a>
                          <br/>Registered NGO, India
                        </p>
                      </td>
                    </tr>
    
                  </table>
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