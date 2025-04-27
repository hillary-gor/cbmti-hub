import { sendEmail } from "@/lib/email";

interface LegacyStudentEmailProps {
  email: string;
  password: string;
  reg_number: string;
  full_name: string;
}

export async function sendLegacyStudentEmail({
  email,
  password,
  reg_number,
  full_name,
}: LegacyStudentEmailProps) {
  await sendEmail({
    to: email,
    subject: "Your CBMTI Student Portal Login Details",
    html: `
    <div style="max-width: 600px; margin: auto; padding: 20px; font-family: Arial, sans-serif; color: #333;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://gowiaewbjsdsvihqmsyg.supabase.co/storage/v1/object/public/assets//logo.svg" alt="CBMTI Logo" style="height: 60px;">
      </div>

      <h2 style="text-align: center; color: #0056b3;">Welcome to CBMTI, ${full_name}!</h2>

      <p>Dear ${full_name},</p>

      <p>Welcome to the CBMTI Student Portal. Below are your login credentials:</p>

      <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Registration Number:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${reg_number}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Email:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${email}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Temporary Password:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${password}</td>
        </tr>
      </table>

      <div style="text-align: center; margin: 30px 0;">
        <a href="https://portal.cbmti.co.ke/login" style="background-color: #0056b3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Login to Portal</a>
      </div>

      <p><strong>Important:</strong> Please login and change your password immediately after your first login for security purposes.</p>

      <p>If you experience any issues, please contact the system administrator.</p>

      <hr style="margin: 40px 0; border: none; border-top: 1px solid #eee;">

      <p style="font-size: 12px; color: #888; text-align: center;">
        © ${new Date().getFullYear()} CBMTI. All rights reserved.
      </p>
    </div>
    `,
  });
}
