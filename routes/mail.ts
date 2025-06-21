import express, { Request, Response } from "express";

const router = express.Router();

// POST /api/mail/send - Send email (sendmail.ts)
router.post("/send", async (req: Request, res: Response) => {
  try {
    // Note: You'll need to install and configure Resend
    // const { Resend } = require('resend');
    // const resend = new Resend(process.env.RESEND_API_KEY);
    
    // For now, just return a mock response
    console.log("Email sending requested:", req.body);
    
    res.status(200).json({
      message: "Email service not configured yet",
      // data: result,
    });
  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

export default router; 