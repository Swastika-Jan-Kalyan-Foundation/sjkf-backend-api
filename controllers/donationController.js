import Donation from "../models/Donation.js";
import generateDonorId from "../utils/generateDonorId.js";
import razorpay from "../config/razorpay.js";

import crypto from 'crypto'
import generateTransactionId from "../utils/generateTransactionId.js";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API)
export const createDonation = async (req, res, next) => {
  try {
    const donorId = await generateDonorId();
    const transactionId = await generateTransactionId();

    const donation = await Donation.create({
      donorId,
      transactionId, // 👈 auto-generated here
      gatewayTransactionId: req.body.gatewayTransactionId || "",
      gatewayName: req.body.gatewayName || "",
      fullName: req.body.fullName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      amount: req.body.amount,
      currency: req.body.currency,
      donationPurpose: req.body.donationPurpose,
      message: req.body.message,
      isAnonymous: req.body.isAnonymous
    });

    res.status(201).json({
      message: "Donation recorded successfully",
      data: donation
    });
  } catch (error) {
    next(error);
  }
};

export const getAllDonations = async (req, res, next) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });

    // ADD THESE 3 LINES 👇
    res.set("Cache-Control", "no-store, no-cache, must-revalidate");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");

    res.status(200).json({
      count: donations.length,
      data: donations
    });
  } catch (error) {
    next(error);
  }
};

export const getDonationByDonorId = async (req, res, next) => {
  try {
    const id = req.params.donorId.trim();

    const donation = await Donation.findOne({
      donorId: { $regex: `^${id}$`, $options: "i" }
    });

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    res.status(200).json({ data: donation });
  } catch (error) {
    next(error);
  }
};


