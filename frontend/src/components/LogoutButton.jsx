import React from "react";
import { useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import LoadingButton from "./common/LoadingButton";
import useLogout from "@/hooks/auth/useLogout";
import { LogOutIcon } from "lucide-react";
import { logout } from "@/redux/auth/authSlice";

const LogoutButton = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useLogout();

  const handleLogout = async () => {
    mutate("", {
      onSuccess: () => {
        queryClient.clear();
        dispatch(logout());
        toast({
          title: "Logout Successfully",
          description: "You are now logged out.",
        });
        navigate("/signin");
      },
      onError: (error) => {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Logout Error",
          description: "Failed to log out. Please try again.",
        });
      },
    });
  };
  return (
    <LoadingButton
      onClick={handleLogout}
      variant="outline"
      loading={isPending}
      className="w-full flex justify-start gap-3"
    >
      <LogOutIcon className="size-4" />
      Logout from this device
    </LoadingButton>
  );
};

export default LogoutButton;
