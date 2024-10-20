import { resend } from "@/lib/resend";
import verificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
import { verify } from "crypto";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  console.log("Inside verify email", username, email, verifyCode);
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "sakshamshrivastav58@gmail.com",
      subject: "Mystry Message | Verification message",
      react: verificationEmail({ username, otp: verifyCode }),
    });
    return { success: true, message: "Verification email sent successfully" };
  } catch (emailError) {
    console.log("Error sending verification email", emailError);
    return { success: false, message: "Failed to send verification email!" };
  }
}
