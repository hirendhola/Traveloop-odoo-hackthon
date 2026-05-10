"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
    return (
      <VerifyEmailState email={email} />
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="font-(family-name:--font-heading) text-3xl font-bold text-foreground">
          Start Your Journey
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Create your Traveloop account</p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="sr-only">Sign Up</CardTitle>
          <CardDescription className="sr-only">Create a new Traveloop account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="At least 8 characters"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Repeat your password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Creating account..." : "Sign Up"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary underline-offset-2 hover:text-primary/80 hover:underline">
                Sign In
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
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
      <h1 className="font-(family-name:--font-heading) text-3xl font-bold text-foreground">
        Check Your Email
      </h1>
      <Card className="mt-6">
        <CardContent className="pt-6 text-center space-y-4">
          <p className="text-secondary">
            We sent a verification link to <strong>{email}</strong>.
          </p>
          <p className="text-sm text-muted-foreground">
            Click the link in the email to activate your account.
          </p>

          {resendSent && (
            <p className="text-sm text-secondary">Verification email resent!</p>
          )}
          {resendError && <p className="text-sm text-destructive">{resendError}</p>}

          <Button
            type="button"
            variant="outline"
            disabled={resendLoading || resendSent}
            onClick={handleResend}
            className="w-full"
          >
            {resendLoading ? "Sending..." : "Resend Verification Email"}
          </Button>

          <Link
            href="/login"
            className="inline-block text-sm text-primary underline-offset-2 hover:text-primary/80 hover:underline"
          >
            Back to Login
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
