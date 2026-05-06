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
      <div style="background-color:#0f1f1a;padding:48px 16px;font-family:'DM Sans',Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <div style="max-width:620px;margin:0 auto;">

    <!-- Pre-header -->
    <div style="display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:32px;">
      <div style="flex:1;height:1px;background:rgba(163,214,185,0.2);"></div>
      <div style="width:6px;height:6px;border-radius:50%;background:#4fb87a;"></div>
      <div style="font-size:11px;font-weight:500;letter-spacing:2.5px;text-transform:uppercase;color:rgba(163,214,185,0.5);">Application Received</div>
      <div style="width:6px;height:6px;border-radius:50%;background:#4fb87a;"></div>
      <div style="flex:1;height:1px;background:rgba(163,214,185,0.2);"></div>
    </div>

    <!-- Card -->
    <div style="background:#ffffff;border-radius:20px;overflow:hidden;">

      <!-- HERO -->
      <div style="background:#132b22;padding:52px 48px 40px;">

        <!-- Logo row -->
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:40px;">
          <div style="width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,#2a6644,#4fb87a);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22C12 22 4 16 4 9a8 8 0 0 1 16 0c0 7-8 13-8 13z"/>
              <path d="M12 9v13M9 12l3-3 3 3"/>
            </svg>
          </div>
          <div>
            <div style="font-size:13px;font-weight:600;color:rgba(255,255,255,0.9);letter-spacing:0.3px;line-height:1.3;">Swastika Jan Kalyan Foundation</div>
            <div style="font-size:11px;color:rgba(255,255,255,0.4);font-weight:400;margin-top:2px;">Serving humanity, building futures</div>
          </div>
        </div>

        <!-- Eyebrow -->
        <div style="font-size:11px;font-weight:600;letter-spacing:2.5px;text-transform:uppercase;color:#4fb87a;margin-bottom:16px;">Volunteer Program</div>

        <!-- Title -->
        <h1 style="font-family:Georgia,serif;font-size:52px;font-weight:600;color:#ffffff;line-height:1.08;letter-spacing:-0.5px;margin:0 0 16px;">
          You're<br/>
          <em style="font-style:italic;color:#74d4a0;">making a</em><br/>
          difference.
        </h1>

        <!-- Subtitle -->
        <p style="font-size:15px;font-weight:400;color:rgba(255,255,255,0.55);line-height:1.6;max-width:400px;margin:0 0 36px;">
          Your application has been received. We're honoured to have you with us.
        </p>

        <!-- Application ID strip -->
        <div style="background:rgba(79,184,122,0.08);border:1px solid rgba(79,184,122,0.18);border-radius:12px;padding:18px 22px;display:flex;align-items:center;justify-content:space-between;">
          <div>
            <div style="font-size:10px;letter-spacing:1.8px;text-transform:uppercase;color:rgba(255,255,255,0.35);font-weight:500;margin-bottom:5px;">Application ID</div>
            <div style="font-family:Georgia,serif;font-size:26px;font-weight:700;color:#74d4a0;letter-spacing:1.5px;">${volunteer.applicantId}</div>
          </div>
          <div style="background:rgba(79,184,122,0.15);border:1px solid rgba(79,184,122,0.3);border-radius:20px;padding:6px 14px;font-size:11px;font-weight:600;color:#74d4a0;letter-spacing:0.5px;">
            ● Under Review
          </div>
        </div>

      </div>
      <!-- END HERO -->

      <!-- BODY -->
      <div style="padding:52px 48px;">

        <!-- Intro -->
        <p style="font-size:16px;color:#2a3d35;line-height:1.75;margin:0 0 40px;">
          Dear <strong style="color:#1a2b22;font-weight:600;">${volunteer.name}</strong>,<br/><br/>
          Thank you for choosing to give your time and energy to the Swastika Jan Kalyan Foundation. Our team has received your volunteer application and will carefully review every detail you've shared with us.
        </p>

        <!-- Steps label -->
        <div style="font-size:10px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#a0b8ad;margin-bottom:20px;">What happens next</div>

        <!-- Step 1 -->
        <div style="display:flex;gap:20px;align-items:flex-start;padding:20px 0;border-bottom:1px solid #f0f4f2;">
          <div style="width:36px;height:36px;border-radius:10px;background:#f3f8f5;border:1px solid #d4e8db;display:flex;align-items:center;justify-content:center;font-family:Georgia,serif;font-size:17px;font-weight:700;color:#2a6644;flex-shrink:0;">1</div>
          <div style="flex:1;">
            <div style="font-size:14px;font-weight:600;color:#1a2b22;margin-bottom:3px;">Application Review</div>
            <div style="font-size:13px;color:#7a9589;line-height:1.55;">Our volunteer coordination team will review your application within 3–5 business days.</div>
          </div>
        </div>

        <!-- Step 2 -->
        <div style="display:flex;gap:20px;align-items:flex-start;padding:20px 0;border-bottom:1px solid #f0f4f2;">
          <div style="width:36px;height:36px;border-radius:10px;background:#f3f8f5;border:1px solid #d4e8db;display:flex;align-items:center;justify-content:center;font-family:Georgia,serif;font-size:17px;font-weight:700;color:#2a6644;flex-shrink:0;">2</div>
          <div style="flex:1;">
            <div style="font-size:14px;font-weight:600;color:#1a2b22;margin-bottom:3px;">Introductory Call</div>
            <div style="font-size:13px;color:#7a9589;line-height:1.55;">If shortlisted, we'll reach out to schedule a brief introductory conversation with you.</div>
          </div>
        </div>

        <!-- Step 3 -->
        <div style="display:flex;gap:20px;align-items:flex-start;padding:20px 0;margin-bottom:44px;">
          <div style="width:36px;height:36px;border-radius:10px;background:#f3f8f5;border:1px solid #d4e8db;display:flex;align-items:center;justify-content:center;font-family:Georgia,serif;font-size:17px;font-weight:700;color:#2a6644;flex-shrink:0;">3</div>
          <div style="flex:1;">
            <div style="font-size:14px;font-weight:600;color:#1a2b22;margin-bottom:3px;">Welcome Onboard</div>
            <div style="font-size:13px;color:#7a9589;line-height:1.55;">Successful applicants receive a welcome kit and are matched with the right programme.</div>
          </div>
        </div>

        <!-- Divider -->
        <div style="height:1px;background:linear-gradient(to right,transparent,#d4e8db,transparent);margin-bottom:44px;"></div>

        <!-- CTA block -->
        <div style="background:linear-gradient(135deg,#132b22 0%,#1f4835 100%);border-radius:16px;padding:36px 40px;display:flex;align-items:center;justify-content:space-between;gap:24px;margin-bottom:44px;">
          <div style="font-family:Georgia,serif;font-size:24px;font-weight:600;color:#ffffff;line-height:1.25;max-width:260px;">
            Explore our <em style="font-style:italic;color:#74d4a0;">work &amp; mission</em> while you wait.
          </div>
          <a href="https://swastikajankalyanfoundation.com" style="display:inline-block;background:linear-gradient(135deg,#4fb87a,#2a9455);color:#ffffff;text-decoration:none;font-size:13px;font-weight:600;letter-spacing:0.4px;padding:14px 26px;border-radius:50px;white-space:nowrap;flex-shrink:0;">
            Visit Website →
          </a>
        </div>

        <!-- Sign off -->
        <p style="font-size:15px;color:#5a7a6a;line-height:1.7;margin:0;">
          If you have any questions in the meantime, please don't hesitate to write to us. We're grateful for your kindness and commitment to creating positive change in the community.
        </p>
        <p style="margin:18px 0 0;">
          <span style="font-size:14px;font-weight:600;color:#1a2b22;">Warm regards,</span><br/>
          <span style="font-size:13px;color:#a0b8ad;">The Volunteer Team · Swastika Jan Kalyan Foundation</span>
        </p>

      </div>
      <!-- END BODY -->

      <!-- FOOTER -->
      <div style="background:#f6faf7;border-top:1px solid #e4ede8;padding:28px 48px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;flex-wrap:wrap;gap:12px;">
          <div style="font-size:13px;font-weight:600;color:#2a6644;">Swastika Jan Kalyan Foundation</div>
          <div style="display:flex;gap:20px;">
            <a href="https://swastikajankalyanfoundation.com/privacy" style="font-size:12px;color:#7a9589;text-decoration:none;">Privacy</a>
            <a href="https://swastikajankalyanfoundation.com/contact" style="font-size:12px;color:#7a9589;text-decoration:none;">Contact</a>
            <a href="https://swastikajankalyanfoundation.com/unsubscribe" style="font-size:12px;color:#7a9589;text-decoration:none;">Unsubscribe</a>
          </div>
        </div>
        <div style="height:1px;background:#e4ede8;margin-bottom:18px;"></div>
        <div style="font-size:11px;color:#a0b8ad;line-height:1.6;text-align:center;">
          © ${new Date().getFullYear()} Swastika Jan Kalyan Foundation. All rights reserved.<br/>
          <a href="https://swastikajankalyanfoundation.com" style="color:#4fb87a;text-decoration:none;font-weight:500;">swastikajankalyanfoundation.com</a>
          · Registered NGO, India
        </div>
      </div>
      <!-- END FOOTER -->

    </div>
    <!-- END CARD -->

  </div>
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