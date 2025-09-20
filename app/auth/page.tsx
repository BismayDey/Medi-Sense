"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  HeartPulse,
  ArrowLeft,
  LogIn,
  UserPlus,
  Eye,
  EyeOff,
} from "lucide-react";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"patient" | "doctor">("patient");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      let userCredential;
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
      } else {
        userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
      }

      // Save user metadata to Firestore. On sign up store name, phone and role.
      await setDoc(
        doc(db, "users", userCredential.user.uid),
        {
          email: userCredential.user.email,
          lastLogin: new Date().toISOString(),
          ...(isSignUp
            ? {
                createdAt: new Date().toISOString(),
                name,
                phone,
                role,
              }
            : {}),
        },
        { merge: true }
      );

      // On sign-in, read role from Firestore to determine redirect.
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      const userData = userDoc.exists() ? userDoc.data() : null;
      const userRole = isSignUp ? role : (userData?.role as string | undefined);

      if (userRole === "doctor") {
        router.push("/doctor/dashboard");
      } else {
        router.push("/healthdash");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // If user doc doesn't exist or doesn't have a role, default to patient
      const userRef = doc(db, "users", result.user.uid);
      const existing = await getDoc(userRef);

      if (!existing.exists() || !existing.data()?.role) {
        await setDoc(
          userRef,
          {
            email: result.user.email,
            name: result.user.displayName || null,
            photoURL: result.user.photoURL || null,
            role: "patient",
            lastLogin: new Date().toISOString(),
            createdAt: existing.exists()
              ? existing.data()?.createdAt
              : new Date().toISOString(),
          },
          { merge: true }
        );
        router.push("/healthdash");
      } else {
        const r = existing.data()?.role;
        if (r === "doctor") router.push("/doctor/dashboard");
        else router.push("/healthdash");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-white flex items-center justify-center p-6">
      <Card className="p-6 w-full max-w-lg space-y-6 bg-white shadow-lg">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="rounded-full bg-green-50 p-3">
              <HeartPulse className="h-10 w-10 text-green-600" />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-800">MindSense</h2>
          <p className="text-sm text-gray-500">
            Your journey to wellness begins here
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {isSignUp && (
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-gray-700">
                Choose account type
              </div>
              <div className="flex items-center space-x-2 bg-gray-100 rounded-full p-1">
                <button
                  aria-pressed={role === "patient"}
                  onClick={() => setRole("patient")}
                  className={`px-3 py-1 rounded-full text-sm ${
                    role === "patient"
                      ? "bg-white shadow text-green-700"
                      : "text-gray-600"
                  }`}
                >
                  Patient
                </button>
                <button
                  aria-pressed={role === "doctor"}
                  onClick={() => setRole("doctor")}
                  className={`px-3 py-1 rounded-full text-sm ${
                    role === "doctor"
                      ? "bg-white shadow text-green-700"
                      : "text-gray-600"
                  }`}
                >
                  Doctor
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-3">
            {isSignUp && (
              <div className="grid grid-cols-1 gap-2">
                <Input
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full"
                />

                <Input
                  type="tel"
                  placeholder="Phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full"
                />
              </div>
            )}

            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
            />

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button
              type="submit"
              className="w-full flex items-center justify-center"
              disabled={
                isSignUp
                  ? !email || !password || !name || !phone
                  : !email || !password
              }
            >
              {isSignUp ? (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign Up
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-gray-400">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            type="button"
            className="w-full flex items-center justify-center"
            onClick={handleGoogleSignIn}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </Button>

          <div className="text-center text-sm">
            <button
              type="button"
              className="text-green-600 hover:underline"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp
                ? "Already have an account? Sign In"
                : "Don't have an account? Sign Up"}
            </button>
          </div>

          <Button
            variant="ghost"
            type="button"
            className="w-full flex items-center justify-center mt-2"
            onClick={() => router.push("/")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Get Back
          </Button>
        </div>
      </Card>
    </div>
  );
}
