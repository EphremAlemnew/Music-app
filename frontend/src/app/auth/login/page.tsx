"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login:", { email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 via-pink-600 to-indigo-500 dark:from-gray-800 dark:via-gray-900 dark:to-black p-4">
      <Card className="w-full max-w-md bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-2xl rounded-3xl border border-white/20 dark:border-gray-700">
        <CardHeader className="flex flex-col items-center gap-2">
          <Music className="w-12 h-12 text-purple-600 dark:text-purple-400" />
          <CardTitle className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100">
            Welcome back to Music App{" "}
            <span className="text-purple-600 dark:text-purple-400">!</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-xl border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-purple-400 dark:focus:ring-purple-500"
            />

            {/* Password Input */}
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded-xl border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-300 pr-12 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-purple-400 dark:focus:ring-purple-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-md transition-all dark:bg-purple-500 dark:hover:bg-purple-600"
            >
              Login
            </Button>
          </form>

          <p className="text-center text-sm mt-4 text-gray-700 dark:text-gray-300">
            Don't have an account?{" "}
            <Link
              href="/auth/sign-up"
              className="text-purple-600 dark:text-purple-400 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
