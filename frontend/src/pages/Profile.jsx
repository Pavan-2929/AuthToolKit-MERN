import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProfileUpdateSchema } from "@/lib/validations";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import LoadingButton from "@/components/common/LoadingButton";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "@/redux/auth/authSlice";
import { useToast } from "@/hooks/use-toast";
import { Pencil, User, Mail, Loader2, ShieldCheck } from "lucide-react";
import { FormInput } from "@/components/common/FormIntput";
import useImageUpload from "@/hooks/auth/useUploadImage";
import UserAvatar from "@/components/common/UserAvatar";
import useUpdateProfile from "@/hooks/auth/useUpdateProfile";
import {
  Card,
  CardTitle,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import LogoutButton from "@/components/LogoutButton";
import DeleteUser from "@/components/DeleteUser";

const ProfileUpdateForm = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const currentUser = useSelector((state) => state.auth.currentUser);
  const fileRef = useRef(null);

  const { mutate: updateImage, isPending: imageLoading } = useImageUpload();
  const { mutate: updateProfile, isPending: profileLoading } =
    useUpdateProfile();

  const form = useForm({
    resolver: zodResolver(ProfileUpdateSchema),
    defaultValues: {
      username: currentUser?.username || "",
    },
  });

  const onSubmit = (values) => {
    updateProfile(values, {
      onSuccess: (response) => {
        dispatch(
          updateUser({
            user: response.data,
          }),
        );
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully.",
        });
      },
      onError: (error) => {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Profile Update Error",
          description: "An error occurred while updating your profile.",
        });
      },
    });
  };

  const handleImageChange = () => {
    if (!fileRef.current.files[0]) return;

    const formData = new FormData();
    formData.append("image", fileRef.current.files[0]);

    try {
      updateImage(formData, {
        onSuccess: (response) => {
          console.log(response);
          dispatch(
            updateUser({
              user: response.data,
            }),
          );
          toast({
            title: "Image Uploaded",
            description: "Your profile image has been updated successfully.",
          });
        },
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destcrutive",
        title: "Error Uploading Image",
        description: "An error occurred while uploading the image.",
      });
    }
  };

  return (
    <div className="flex flex-col justify-between lg:flex-row">
      <Card className="mt-6 mb-6 w-full lg:mt-14 lg:mb-0 lg:w-[40%]">
        <CardHeader>
          <div className="mb-4 flex flex-col items-center">
            <input
              type="file"
              onChange={handleImageChange}
              ref={fileRef}
              className="hidden"
            />
            <div
              onClick={() => fileRef.current.click()}
              className="relative flex h-24 w-24 cursor-pointer items-center justify-center rounded-full"
            >
              <UserAvatar avatarUrl={currentUser.avatarUrl} size={96} />
              <button className="bg-primary absolute right-0 bottom-0 rounded-full p-1 shadow">
                <Pencil className="size-4 text-white" />
              </button>
              {imageLoading && (
                <div className="bg-foreground/50 text-primary absolute inset-0 flex h-full w-full items-center justify-center rounded-full">
                  <Loader2 className="size-9 animate-spin" />
                </div>
              )}
            </div>
          </div>
          <CardTitle className="text-center text-2xl">
            {currentUser.username}
          </CardTitle>
          <CardDescription className="text-center">
            {currentUser.email}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-7">
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm font-medium">
              Member since
            </span>
            <span className="text-sm">
              {new Date(currentUser.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="flex flex-col space-y-2">
            <h3 className="text-muted-foreground text-sm font-semibold">
              Session
            </h3>
            <LogoutButton />
          </div>
          <DeleteUser />
        </CardContent>
      </Card>
      <div className="mt-0 w-full lg:mt-14 lg:w-[55%] lg:pl-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              Update Profile
            </CardTitle>
            <CardDescription>
              Update your profile information and settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <FormInput
                          {...field}
                          placeholder="Enter your username"
                          icon={<User className="text-primary size-5" />}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div>
                  <Label className="pb-2">Email</Label>
                  <FormInput
                    value={currentUser.email}
                    placeholder="Enter your email"
                    disabled
                    icon={<Mail className="text-primary size-5" />}
                  />
                </div>
                <div className="w-full pt-3">
                  <LoadingButton
                    loading={profileLoading}
                    type="submit"
                    className="w-full"
                  >
                    Updates Profile
                  </LoadingButton>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">
                Security Settings
              </CardTitle>
              <CardDescription>
                Manage your account security preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Label className="text-sm font-medium">Verification</Label>
                <Button
                  variant="outline"
                  className="flex w-full justify-start gap-3"
                >
                  <ShieldCheck className="size-4" />
                  Your account is verified
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfileUpdateForm;
