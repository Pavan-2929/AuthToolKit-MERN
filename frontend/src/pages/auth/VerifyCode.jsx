import React, { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import useVerifyCode from "@/hooks/auth/useVerifyCode";
import LoadingButton from "@/components/common/LoadingButton";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useDispatch } from "react-redux";
import { login, setUser } from "@/redux/auth/authSlice";
import { useToast } from "@/hooks/use-toast";

const VerifyCode = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const dispatch = useDispatch();
  const { toast } = useToast();

  const [value, setValue] = useState("");

  const { isError, error, isPending, mutate: verifyCode } = useVerifyCode();

  const expiryTime = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const handleVerifyCode = (e) => {
    e.preventDefault();
    verifyCode(
      { email, verificationCode: value },
      {
        onSuccess: (response) => {
          console.log(response);

          dispatch(login());
          dispatch(
            setUser({
              user: response.data,
              expiryTime,
            }),
          );
          toast({
            title: "Login Successful",
            description: "Redirecting to the home page...",
          });
          navigate("/");
        },
        onError: (error) => {
          console.error(error);
        },
      },
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Email Verification
          </CardTitle>
          <CardDescription className="text-center">
            Enter the 4-digit code sent to your email to verify your account.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isError && (
            <p className="text-medium text-destructive py-3 text-center">
              {error?.response?.data?.message ||
                error?.message ||
                "Internal Server Error"}
            </p>
          )}
          <form onSubmit={handleVerifyCode}>
            <div className="mx-auto flex w-full justify-center pt-5">
              <InputOTP
                maxLength={4}
                value={value}
                onChange={(val) => setValue(val)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <p className="text-muted-foreground pt-5 text-center text-sm">
              Didn&apos;t receive the code? Check your spam folder or{" "}
              <span className="text-primary cursor-pointer">resend</span>.
            </p>

            <div className="flex items-center justify-between pt-7">
              <Button
                type="button"
                onClick={() => navigate("/signin")}
                variant="outline"
              >
                Cancel
              </Button>
              <LoadingButton type="submit" loading={isPending}>
                Verify
              </LoadingButton>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyCode;
