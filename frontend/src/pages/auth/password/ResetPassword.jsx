import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import LoadingButton from "@/components/common/LoadingButton";
import useResetPassword from "@/hooks/auth/useResetPassword";
import { Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPasswordSchema } from "@/lib/validations";
import {
  Form,
  FormControl,
  FormMessage,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { PasswordInput } from "../../../components/common/PasswordInput";
import { useToast } from "@/hooks/use-toast";
const ResetPassword = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { token } = params;

  const { isError, error, isPending, mutate } = useResetPassword();

  const form = useForm({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values) => {
    if (values.password !== values.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    mutate(
      { token, password: values.password },
      {
        onSuccess: () => {
          toast({
            title: "Password Changed",
            description:
              "Your password has been updated successfully. Please login again.",
          });
          navigate("/signin");
        },
        onError: (err) => {
          console.log(err);
        },
      }
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Reset Password</CardTitle>
          <CardDescription className="text-center">
            Enter your new password to reset your account.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5 pt-7"
            >
              {isError && (
                <p className="text-medium text-destructive text-center">
                  {error?.response?.data?.message ||
                    error?.message ||
                    "Internal Server Error"}
                </p>
              )}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="Password"
                        {...field}
                        icon={<Lock className="text-primary size-5" />}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="Confirm Password"
                        {...field}
                        icon={<Lock className="text-primary size-5" />}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="w-full pt-3">
                <LoadingButton
                  loading={isPending}
                  type="submit"
                  className="w-full"
                >
                  Submit
                </LoadingButton>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
