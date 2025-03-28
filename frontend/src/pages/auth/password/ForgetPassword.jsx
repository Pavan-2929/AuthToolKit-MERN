import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormInput } from "../../../components/common/FormIntput";
import { Mail, MailCheckIcon } from "lucide-react";
import LoadingButton from "../../../components/common/LoadingButton";
import useForgetPassword from "@/hooks/auth/useForgetPassword";
import { useToast } from "@/hooks/use-toast";
const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const { mutate, isError, error, isPending, data } = useForgetPassword();
  console.log(email);

  const handleForgetPassword = (e) => {
    e.preventDefault();
    e.stopPropagation();
    mutate(
      { email },
      {
        onSuccess: () => {
          setOpen(false);
          toast({
            title: "Email Sent",
            description: "Check your inbox for a password reset link.",
          });
        },
        onError: (error) => {
          console.log(error);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        {" "}
        <div className="text-muted-foreground mt-3 flex w-full cursor-pointer justify-end gap-1 text-sm hover:underline">
          Forget Password?{" "}
        </div>
      </DialogTrigger>
      <DialogContent>
        {isError && (
          <p className="py-3 text-medium text-destructive text-center">
            {error?.response?.data?.message ||
              error?.message ||
              "Internal Server Error"}
          </p>
        )}
        <form onSubmit={handleForgetPassword}>
          <DialogHeader>
            <DialogTitle>Enter your email</DialogTitle>
            <div>
              <FormInput
                placeholder="Email"
                value={email}
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                className="mt-7 text-sm mb-5 font-semibold "
                icon={<Mail className="text-primary size-5" />}
              />
            </div>
          </DialogHeader>
          <DialogFooter>
            <LoadingButton loading={isPending} type="submit">
              Send Reset Link
            </LoadingButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ForgetPassword;
