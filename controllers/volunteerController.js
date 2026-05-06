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
      <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
  
      body {
        background-color: #0f1f1a;
        font-family: 'DM Sans', sans-serif;
        -webkit-font-smoothing: antialiased;
      }
  
      .email-wrapper {
        background: #0f1f1a;
        padding: 48px 16px;
        min-height: 100vh;
      }
  
      .email-container {
        max-width: 620px;
        margin: 0 auto;
      }
  
      /* ── PRE-HEADER ── */
      .pre-header {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        margin-bottom: 32px;
      }
  
      .pre-header-line {
        flex: 1;
        height: 1px;
        background: linear-gradient(to right, transparent, rgba(163, 214, 185, 0.25));
      }
      .pre-header-line.right {
        background: linear-gradient(to left, transparent, rgba(163, 214, 185, 0.25));
      }
  
      .pre-header-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #4fb87a;
      }
  
      .pre-header-text {
        font-family: 'DM Sans', sans-serif;
        font-size: 11px;
        font-weight: 500;
        letter-spacing: 2.5px;
        text-transform: uppercase;
        color: rgba(163, 214, 185, 0.5);
      }
  
      /* ── CARD ── */
      .card {
        background: #ffffff;
        border-radius: 20px;
        overflow: hidden;
      }
  
      /* ── HERO ── */
      .hero {
        background: #132b22;
        padding: 52px 48px 49px;
        position: relative;
        overflow: hidden;
      }
  
      .hero::before {
        content: '';
        position: absolute;
        top: -80px;
        right: -80px;
        width: 320px;
        height: 320px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(79, 184, 122, 0.12) 0%, transparent 70%);
      }
  
      .hero::after {
        content: '';
        position: absolute;
        bottom: -40px;
        left: -60px;
        width: 220px;
        height: 220px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(79, 184, 122, 0.07) 0%, transparent 70%);
      }
  
      .logo-row {
        display: flex;
        align-items: center;
        gap: 14px;
        margin-bottom: 40px;
        position: relative;
        z-index: 1;
      }
  
      .logo-mark {
        width: 44px;
        height: 44px;
        border-radius: 12px;
        background: linear-gradient(135deg, #2a6644, #4fb87a);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
  
      .logo-mark svg {
        width: 22px;
        height: 22px;
        fill: none;
        stroke: #ffffff;
        stroke-width: 1.8;
        stroke-linecap: round;
        stroke-linejoin: round;
      }
  
      .org-name {
        font-family: 'DM Sans', sans-serif;
        font-size: 13px;
        font-weight: 600;
        color: rgba(255,255,255,0.9);
        letter-spacing: 0.3px;
        line-height: 1.3;
      }
  
      .org-tagline {
        font-size: 11px;
        color: rgba(255,255,255,0.4);
        font-weight: 400;
        letter-spacing: 0.2px;
        margin-top: 2px;
      }
  
      .hero-eyebrow {
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 2.5px;
        text-transform: uppercase;
        color: #4fb87a;
        margin-bottom: 16px;
        position: relative;
        z-index: 1;
      }
  
      .hero-title {
        font-family: 'Cormorant Garamond', serif;
        font-size: 52px;
        font-weight: 600;
        color: #ffffff;
        line-height: 1.08;
        position: relative;
        z-index: 1;
        letter-spacing: -0.5px;
      }
  
      .hero-title em {
        font-style: italic;
        color: #74d4a0;
      }
  
      .hero-subtitle {
        font-size: 15px;
        font-weight: 400;
        color: rgba(255,255,255,0.55);
        margin-top: 16px;
        line-height: 1.6;
        position: relative;
        z-index: 1;
        max-width: 400px;
      }
  
      /* ID STRIP */
      .id-strip {
        background: rgba(79, 184, 122, 0.08);
        border: 1px solid rgba(79, 184, 122, 0.18);
        border-radius: 12px;
        padding: 18px 22px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 36px;
        margin-bottom: -1px;
        position: relative;
        z-index: 1;
      }
  
      .id-label {
        font-size: 10px;
        letter-spacing: 1.8px;
        text-transform: uppercase;
        color: rgba(255,255,255,0.35);
        font-weight: 500;
        margin-bottom: 5px;
      }
  
      .id-value {
        font-family: 'Cormorant Garamond', serif;
        font-size: 26px;
        font-weight: 700;
        color: #74d4a0;
        letter-spacing: 1.5px;
      }
  
      .id-badge {
        background: rgba(79, 184, 122, 0.15);
        border: 1px solid rgba(79, 184, 122, 0.3);
        border-radius: 20px;
        padding: 6px 14px;
        font-size: 11px;
        font-weight: 600;
        color: #74d4a0;
        letter-spacing: 0.5px;
        display: flex;
        align-items: center;
        gap: 6px;
      }
  
      .id-badge::before {
        content: '';
        display: inline-block;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #4fb87a;
        animation: pulse 2s infinite;
      }
  
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.4; }
      }
  
      /* ── BODY ── */
      .body-section {
        padding: 52px 48px;
      }
  
      .intro-text {
        font-size: 16px;
        color: #2a3d35;
        line-height: 1.75;
        margin-bottom: 40px;
      }
  
      .intro-text strong {
        color: #1a2b22;
        font-weight: 600;
      }
  
      /* STEPS */
      .steps-label {
        font-size: 10px;
        font-weight: 600;
        letter-spacing: 2px;
        text-transform: uppercase;
        color: #a0b8ad;
        margin-bottom: 20px;
      }
  
      .steps {
        display: flex;
        flex-direction: column;
        gap: 0;
        margin-bottom: 44px;
      }
  
      .step {
        display: flex;
        gap: 20px;
        align-items: flex-start;
        padding: 20px 0;
        border-bottom: 1px solid #f0f4f2;
        position: relative;
      }
  
      .step:last-child {
        border-bottom: none;
      }
  
      .step-num {
        width: 36px;
        height: 36px;
        border-radius: 10px;
        background: #f3f8f5;
        border: 1px solid #d4e8db;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Cormorant Garamond', serif;
        font-size: 17px;
        font-weight: 700;
        color: #2a6644;
        flex-shrink: 0;
      }
  
      .step-content {
        flex: 1;
      }
  
      .step-title {
        font-size: 14px;
        font-weight: 600;
        color: #1a2b22;
        margin-bottom: 3px;
        letter-spacing: 0.1px;
      }
  
      .step-desc {
        font-size: 13px;
        color: #7a9589;
        line-height: 1.55;
      }
  
      /* DIVIDER */
      .divider {
        height: 1px;
        background: linear-gradient(to right, transparent, #d4e8db, transparent);
        margin: 0 0 44px;
      }
  
      /* CTA */
      .cta-block {
        background: linear-gradient(135deg, #132b22 0%, #1f4835 100%);
        border-radius: 16px;
        padding: 36px 40px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 24px;
        margin-bottom: 44px;
        position: relative;
        overflow: hidden;
      }
  
      .cta-block::after {
        content: '';
        position: absolute;
        top: -40px;
        right: -40px;
        width: 180px;
        height: 180px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(79,184,122,0.1) 0%, transparent 70%);
        pointer-events: none;
      }
  
      .cta-text {
        font-family: 'Cormorant Garamond', serif;
        font-size: 24px;
        font-weight: 600;
        color: #ffffff;
        line-height: 1.25;
        max-width: 260px;
      }
  
      .cta-text em {
        font-style: italic;
        color: #74d4a0;
      }
  
      .cta-button {
        display: inline-block;
        background: linear-gradient(135deg, #4fb87a, #2a9455);
        color: #ffffff;
        text-decoration: none;
        font-family: 'DM Sans', sans-serif;
        font-size: 13px;
        font-weight: 600;
        letter-spacing: 0.4px;
        padding: 14px 26px;
        border-radius: 50px;
        white-space: nowrap;
        flex-shrink: 0;
        box-shadow: 0 8px 24px rgba(42, 148, 85, 0.35);
        position: relative;
        z-index: 1;
      }
  
      /* SIGN OFF */
      .signoff {
        font-size: 15px;
        color: #5a7a6a;
        line-height: 1.7;
        margin-bottom: 8px;
      }
  
      .signoff strong {
        display: block;
        font-size: 14px;
        font-weight: 600;
        color: #1a2b22;
        margin-top: 18px;
      }
  
      .signoff span {
        font-size: 13px;
        color: #a0b8ad;
      }
  
      /* ── FOOTER ── */
      .footer {
        background: #f6faf7;
        border-top: 1px solid #e4ede8;
        padding: 28px 48px;
      }
  
      .footer-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
        flex-wrap: wrap;
        gap: 12px;
      }
  
      .footer-logo {
        font-family: 'DM Sans', sans-serif;
        font-size: 13px;
        font-weight: 600;
        color: #2a6644;
        letter-spacing: 0.2px;
      }
  
      .footer-links {
        display: flex;
        gap: 20px;
      }
  
      .footer-links a {
        font-size: 12px;
        color: #7a9589;
        text-decoration: none;
        font-weight: 400;
      }
  
      .footer-divider {
        height: 1px;
        background: #e4ede8;
        margin-bottom: 18px;
      }
  
      .footer-bottom {
        font-size: 11px;
        color: #a0b8ad;
        line-height: 1.6;
        text-align: center;
      }
  
      .footer-bottom a {
        color: #4fb87a;
        text-decoration: none;
        font-weight: 500;
      }
    </style>
    
    <div class="email-wrapper">
    <div class="email-container">

      <!-- Pre-header label -->
      <div class="pre-header">
        <div class="pre-header-line"></div>
        <div class="pre-header-dot"></div>
        <div class="pre-header-text">Application Received</div>
        <div class="pre-header-dot"></div>
        <div class="pre-header-line right"></div>
      </div>

      <div class="card">

        <!-- ── HERO ── -->
        <div class="hero">
          <div class="logo-row">
            <div class="logo-mark">
              <!-- Leaf / nature icon -->
            
              <img style="height: 100%; width: 100%;" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4ANU6WIfviqx0A4LzxjRRmP_xI90ZG4I7OOxZ8XeRMw&s&ec=121657058"/>
            </div>
            <div>
              <div class="org-name">Swastika Jan Kalyan Foundation</div>
              <div class="org-tagline">Serving humanity, building futures</div>
            </div>
          </div>

          <div class="hero-eyebrow">Volunteer Program</div>
          <h1 class="hero-title">
            You're<br/>
            <em>making a</em><br/>
            difference.
          </h1>
          <p class="hero-subtitle">
            Your application has been received. We're honoured to have you with us.
          </p>

          <!-- Application ID -->
          <div class="id-strip">
            <div>
              <div class="id-label">Application ID</div>
              <div class="id-value">${volunteerId}</div>
            </div>
            <div class="id-badge">Under Review</div>
          </div>
        </div>

        <!-- ── BODY ── -->
        <div class="body-section">

          <p class="intro-text">
            Dear <strong>${req.body.name}</strong>,<br/><br/>
            Thank you for choosing to give your time and energy to the Swastika Jan Kalyan Foundation. Our team has received your volunteer application and will carefully review every detail you've shared with us.
          </p>

          <div class="steps-label">What happens next</div>
          <div class="steps">
            <div class="step">
              <div class="step-num">1</div>
              <div class="step-content">
                <div class="step-title">Application Review</div>
                <div class="step-desc">Our volunteer coordination team will review your application within 3–5 business days.</div>
              </div>
            </div>
            <div class="step">
              <div class="step-num">2</div>
              <div class="step-content">
                <div class="step-title">Introductory Call</div>
                <div class="step-desc">If shortlisted, we'll reach out to schedule a brief introductory conversation with you.</div>
              </div>
            </div>
            <div class="step">
              <div class="step-num">3</div>
              <div class="step-content">
                <div class="step-title">Welcome Onboard</div>
                <div class="step-desc">Successful applicants receive a welcome kit and are matched with the right programme.</div>
              </div>
            </div>
          </div>

          <div class="divider"></div>

          <!-- CTA Block -->
          <div class="cta-block">
            <div class="cta-text">
              Explore our <em>work & mission</em> while you wait.
            </div>
            <a href="https://swastikajankalyanfoundation.com" class="cta-button">
              Visit Website →
            </a>
          </div>

          <!-- Sign-off -->
          <p class="signoff">
            If you have any questions in the meantime, please don't hesitate to write to us at <a style="color: #39a364"  href="mailto:info@swastikajankalyanfoundation.com" >info@swastikajankalyanfoundation.com</a> . We're grateful for your kindness and commitment to creating positive change in the community.
            <strong>
              Warm regards,
              <span>The Volunteer Team · Swastika Jan Kalyan Foundation</span>
            </strong>
          </p>

        </div>

        <!-- ── FOOTER ── -->
        <div class="footer">
          
     
          <div class="footer-bottom">
            © ${new Date().getFullYear()} Swastika Jan Kalyan Foundation. All rights reserved.<br/>
            <a href="https://swastikajankalyanfoundation.com">swastikajankalyanfoundation.com</a>
            · Registered NGO, India
          </div>
        </div>

      </div>
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