export const deleteDonationById = async (req, res, next) => {
  try {
    const donation = await Donation.findByIdAndDelete(req.params.id);

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    res.status(200).json({
      message: "Donation deleted successfully",
      data: donation
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAllDonations = async (req, res, next) => {
  try {
    const result = await Donation.deleteMany({});

    res.status(200).json({
      message: "All donations deleted successfully",
      deletedCount: result.deletedCount
    });
  } catch (error) {
    next(error);
  }
};

export const createRazorpayOrder = async (req, res, next) => {
  try {
    const { amount } = req.body;

    if (!amount || amount < 1) {
      return res.status(400).json({ message: "Valid amount is required" });
    }

    const options = {
      amount: Math.round(Number(amount) * 100), // rupees to paise
      currency: "INR",
      receipt: `SJKF-RZP${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    res.status(201).json({
      message: "Razorpay order created successfully",
      order,
      keyId: process.env.RZP_PROD_KEY_ID
    });
  } catch (error) {
    next(error);
  }
};

export const verifyRazorpayPayment = async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,

      fullName,
      email,
      phoneNumber,
      amount,
      currency,
      donationPurpose,
      message,
      isAnonymous
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Razorpay payment details are required" });
    }

    if (!fullName || !email || !amount) {
      return res.status(400).json({ message: "Full name, email, and amount are required" });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RZP_PROD_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    const existingDonation = await Donation.findOne({
      gatewayTransactionId: razorpay_payment_id
    });

    if (existingDonation) {
      return res.status(409).json({
        message: "This payment has already been recorded",
        data: existingDonation
      });
    }

    const donorId = await generateDonorId();
    const transactionId = await generateTransactionId();

    const donation = await Donation.create({
      donorId,
      transactionId,
      gatewayTransactionId: razorpay_payment_id,
      gatewayName: "Razorpay",
      fullName,
      email,
      phoneNumber,
      amount,
      currency: currency || "INR",
      donationPurpose,
      paymentMethod: "UPI(Razorpay)",
      message,
      isAnonymous
    });

    await resend.emails.send({
      from: "Swastika Jan Kalyan Foundation <ngo@swastikajankalyanfoundation.com>", 
      to: req.body.email,
      subject: "Donation to Swastika Jan Kalyan Foundation",
      html: `
      <div style="background-color:#f4f7f5;padding:32px 16px;font-family:Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td align="center">
            <table width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">
    
              <!-- ORG NAME -->
              <tr>
                <td align="center" style="padding-bottom:24px;">
                  <p style="margin:0;font-size:13px;font-weight:bold;color:#2a6644;letter-spacing:1px;text-transform:uppercase;">Swastika Jan Kalyan Foundation</p>
                </td>
              </tr>
    
              <!-- CARD -->
              <tr>
                <td style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #dde8e3;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    
                    <!-- GREEN HEADER -->
                    <tr>
                      <td style="background:#1f5f46;padding:36px 40px 28px;border-radius:12px 12px 0 0;">
                        <p style="margin:0 0 8px;font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:#74d4a0;">Donation Receipt</p>
                        <h1 style="margin:0 0 10px;font-size:32px;font-weight:bold;color:#ffffff;font-family:Georgia,serif;line-height:1.2;">Thank You for<br/>Your Generosity</h1>
                        <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.65);line-height:1.6;">Your contribution has been successfully received and will go towards making a real difference.</p>
                      </td>
                    </tr>
    
                    <!-- DONOR ID + TRANSACTION ID BAND -->
                    <tr>
                      <td style="background:#174d38;padding:0;">
                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <!-- Donor ID -->
                            <td width="50%" style="padding:20px 24px 20px 40px;border-right:1px solid rgba(255,255,255,0.08);">
                              <p style="margin:0 0 4px;font-size:10px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.4);">Donor ID</p>
                              <p style="margin:0;font-size:18px;font-weight:bold;color:#74d4a0;font-family:Georgia,serif;letter-spacing:0.8px;">${donorId}</p>
                            </td>
                            <!-- Transaction ID -->
                            <td width="50%" style="padding:20px 40px 20px 24px;">
                              <p style="margin:0 0 4px;font-size:10px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.4);">Transaction ID</p>
                              <p style="margin:0;font-size:18px;font-weight:bold;color:#74d4a0;font-family:Georgia,serif;letter-spacing:0.8px;">${transactionId}</p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
    
                    <!-- BODY -->
                    <tr>
                      <td style="padding:40px;">
    
                        <!-- Greeting -->
                        <p style="margin:0 0 20px;font-size:15px;color:#2a3d35;line-height:1.7;">
                          Dear <strong>${fullName}</strong>,
                        </p>
                        <p style="margin:0 0 32px;font-size:15px;color:#4a6358;line-height:1.7;">
                          We've received your donation and are truly grateful for your support. Below is a summary of your contribution for your records.
                        </p>
    
                        <!-- Divider -->
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
                          <tr><td style="height:1px;background:#e4ede8;"></td></tr>
                        </table>
    
                        <!-- Donation details label -->
                        <p style="margin:0 0 16px;font-size:10px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:#a0b8ad;">Donation Details</p>
    
                        <!-- Details box -->
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f6faf7;border-radius:8px;border:1px solid #dde8e3;margin-bottom:32px;">
    
                          <!-- Full Name -->
                          <tr>
                            <td style="padding:14px 20px;border-bottom:1px solid #e8f0ec;">
                              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                  <td style="font-size:12px;color:#8faa9e;font-weight:bold;text-transform:uppercase;letter-spacing:0.8px;">Full Name</td>
                                  <td align="right" style="font-size:14px;color:#1a2b22;font-weight:bold;">${fullName}</td>
                                </tr>
                              </table>
                            </td>
                          </tr>
    
                          <!-- Email -->
                          <tr>
                            <td style="padding:14px 20px;border-bottom:1px solid #e8f0ec;">
                              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                  <td style="font-size:12px;color:#8faa9e;font-weight:bold;text-transform:uppercase;letter-spacing:0.8px;">Email</td>
                                  <td align="right" style="font-size:14px;color:#1a2b22;">${email}</td>
                                </tr>
                              </table>
                            </td>
                          </tr>
    
                          <!-- Phone -->
                          <tr>
                            <td style="padding:14px 20px;border-bottom:1px solid #e8f0ec;">
                              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                  <td style="font-size:12px;color:#8faa9e;font-weight:bold;text-transform:uppercase;letter-spacing:0.8px;">Phone Number</td>
                                  <td align="right" style="font-size:14px;color:#1a2b22;">${phoneNumber}</td>
                                </tr>
                              </table>
                            </td>
                          </tr>
    
                          <!-- Amount -->
                          <tr>
                            <td style="padding:14px 20px;border-bottom:1px solid #e8f0ec;">
                              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                  <td style="font-size:12px;color:#8faa9e;font-weight:bold;text-transform:uppercase;letter-spacing:0.8px;">Amount</td>
                                  <td align="right" style="font-size:16px;color:#1f5f46;font-weight:bold;font-family:Georgia,serif;">${currency} ${amount}</td>
                                </tr>
                              </table>
                            </td>
                          </tr>
    
                          <!-- Donation Purpose -->
                          <tr>
                            <td style="padding:14px 20px;">
                              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                  <td style="font-size:12px;color:#8faa9e;font-weight:bold;text-transform:uppercase;letter-spacing:0.8px;">Donation Purpose</td>
                                  <td align="right" style="font-size:14px;color:#1a2b22;">${donationPurpose}</td>
                                </tr>
                              </table>
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
                          Your generosity helps us continue our work in serving communities across India. We deeply appreciate your trust and support.
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
      message: "Payment verified and donation recorded successfully",
      data: donation
    });
  } catch (error) {
    next(error);
  }
};