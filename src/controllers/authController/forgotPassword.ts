import { NextFunction, Request, Response } from "express";
import { sendMail } from "../../services/mailService";
import User, { IUser } from "../../models/user";
import { randomBytes } from "crypto";

export const sendOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user: IUser | null = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "No user found associated with this email" });
    }

    user.otp = generateSecureOTP();

    const from: string = "no-replay@prepup.com";
    const to: string = email;
    const subject: string = "PreUp account verification";
    const mailTemplate: string = `<div style="text-align: center;"> <br>Paste this verification code into PrepUp app to reset account password</br> <h1><b>${user.otp}</b></h1> </div>`;

    try {
      await sendMail(from, to, subject, mailTemplate);
      await user.save();

      return res
        .status(200)
        .json({ message: "Email with reset password otp sent successfully" });
    } catch (error) {}
  } catch (error) {
    res.status(500).json({ error: "Failed to sendOtp for password" });

    console.error("Failed to sendOtp for password ====>");
    console.log("Request body:", req.body);
    console.log("Request headers:", req.headers);
    console.log("Request query params:", req.query);
    console.log("Request URL params:", req.params);
    console.log("Request method:", req.method);
    console.log("Request URL:", req.url);
    console.error("Error: " + error);
  }

  next();
};

/**
 * Generates a secure random OTP.
 * @param length - The desired length of the OTP (default is 6).
 * @returns The generated OTP as a string.
 */
function generateSecureOTP(length: number = 6): string {
  // Generate random bytes
  const bytes = randomBytes(length);

  // Convert to a number and mod by 10^length to get a number within the desired range
  const otp = parseInt(bytes.toString("hex"), 16) % 10 ** length;

  // Return OTP padded with zeros to ensure it's the correct length
  return otp.toString().padStart(length, "0");
}

export const verifyOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user: IUser | null = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "No user found associated with this email" });
    }

    if (user.otp !== "") {
      if (user.otp === otp) {
        user.otp = ""; 
        await user.save();
        return res.status(200).json({ message: "OTP verified successfully" });
      } else {
        return res.status(401).json({ message: "OTP mismatched" });
      }
    } else {
      return res.status(400).json({ message: "You need to generate an OTP" });
    }

  } catch (error) {
    res.status(500).json({ error: "Failed to verify otp" });

    console.error("Failed to verify otp ====> ");
    console.log("Request body:", req.body);
    console.log("Request headers:", req.headers);
    console.log("Request query params:", req.query);
    console.log("Request URL params:", req.params);
    console.log("Request method:", req.method);
    console.log("Request URL:", req.url);
    console.error("Error: " + error);
  }

  next();
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const { email, password } = req.body;

    if (!password || !email) {
      return res.status(400).json({ message: "Email and Password are required" });
    }
    const user: IUser | null = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "No user found associated with this email" });
    }

    user.password = password;

    await user.save();
    
    return res.status(200).json({ message: "password updated successfully" });

  } catch (error) {
    res.status(500).json({ error: "Failed to set Password" });

    console.error("Failed to set Password ====> ");
    console.log("Request body:", req.body);
    console.log("Request headers:", req.headers);
    console.log("Request query params:", req.query);
    console.log("Request URL params:", req.params);
    console.log("Request method:", req.method);
    console.log("Request URL:", req.url);
    console.error("Error: " + error);
  }

  next();
};