import nodemailer from "nodemailer";

/* =========================
   ENV VALIDATION (FAIL FAST)
========================= */
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`❌ Missing environment variable: ${name}`);
  }
  return value;
}

const SMTP_HOST = requireEnv("SMTP_HOST");
const SMTP_PORT = Number(requireEnv("SMTP_PORT"));
const SMTP_USER = requireEnv("SMTP_USER");
const SMTP_PASS = requireEnv("SMTP_PASS");
const APP_URL = requireEnv("NEXT_PUBLIC_APP_URL");

/* =========================
   TRANSPORTER (GMAIL SAFE)
========================= */
export const transporter = nodemailer.createTransport({
  host: SMTP_HOST, // smtp.gmail.com
  port: SMTP_PORT, // 587
  secure: false, // MUST be false for 587
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS, // Gmail App Password
  },
});

/* =========================
   VERIFY ON STARTUP
========================= */
transporter
  .verify()
  .then(() => {
    console.log("✅ SMTP ready: Gmail connected successfully");
  })
  .catch((err) => {
    console.error("❌ SMTP verify failed:", err.message);
    console.error("Full error:", err);
  });

/* =========================
   GENERATE OTP
========================= */
export function generateOTP(): string {
  let otp = "";
  for (let i = 0; i < 6; i++) {
    otp += Math.floor(Math.random() * 10).toString();
  }
  return otp;
}

/* =========================
   SEND RESET EMAIL
========================= */
export async function sendResetPasswordEmail(
  email: string,
  resetToken: string
): Promise<void> {
  const resetUrl = `${APP_URL}/reset-password/${resetToken}`;

  try {
    const info = await transporter.sendMail({
      from: `"InnoPulse Support" <${SMTP_USER}>`,
      to: email,
      subject: "Reset your InnoPulse password",
      html: `
        <div style="font-family:Arial;max-width:600px;margin:auto">
          <h2>Password Reset</h2>
          <p>You requested a password reset.</p>
          <p>
            <a href="${resetUrl}"
               style="display:inline-block;padding:12px 20px;
                      background:#4f46e5;color:#fff;
                      text-decoration:none;border-radius:6px">
              Reset Password
            </a>
          </p>
          <p>This link expires in <strong>15 minutes</strong>.</p>
          <p>If you did not request this, ignore this email.</p>
          <hr />
          <small>InnoPulse © 2025</small>
        </div>
      `,
      text: `Reset your password using this link:\n\n${resetUrl}`,
    });

    console.log("✅ Reset email sent:", {
      to: email,
      messageId: info.messageId,
      accepted: info.accepted,
    });
  } catch (err: any) {
    console.error("❌ EMAIL SEND FAILED");
    console.error({
      message: err.message,
      code: err.code,
      response: err.response,
      responseCode: err.responseCode,
    });

    throw new Error("Failed to send password reset email");
  }
}

/* =========================
   SEND OTP EMAIL (EMAIL VERIFICATION)
========================= */
export async function sendOTPEmail(email: string, otp: string): Promise<void> {
  try {
    const info = await transporter.sendMail({
      from: `"InnoPulse Support" <${SMTP_USER}>`,
      to: email,
      subject: "Your email verification code",
      html: `
        <div style="font-family:Arial;max-width:600px;margin:auto">
          <h2>Email Verification Code</h2>
          <p>You registered for an InnoPulse account. Please verify your email address.</p>
          <div style="text-align:center;margin:20px 0">
            <div style="display:inline-block;padding:20px;
                        background:#f0f0f0;border-radius:8px;
                        font-size:24px;font-weight:bold;
                        letter-spacing:4px;color:#333">
              ${otp}
            </div>
          </div>
          <p style="text-align:center;color:#666">
            Enter this code to verify your email.
          </p>
          <p>This code expires in <strong>10 minutes</strong>.</p>
          <p>If you did not request this, ignore this email.</p>
          <hr />
          <small>InnoPulse © 2025</small>
        </div>
      `,
      text: `Your email verification code is: ${otp}\n\nThis code expires in 10 minutes.`,
    });

    console.log("✅ OTP email sent:", {
      to: email,
      messageId: info.messageId,
      accepted: info.accepted,
    });
  } catch (err: any) {
    console.error("❌ OTP EMAIL SEND FAILED");
    console.error({
      message: err.message,
      code: err.code,
      response: err.response,
      responseCode: err.responseCode,
    });

    throw new Error("Failed to send OTP email");
  }
}

/* =========================
   SEND EMAIL VERIFICATION OTP
========================= */
export async function sendEmailVerificationOTP(email: string, otp: string): Promise<void> {
  try {
    const info = await transporter.sendMail({
      from: `"InnoPulse Support" <${SMTP_USER}>`,
      to: email,
      subject: "Your email verification code",
      html: `
        <div style="font-family:Arial;max-width:600px;margin:auto">
          <h2>Email Verification Code</h2>
          <p>You registered for an InnoPulse account. Please verify your email address.</p>
          <div style="text-align:center;margin:20px 0">
            <div style="display:inline-block;padding:20px;
                        background:#f0f0f0;border-radius:8px;
                        font-size:24px;font-weight:bold;
                        letter-spacing:4px;color:#333">
              ${otp}
            </div>
          </div>
          <p style="text-align:center;color:#666">
            Enter this code to verify your email.
          </p>
          <p>This code expires in <strong>10 minutes</strong>.</p>
          <p>If you did not request this, ignore this email.</p>
          <hr />
          <small>InnoPulse © 2025</small>
        </div>
      `,
      text: `Your email verification code is: ${otp}\n\nThis code expires in 10 minutes.`,
    });

    console.log("✅ Email verification OTP sent:", {
      to: email,
      messageId: info.messageId,
      accepted: info.accepted,
    });
  } catch (err: any) {
    console.error("❌ EMAIL VERIFICATION OTP SEND FAILED");
    console.error({
      message: err.message,
      code: err.code,
      response: err.response,
      responseCode: err.responseCode,
    });

    throw new Error("Failed to send email verification OTP");
  }
}
