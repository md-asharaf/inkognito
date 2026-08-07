import { Resend } from "resend";
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/VerificationEmail";
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(
  email: string,
  username: string,
  verificationUrl: string
): Promise<ApiResponse> {
  const { error } = await resend.emails.send({
    from: `Inkognito <mail@${process.env.RESEND_DOMAIN}>`,
    to: [email],
    subject: "Verify your email address",
    react: VerificationEmail({ username, verificationUrl }),
  });
  if (error) {
    return { success: false, message: error.message };
  }
  return { success: true, message: "verification email sent" };
}
