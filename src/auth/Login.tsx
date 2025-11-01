// components/signup-form.tsx
"use client";
import React, { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useLoginAdminMutation } from "@/redux-toolkit-store/slices/rtk/AuthSlices";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsloading] = useState<boolean>(false);
  const navigate = useNavigate();

  const [AdminLogin] = useLoginAdminMutation();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        setIsloading(true);
        const data = { email, password };
        const response = await AdminLogin(data).unwrap();
        if (response.success) {
          navigate("/verify-email", {
            state: {
              email: email,
            },
          });
        }
      } catch (error) {
        if (typeof error === "object" && error !== null && "data" in error) {
          const err = error as { data?: { message?: string } };
          toast(err.data?.message || "Something went wrong");
        } else if (error instanceof Error) {
          toast(error.message);
        } else {
          toast("Unexpected error");
        }
      } finally {
        setIsloading(false);
      }
    },
    [AdminLogin, email, password, navigate]
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Login existing account
          </CardTitle>
         
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Email Input */}

          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Enter your email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Enter password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Signup Button */}
          <Button
            disabled={isLoading}
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            size="lg"
          >
            {isLoading ? (
              <ClipLoader loading={isLoading} color="white" size={20} />
            ) : (
              "Signup"
            )}
          </Button>

          {/* Separator */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
          </div>

          {/* Already have account link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Button
                variant="link"
                className="p-0 text-blue-600 hover:text-blue-800"
                onClick={() => navigate("/signup")}
              >
                Signup
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
