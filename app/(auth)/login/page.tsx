"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const justVerified = searchParams.get("verified") === "true";
  const verifyError = searchParams.get("error");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setUnverifiedEmail(false);
    setLoading(true);

    try {
      const trimmedEmail = email.trim().toLowerCase();
      if (!trimmedEmail || !password) {
        setError("Email and password are required");
        setLoading(false);
        return;
      }

      const res = await authClient.signIn.email({ email: trimmedEmail, password });

      if (res.error) {
        const status = (res.error as any).status;
        if (status === 403) {
          setUnverifiedEmail(true);
          setLoading(false);
          return;
        }
        setError(res.error.message ?? "Invalid credentials");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setLoading(false);
      setError(err?.message ?? "Something went wrong. Please try again.");
    }
  }

  async function handleForgotPassword() {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Enter your email first");
      return;
    }
    setError("");
    setUnverifiedEmail(false);
    setLoading(true);

    try {
      const res = await authClient.requestPasswordReset({
        email: trimmedEmail,
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (res?.error) {
        setError(res.error.message ?? "Failed to send reset email.");
        setLoading(false);
        return;
      }

      setResetSent(true);
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResendVerification() {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      setError("Enter your email first");
      return;
    }
    setError("");
    setUnverifiedEmail(false);
    setLoading(true);

    try {
      const res = await authClient.sendVerificationEmail({
        email: trimmedEmail,
        callbackURL: `${window.location.origin}/login?verified=true`,
      });

      if (res?.error) {
        console.error("[login] resend error:", res.error);
        setError(res.error.message ?? "Failed to resend verification.");
      } else {
        setResetSent(true);
      }
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="font-(family-name:--font-heading) text-3xl font-bold text-foreground">
          Welcome Back
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Sign in to your Traveloop account</p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="sr-only">Sign In</CardTitle>
          <CardDescription className="sr-only">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          {justVerified && (
            <div className="mb-4 rounded-lg border border-secondary/30 bg-secondary/10 p-3">
              <p className="text-sm text-secondary">
                Email verified successfully! You can now sign in.
              </p>
            </div>
          )}
          {verifyError && (
            <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3">
              <p className="text-sm text-destructive">
                {verifyError === "invalid_token"
                  ? "Verification link is invalid or expired. Request a new one below."
                  : `Verification failed: ${verifyError}`}
              </p>
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value); setUnverifiedEmail(false); }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                required
                minLength={8}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setUnverifiedEmail(false); }}
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
            {resetSent && (
              <p className="text-sm text-secondary">Check your email for the link we sent.</p>
            )}

            {unverifiedEmail && (
              <div className="space-y-2 rounded-lg bg-muted p-3">
                <p className="text-sm text-muted-foreground">
                  Your email is not verified. Please check your inbox or resend the verification link.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={loading}
                  onClick={handleResendVerification}
                  className="w-full"
                >
                  {loading ? "Sending..." : "Resend Verification Email"}
                </Button>
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-muted-foreground underline-offset-2 hover:text-primary hover:underline"
              >
                Forgot Password?
              </button>
              <Link
                href="/signup"
                className="text-primary underline-offset-2 hover:text-primary/80 hover:underline"
              >
                Sign Up
              </Link>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              Need to verify your email?{" "}
              <Link href="/verify-email" className="text-primary underline-offset-2 hover:text-primary/80 hover:underline">
                Send verification link
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
