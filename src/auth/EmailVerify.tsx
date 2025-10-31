// components/verification-code.tsx
"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useVerifyEmailMutation } from "@/redux-toolkit-store/slices/rtk/AuthSlices";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";

export function VerificationCode() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(63);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const location = useLocation();
  const { email } = location.state;
  const navigate = useNavigate();

  const [verifyEmail] = useVerifyEmailMutation();

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsResendDisabled(false);
    }
  }, [timeLeft]);

  const handleCodeChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace") {
      if (!code[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else if (code[index]) {
        const newCode = [...code];
        newCode[index] = "";
        setCode(newCode);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newCode = pastedData.split("").slice(0, 6);
      const fullCode = [...newCode, ...Array(6 - newCode.length).fill("")];
      setCode(fullCode);

      const lastFilledIndex = Math.min(newCode.length - 1, 5);
      setTimeout(() => {
        inputRefs.current[lastFilledIndex]?.focus();
      }, 0);
    }
  };

  const handleVerify = useCallback(
    async (verificationCode?: string) => {
      try {
        setIsLoading(true);
        const finalCode = verificationCode || code.join("");
        console.log(finalCode);

        const data = { email, code: Number(finalCode) };

        const response = await verifyEmail(data).unwrap();
        if (response.success) {
          navigate("/sign-in");
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
        setIsLoading(false);
      }
    },
    [code, email, verifyEmail, navigate]
  );

  useEffect(() => {
    const isCodeComplete = code.every((digit) => digit !== "");
    if (isCodeComplete) {
      handleVerify(code.join(""));
    }
  }, [code, handleVerify]);

  const handleManualVerify = () => {
    handleVerify();
  };

  const handleResendCode = () => {
    if (!isResendDisabled) {
      setCode(["", "", "", "", "", ""]);
      setTimeLeft(63);
      setIsResendDisabled(true);

      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Enter Verification Code
          </CardTitle>
          <CardDescription className="text-gray-600">
            We have sent a 6 digits code to
          </CardDescription>
          <div className="text-sm font-medium text-gray-900">{email}</div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Code Inputs */}
          <div className="space-y-4">
            <Label className="text-sm font-medium text-gray-700 text-center block">
              Enter the 6-digit code
            </Label>

            <div
              className="flex justify-center space-x-2"
              onPaste={handlePaste}
            >
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onFocus={(e) => e.target.select()}
                  className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                />
              ))}
            </div>

            {/* Debug info (remove in production) */}
            <div className="text-center text-xs text-gray-500">
              Current code: {code.join("")} | Length: {code.join("").length}
            </div>
          </div>

          {/* Resend Code Timer */}
          <div className="text-center">
            <div className="text-sm text-gray-600">
              {isResendDisabled ? (
                <>
                  Resend code in{" "}
                  <span className="font-semibold">{formatTime(timeLeft)}</span>
                </>
              ) : (
                <span className="text-gray-600">
                  You can now resend the code
                </span>
              )}
            </div>
          </div>

          {/* Verify Button */}
          <Button
            onClick={handleManualVerify}
            disabled={code.some((digit) => digit === "") || isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
            size="lg"
          >
            {isLoading ? (
              <ClipLoader color="black" size={20} loading={isLoading} />
            ) : (
              "Verify"
            )}
          </Button>

          {/* Resend Code Button */}
          <div className="text-center">
            <Button
              variant="link"
              onClick={handleResendCode}
              disabled={isResendDisabled}
              className={`p-0 ${
                isResendDisabled
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-600 hover:text-blue-800"
              }`}
            >
              Resend Code
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
