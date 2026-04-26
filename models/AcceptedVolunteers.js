import mongoose from "mongoose";

const acceptedVolunteerSchema = new mongoose.Schema(
  {
    originalApplicationId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: "Volunteer"
    },

    name: String,
    gender: String,
    dateOfBirth: Date,
    phoneNumber: String,
    email: String,
    address: String,
    instagramId: String,
    highestEducationalQualification: String,
    currentCareerStatus: String,
    skillsAndInterest: String,
    interestedTeams: [String],
    leadershipPreference: String,
    previousVolunteerExperience: String,
    whyJoinUs: String,

    acceptedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    collection: "sjkfvolunteers"
  }
);

const AcceptedVolunteer = mongoose.model("SjkfVolunteers", acceptedVolunteerSchema);

export default AcceptedVolunteer;