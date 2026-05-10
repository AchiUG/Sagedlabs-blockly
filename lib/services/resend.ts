
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: 'SAGED <onboarding@resend.dev>', // Update this to your verified domain in production
      to: email,
      subject: 'Reset your SAGED password',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h2 style="color: #124734; text-align: center;">Reset Your Password</h2>
          <p style="color: #4b5563; line-height: 1.6;">
            We received a request to reset your password for your SAGED account. If you didn't make this request, you can safely ignore this email.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #124734; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="color: #6b7280; font-size: 0.875rem; text-align: center;">
            This link will expire in 1 hour.
          </p>
          <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
          <p style="color: #9ca3af; font-size: 0.75rem; text-align: center;">
            &copy; ${new Date().getFullYear()} SAGED. Africa at the Center of Tomorrow's Intelligence.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend email error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Failed to send reset email:', err);
    return { success: false, error: err };
  }
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: 'SAGED <onboarding@resend.dev>',
      to: email,
      subject: 'Verify your SAGED account',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h2 style="color: #124734; text-align: center;">Welcome to SAGED!</h2>
          <p style="color: #4b5563; line-height: 1.6;">
            Thanks for joining the SAGED family! Please confirm your email address to activate your account and start your AI learning journey.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmLink}" style="background-color: #124734; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
          <p style="color: #9ca3af; font-size: 0.75rem; text-align: center;">
            &copy; ${new Date().getFullYear()} SAGED. Africa at the Center of Tomorrow's Intelligence.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend verification error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Failed to send verification email:', err);
    return { success: false, error: err };
  }
};
