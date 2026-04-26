import mongoose from "mongoose";

const volunteerSchema = new mongoose.Schema(
  {
    applicantId: {
      type: String, 
      required: false,
      unique: true
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      trim: true,
      enum: ["Male", "Female", "Non-binary", "Prefer not to say"]
    },
    dateOfBirth: {
      type: Date,
      required: [true, "Date of birth is required"]
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "Email ID is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true
    },
    instagramId: {
      type: String,
      trim: true,
      default: ""
    },
    highestEducationalQualification: {
      type: String,
      required: [true, "Highest educational qualification is required"],
      trim: true
    },
    currentCareerStatus: {
      type: String,
      required: [true, "Current career status is required"],
      enum: ["Student", "Job", "Drop Year", "Other"]
    },
    skillsAndInterest: {
      type: String,
      required: [true, "Skills and interest are required"],
      trim: true
    },
    interestedTeams: {
      type: [String],
      required: [true, "Please select at least one team"],
      enum: [
        "Content Writing Team",
        "Graphics Designing & Photography Team",
        "Social Media Team",
        "PR & Marketing Team",
        "Human Resources Team",
        "Operations Team",
        "Research & Planning Team"
      ]
    },
    leadershipPreference: {
      type: String,
      required: [true, "Leadership preference is required"],
      enum: ["Leader", "Co-Leader", "No"]
    },
    previousVolunteerExperience: {
      type: String,
      trim: true,
      default: ""
    },
    whyJoinUs: {
      type: String,
      required: [true, "Please tell us why you want to join"],
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const Volunteer = mongoose.model("Volunteer", volunteerSchema);

export default Volunteer;