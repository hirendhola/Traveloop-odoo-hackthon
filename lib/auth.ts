import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { Resend } from "resend";
import { db } from "./prisma";

const resend = new Resend(process.env.RESEND_API_KEY ?? "");

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const from = process.env.AUTH_EMAIL_FROM ?? "onboarding@resend.dev";
        console.log(`[better-auth] Sending verification email to ${user.email}`);
        const result = await resend.emails.send({
          from,
          to: user.email,
          subject: "Verify your Traveloop email",
          html: `<p>Click <a href="${url}">here</a> to verify your email address.</p><p>If you didn't sign up for Traveloop, you can safely ignore this email.</p>`,
        });
        console.log(`[better-auth] Verification email result:`, result);
      } catch (err) {
        console.error("[better-auth] Failed to send verification email:", err);
        throw err;
      }
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
    resetPasswordTokenExpiresIn: 3600,
    onExistingUserSignUp: async ({ user }, request) => {
      try {
        const from = process.env.AUTH_EMAIL_FROM ?? "onboarding@resend.dev";
        await resend.emails.send({
          from,
          to: user.email,
          subject: "Sign-up attempt with your email",
          html: `<p>Someone tried to create an account using your email address. If this was you, try signing in instead. If not, you can safely ignore this email.</p>`,
        });
      } catch (err) {
        console.error("[better-auth] Failed to send existing user email:", err);
      }
    },
    sendResetPassword: async ({ user, url, token }) => {
      try {
        const from = process.env.AUTH_EMAIL_FROM ?? "onboarding@resend.dev";
        console.log(`[better-auth] Sending reset password email to ${user.email}`);
        const result = await resend.emails.send({
          from,
          to: user.email,
          subject: "Reset your Traveloop password",
          html: `<p>Click <a href="${url}">here</a> to reset your password.</p><p>If you didn't request this, ignore this email.</p>`,
        });
        console.log(`[better-auth] Reset email result:`, result);
      } catch (err) {
        console.error("[better-auth] Failed to send reset password email:", err);
        throw err;
      }
    },
  },
  socialProviders: {},
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await db.userProfile.create({
            data: { userId: user.id },
          });
        },
      },
    },
  },
});
