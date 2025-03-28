import { RegisterSchema } from "@/lib/validations";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Lock, Mail, User } from "lucide-react";
import LoadingButton from "@/components/common/LoadingButton";
import { FormInput } from "@/components/common/FormIntput";
import { PasswordInput } from "@/components/common/PasswordInput";
import useRegister from "@/hooks/auth/useRegister";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
const RegisterForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { mutate: registerUser, isError, error, isPending } = useRegister();

  const form = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    registerUser(values, {
      onSuccess: () => {
        toast({
          title: "Registration Successful",
          description:
            "A verification code has been sent to your email. Please check your inbox.",
        });
        navigate(`/signin/verification`, {
          state: {
            email: values.email,
          },
        });
      },
      onError: (error) => {
        console.log(error);
      },
    });
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          {isError && (
            <p className="text-medium text-destructive text-center">
              {error?.response?.data?.message ||
                error?.message ||
                "Internal Server Error"}
            </p>
          )}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <FormInput
                    placeholder="Username"
                    {...field}
                    icon={<User className="text-primary size-5" />}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <FormInput
                    placeholder="Email"
                    {...field}
                    icon={<Mail className="text-primary size-5" />}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
          <div className="w-full pt-3">
            <LoadingButton loading={isPending} type="submit" className="w-full">
              Sign In
            </LoadingButton>
          </div>
        </form>
      </Form>
    </>
  );
};

export default RegisterForm;
