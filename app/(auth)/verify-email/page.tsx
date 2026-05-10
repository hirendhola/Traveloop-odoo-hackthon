"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function VerifyEmailPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSent(false);

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      setError("Email is required");
      return;
    }

    setLoading(true);

    try {
      const res = await authClient.sendVerificationEmail({
        email: trimmedEmail,
        callbackURL: `${window.location.origin}/login?verified=true`,
      });

      if (res?.error) {
        const errMsg = res.error.message ?? "";
        const status = (res.error as any).status;
        console.error("[verify-email] authClient error:", status, errMsg);
        setError(errMsg || "Failed to send verification email.");
        setLoading(false);
        return;
      }

      setSent(true);
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="font-heading text-3xl font-bold text-foreground">
          Verify Your Email
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter your email and we will send you a verification link
        </p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="sr-only">Verify Email</CardTitle>
          <CardDescription className="sr-only">
            Enter your email address to receive a verification link
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="space-y-4 text-center">
              <p className="text-secondary">
                We sent a verification link to <strong>{email}</strong>.
              </p>
              <p className="text-sm text-muted-foreground">
                Check your inbox and click the link to activate your account.
              </p>
              <Button
                type="button"
                variant="outline"
                disabled={loading}
                onClick={() => { setSent(false); setEmail(""); }}
                className="w-full"
              >
                Send to a different email
              </Button>
              <Link
                href="/login"
                className="inline-block text-sm text-primary underline-offset-2 hover:text-primary/80 hover:underline"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
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

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Sending..." : "Send Verification Email"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Already verified?{" "}
                <Link href="/login" className="text-primary underline-offset-2 hover:text-primary/80 hover:underline">
                  Sign In
                </Link>
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
