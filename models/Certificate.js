import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
    {
        certificateId: {
            type: String, 
       
            unique: true
        },
        issueDate: {
            type: Date,
            required: [true, "Issue Date is required"],
        },
        issuedTo: {
            type: String,
            trim: true,
        },
        certificateSummary: {
            type: String,
            trim: true
        },
        certificateTitle: {
            type: String,
            trim: true
        },
        modeOfIssue: {
            type: String,
            trim: true, 
            enum: ["Online with DSC", "Offline with Physical Sign", "Both"],
        },
        physicalCopy: {
            type: String,
            trim: true,
            enum: ["Yes", "No"]
        },
        signingAutority: {
            type: String,
            trim: true,
            default: "Ajay Kumar Sinha"
        },
        recommender: {
            type: String,
            trim: true,
            default: "Apoorv Harsh"
        }
    }
)

export const Certificate = mongoose.model("Certificate", certificateSchema)