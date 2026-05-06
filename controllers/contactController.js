import ContactMessage from "../models/ContactMessage.js";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API)

export const createContactMessage = async (req, res, next) => {
  try {
    const { fullName, phoneNumber, email, concern, message } = req.body;

    if (!fullName || !phoneNumber || !email || !concern || !message) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const contactMessage = await ContactMessage.create({
      fullName,
      phoneNumber,
      email,
      concern,
      message
    });

    await resend.emails.send({
      from: email,
      to: "info@swastikajankalyanfoundation.com",
      subject: concern,
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
                    <p style="margin:0 0 8px;font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:#74d4a0;">Contact Form</p>
                    <h1 style="margin:0 0 10px;font-size:32px;font-weight:bold;color:#ffffff;font-family:Georgia,serif;line-height:1.2;">New Message<br/>Received</h1>
                    <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.65);line-height:1.6;">Someone has reached out via the contact form on your website.</p>
                  </td>
                </tr>

                <!-- BODY -->
                <tr>
                  <td style="padding:40px;">

                    <!-- Details label -->
                    <p style="margin:0 0 16px;font-size:10px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:#a0b8ad;">Sender Details</p>

                    <!-- Name + Phone box -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f6faf7;border-radius:8px;border:1px solid #dde8e3;margin-bottom:28px;">

                      <tr>
                        <td style="padding:14px 20px;border-bottom:1px solid #e8f0ec;">
                          <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td width="40%" style="font-size:12px;color:#8faa9e;font-weight:bold;text-transform:uppercase;letter-spacing:0.8px;">Name</td>
                              <td width="60%" align="right" style="font-size:14px;color:#1a2b22;font-weight:bold;">${fullName}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>

                      <tr>
                        <td style="padding:14px 20px;">
                          <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td width="40%" style="font-size:12px;color:#8faa9e;font-weight:bold;text-transform:uppercase;letter-spacing:0.8px;">Phone</td>
                              <td width="60%" align="right" style="font-size:14px;color:#1a2b22;">${phoneNumber}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>

                    </table>

                    <!-- Message label -->
                    <p style="margin:0 0 12px;font-size:10px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:#a0b8ad;">Their Message</p>

                    <!-- Message box -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
                      <tr>
                        <td style="background:#f6faf7;border-radius:8px;border:1px solid #dde8e3;border-left:4px solid #1f5f46;padding:20px 24px;">
                          <p style="margin:0;font-size:15px;color:#2a3d35;line-height:1.75;">${message}</p>
                        </td>
                      </tr>
                    </table>

                    <!-- Divider -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
                      <tr><td style="height:1px;background:#e4ede8;"></td></tr>
                    </table>

                    <p style="margin:0;font-size:13px;color:#8faa9e;line-height:1.6;">
                      This message was sent via the contact form at <a href="https://swastikajankalyanfoundation.com" style="color:#2a6644;text-decoration:none;font-weight:bold;">swastikajankalyanfoundation.com</a>
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
</div>`
    })

    res.status(201).json({
      message: "Your message has been submitted successfully",
      data: contactMessage
    });
  } catch (error) {
    next(error);
  }
};

export const getAllContactMessages = async (req, res, next) => {
  try {
    const contactMessages = await ContactMessage.find().sort({ createdAt: -1 });

    res.status(200).json({
      count: contactMessages.length,
      data: contactMessages
    });
  } catch (error) {
    next(error);
  }
};