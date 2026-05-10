"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Mail, Lock } from "lucide-react";

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
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="font-heading text-3xl font-light text-[#F0EDE6]">
          Welcome Back
        </h1>
        <p className="mt-2 text-sm text-[rgba(240,237,230,0.45)]">Sign in to your Traveloop account</p>
      </div>

      <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-6 backdrop-blur-sm">
        {justVerified && (
          <div className="mb-4 rounded-lg border border-[#E8C547]/30 bg-[#E8C547]/10 p-3">
            <p className="text-sm text-[#E8C547]">
              Email verified successfully! You can now sign in.
            </p>
          </div>
        )}
        {verifyError && (
          <div className="mb-4 rounded-lg border border-[#E05252]/30 bg-[#E05252]/10 p-3">
            <p className="text-sm text-[#E05252]">
              {verifyError === "invalid_token"
                ? "Verification link is invalid or expired. Request a new one below."
                : `Verification failed: ${verifyError}`}
            </p>
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-5">
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
                onChange={(e) => { setEmail(e.target.value); setUnverifiedEmail(false); }}
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
                placeholder="Enter your password"
                required
                minLength={8}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setUnverifiedEmail(false); }}
                className="h-11 border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] pl-10 text-[#F0EDE6] placeholder:text-[rgba(240,237,230,0.3)] focus:border-[#E8C547] focus:ring-[#E8C547]/20"
              />
            </div>
          </div>

          {error && <p className="text-sm text-[#E05252]">{error}</p>}
          {resetSent && (
            <p className="text-sm text-[#7D9B76]">Check your email for the link we sent.</p>
          )}

          {unverifiedEmail && (
            <div className="space-y-2 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-3">
              <p className="text-sm text-[rgba(240,237,230,0.6)]">
                Your email is not verified. Please check your inbox or resend the verification link.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={loading}
                onClick={handleResendVerification}
                className="w-full border-[rgba(255,255,255,0.08)] text-[#F0EDE6] hover:bg-[rgba(255,255,255,0.06)]"
              >
                {loading ? "Sending..." : "Resend Verification Email"}
              </Button>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="h-11 w-full rounded-full bg-[#E8C547] text-sm font-semibold text-[#080C10] transition-all hover:bg-[#d4b33f] hover:shadow-lg hover:shadow-[#E8C547]/20"
          >
            {loading ? "Signing in..." : "Sign In"}
            <ArrowRight size={16} className="ml-2" />
          </Button>

          <div className="flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-[rgba(240,237,230,0.45)] underline-offset-2 hover:text-[#E8C547] hover:underline"
            >
              Forgot Password?
            </button>
            <Link
              href="/signup"
              className="text-[#E8C547] underline-offset-2 hover:text-[#d4b33f] hover:underline"
            >
              Sign Up
            </Link>
          </div>

          <p className="text-center text-xs text-[rgba(240,237,230,0.3)]">
            Need to verify your email?{" "}
            <Link href="/verify-email" className="text-[#E8C547] underline-offset-2 hover:text-[#d4b33f] hover:underline">
              Send verification link
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
