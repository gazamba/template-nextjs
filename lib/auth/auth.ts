import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";
import { resend } from "@/lib/email/resend";
import * as schema from "@/lib/auth/auth-schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      if (!resend) {
        throw new Error("Resend is not configured. Set RESEND_API_KEY to enable password reset emails.");
      }
      await resend.emails.send({
        from: "noreply@yourdomain.com",
        to: user.email,
        subject: "Reset your password",
        html: `<p>Click <a href="${url}">here</a> to reset your password.</p>`,
      });
    },
  },
});
