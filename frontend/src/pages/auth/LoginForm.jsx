import { LoginSchema } from "@/lib/validations";
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
import { Lock, Mail } from "lucide-react";
import { FormInput } from "@/components/common/FormIntput";
import { PasswordInput } from "@/components/common/PasswordInput";
import LoadingButton from "@/components/common/LoadingButton";
import { useNavigate } from "react-router-dom";
import useLogin from "@/hooks/auth/useLogin";
import { useDispatch } from "react-redux";
import { login, setUser } from "@/redux/auth/authSlice";
import ForgetPassword from "@/pages/auth/password/ForgetPassword";
import { useToast } from "@/hooks/use-toast";

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();

  const { mutate: loginUser, isError, error, isPending } = useLogin();

  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const expiryTime = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const onSubmit = async (values) => {
    loginUser(values, {
      onSuccess: (response) => {
        dispatch(login());
        dispatch(
          setUser({
            user: response.data,
            expiryTime,
          }),
        );
        toast({
          title: "Logged In Successfully",
          description: "You are now logged in.",
        });
        navigate("/");
      },
      onError: (error) => {
        console.error(error);
      },
    });
  };

  return (
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
        <ForgetPassword />
        <div className="w-full pt-3">
          <LoadingButton loading={isPending} type="submit" className="w-full">
            Sign In
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;
