import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/types";
import { verifyOtp, resendOtp } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "sonner";
import { afterSignInUrl } from "@/constants/data";
import { cn } from "@/lib/utils";

export function VerifyOtpPage({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { isVerifying, isLoading } = useSelector(
    (state: RootState) => state.auth,
  );

  const [otp, setOtp] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const email = location.state?.email;

  // Redirect if no email provided
  useEffect(() => {
    if (!email) {
      toast.error("Email not found. Please signup again.");
      navigate("/signup");
    }
  }, [email, navigate]);

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Auto-submit when OTP is complete
  useEffect(() => {
    if (otp.length === 6) {
      handleVerify();
    }
  }, [otp]);

  const handleVerify = async () => {
    if (!email || otp.length !== 6) return;

    try {
      const resultAction = await dispatch(verifyOtp({ email, otp }));

      if (verifyOtp.fulfilled.match(resultAction)) {
        toast.success("Email verified successfully!");
        navigate(afterSignInUrl);
      } else {
        if (resultAction.payload) {
          toast.error(resultAction.payload as string);
        } else {
          toast.error("Invalid OTP. Please try again.");
        }
        setOtp(""); // Clear OTP input on error
      }
    } catch (error: any) {
      console.error("OTP verification error:", error);
      toast.error("An unexpected error occurred. Please try again.");
      setOtp("");
    }
  };

  const handleResend = async () => {
    if (!email || resendCooldown > 0) return;

    try {
      const resultAction = await dispatch(resendOtp(email));

      if (resendOtp.fulfilled.match(resultAction)) {
        toast.success("OTP sent successfully! Check your email.");
        setResendCooldown(60); // Start 60 second cooldown
        setOtp(""); // Clear current OTP
      } else {
        if (resultAction.payload) {
          toast.error(resultAction.payload as string);
        } else {
          toast.error("Failed to resend OTP. Please try again.");
        }
      }
    } catch (error: any) {
      console.error("Resend OTP error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const maskEmail = (email: string) => {
    const [name, domain] = email.split("@");
    if (!domain) return email;
    const maskedName =
      name.length > 2 ? name[0] + "***" + name[name.length - 1] : name;
    return `${maskedName}@${domain}`;
  };

  return (
    <div
      className="bg-[#131725] flex min-h-svh flex-col items-center justify-center p-6 md:p-10"
      {...props}
    >
      <div className="w-full max-w-md">
        <Card className="overflow-hidden">
          <CardContent className="p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-8 h-8 text-primary"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                    />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold">Verify Your Email</h1>
                <p className="text-muted-foreground text-sm text-balance">
                  We sent a 6-digit code to
                  <br />
                  <span className="font-medium text-foreground">
                    {email ? maskEmail(email) : "your email"}
                  </span>
                </p>
              </div>

              <Field className="flex flex-col items-center">
                <FieldLabel className="mb-3 text-center">
                  Enter Verification Code
                </FieldLabel>
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                  disabled={isVerifying}
                  autoFocus
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                <p className="text-sm text-muted-foreground mt-2">
                  {isVerifying ? "Verifying..." : "Enter the 6-digit code"}
                </p>
              </Field>

              <div className="flex flex-col gap-3 mt-6">
                <Button
                  onClick={handleVerify}
                  disabled={otp.length !== 6 || isVerifying}
                  className="w-full"
                >
                  {isVerifying ? "Verifying..." : "Verify Email"}
                </Button>

                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Didn't receive the code?
                  </span>
                  <Button
                    variant="link"
                    onClick={handleResend}
                    disabled={resendCooldown > 0 || isLoading}
                    className="p-0 h-auto text-sm"
                  >
                    {resendCooldown > 0
                      ? `Resend in ${resendCooldown}s`
                      : "Resend OTP"}
                  </Button>
                </div>

                <div className="text-center mt-2">
                  <Button
                    variant="ghost"
                    onClick={() => navigate("/signup")}
                    className="text-sm"
                  >
                    ← Back to Signup
                  </Button>
                </div>
              </div>

              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground text-center">
                  💡 <strong>Tip:</strong> Check your spam folder if you don't
                  see the email. The code expires in 10 minutes.
                </p>
              </div>
            </FieldGroup>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default VerifyOtpPage;
