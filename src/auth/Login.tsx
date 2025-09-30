// components/signup-form.tsx
"use client";
import React, { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useLoginAdminMutation } from "@/redux-toolkit-store/slices/rtk/AuthSlices";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUserData } from "@/redux-toolkit-store/slices/userSlice/userSlice";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsloading] = useState<boolean>(false);
  const navigate = useNavigate();
  const [loginAdmin] = useLoginAdminMutation();
  const dispatch = useDispatch();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        setIsloading(true);
        const data = { email, password };
        const response = await loginAdmin(data).unwrap();
        if (response.success) {
          navigate("/", {
            state: {
              email: email,
            },
          });
          const usrData = {
            id: response?.user?.id,
            name: response?.user?.name,
            email: response?.user?.email,
            token: response?.user?.token,
          };
          dispatch(setUserData(usrData));
          console.log(response);
        }
      } catch (error) {
        toast(error?.data?.message, {
          position: "top-center",
        });

        console.log("error", error);
      } finally {
        setIsloading(false);
      }
    },
    [email, password, navigate, loginAdmin]
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Login with existing account
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
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
              "Login"
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
              Create new Account?{" "}
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
