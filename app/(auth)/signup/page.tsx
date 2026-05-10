"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, User, Mail, Lock } from "lucide-react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Name is required");
      return;
    }
    if (!trimmedEmail) {
      setError("Email is required");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await authClient.signUp.email({
        email: trimmedEmail,
        password,
        name: trimmedName,
      });

      if (res.error) {
        setError(res.error.message ?? "Something went wrong");
        setLoading(false);
        return;
      }

      setSuccess(true);
    } catch (err: any) {
      setLoading(false);
      setError(err?.message ?? "Something went wrong. Please try again.");
    }
  }

  if (success) {
    return <VerifyEmailState email={email} />;
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="font-heading text-3xl font-light text-[#F0EDE6]">
          Start Your Journey
        </h1>
        <p className="mt-2 text-sm text-[rgba(240,237,230,0.45)]">Create your Traveloop account</p>
      </div>

      <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-6 backdrop-blur-sm">
        <form onSubmit={handleSignup} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[rgba(240,237,230,0.7)]">Name</Label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(240,237,230,0.35)]" />
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] pl-10 text-[#F0EDE6] placeholder:text-[rgba(240,237,230,0.3)] focus:border-[#E8C547] focus:ring-[#E8C547]/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-[rgba(240,237,230,0.7)]">Email</Label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(240,237,230,0.35)]" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] pl-10 text-[#F0EDE6] placeholder:text-[rgba(240,237,230,0.3)] focus:border-[#E8C547] focus:ring-[#E8C547]/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-[rgba(240,237,230,0.7)]">Password</Label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(240,237,230,0.35)]" />
              <Input
                id="password"
                type="password"
                placeholder="At least 8 characters"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] pl-10 text-[#F0EDE6] placeholder:text-[rgba(240,237,230,0.3)] focus:border-[#E8C547] focus:ring-[#E8C547]/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-[rgba(240,237,230,0.7)]">Confirm Password</Label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(240,237,230,0.35)]" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Repeat your password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-11 border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] pl-10 text-[#F0EDE6] placeholder:text-[rgba(240,237,230,0.3)] focus:border-[#E8C547] focus:ring-[#E8C547]/20"
              />
            </div>
          </div>

          {error && <p className="text-sm text-[#E05252]">{error}</p>}

          <Button
            type="submit"
            disabled={loading}
            className="h-11 w-full rounded-full bg-[#E8C547] text-sm font-semibold text-[#080C10] transition-all hover:bg-[#d4b33f] hover:shadow-lg hover:shadow-[#E8C547]/20"
          >
            {loading ? "Creating account..." : "Sign Up"}
            <ArrowRight size={16} className="ml-2" />
          </Button>

          <p className="text-center text-sm text-[rgba(240,237,230,0.45)]">
            Already have an account?{" "}
            <Link href="/login" className="text-[#E8C547] underline-offset-2 hover:text-[#d4b33f] hover:underline">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

function VerifyEmailState({ email }: { email: string }) {
  const [resendLoading, setResendLoading] = useState(false);
  const [resendError, setResendError] = useState("");
  const [resendSent, setResendSent] = useState(false);

  async function handleResend() {
    setResendError("");
    setResendLoading(true);
    try {
      const res = await authClient.sendVerificationEmail({
        email: email.trim().toLowerCase(),
        callbackURL: `${window.location.origin}/login?verified=true`,
      });

      if (res?.error) {
        console.error("[signup] resend error:", res.error);
        setResendError(res.error.message ?? "Failed to resend.");
      } else {
        setResendSent(true);
      }
    } catch (err: any) {
      setResendError(err?.message ?? "Something went wrong.");
    } finally {
      setResendLoading(false);
    }
  }

  return (
    <div className="text-center">
      <h1 className="font-heading text-3xl font-light text-[#F0EDE6]">
        Check Your Email
      </h1>
      <div className="mt-6 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-6">
        <p className="text-[#F0EDE6]">
          We sent a verification link to <strong>{email}</strong>.
        </p>
        <p className="mt-2 text-sm text-[rgba(240,237,230,0.45)]">
          Click the link in the email to activate your account.
        </p>

        {resendSent && (
          <p className="mt-4 text-sm text-[#7D9B76]">Verification email resent!</p>
        )}
        {resendError && <p className="mt-4 text-sm text-[#E05252]">{resendError}</p>}

        <Button
          type="button"
          variant="outline"
          disabled={resendLoading || resendSent}
          onClick={handleResend}
          className="mt-4 w-full border-[rgba(255,255,255,0.08)] text-[#F0EDE6] hover:bg-[rgba(255,255,255,0.06)]"
        >
          {resendLoading ? "Sending..." : "Resend Verification Email"}
        </Button>

        <Link
          href="/login"
          className="mt-4 inline-block text-sm text-[#E8C547] underline-offset-2 hover:text-[#d4b33f] hover:underline"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}
