import { MagicLinkSchema } from "@/lib/validations";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Mail } from "lucide-react";
import LoadingButton from "@/components/common/LoadingButton";
import { FormInput } from "@/components/common/FormIntput";
import useMagicLinkLogin from "@/hooks/auth/useMagicLink";
import { useToast } from "@/hooks/use-toast";

const MagicLinkForm = () => {
  const { toast } = useToast();

  const {
    mutate: magicLinkLogin,
    isError,
    error,
    isPending,
  } = useMagicLinkLogin();

  const form = useForm({
    resolver: zodResolver(MagicLinkSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values) => {
    magicLinkLogin(values, {
      onSuccess: () => {
        toast({
          title: "Magic Link Sent",
          description: "Check your email for the magic link.",
        });
        form.reset();
      },
      onError: (error) => {
        console.log(error);
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
              <FormDescription />
            </FormItem>
          )}
        />
        <div className="w-full pt-3">
          <LoadingButton loading={isPending} type="submit" className="w-full">
            Sign In with Magic Link
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
};

export default MagicLinkForm;
