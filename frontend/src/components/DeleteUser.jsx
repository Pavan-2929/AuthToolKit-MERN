import useDeleteUser from "@/hooks/auth/useDeleteUser";
import React from "react";
import LoadingButton from "./common/LoadingButton";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { logout } from "@/redux/auth/authSlice";
import { Trash2Icon } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";

const DeleteUser = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useDeleteUser();

  const handleDeleteUser = () => {
    mutate("", {
      onSuccess: () => {
        dispatch(logout());
        queryClient.clear();
        toast({
          title: "Account deleted",
          description: "Your account has been successfully deleted.",
        });
        navigate("/signin");
      },
      onError: (error) => {
        console.error(error);
        toast({
          variant: "destcrutive",
          title: "Failed to delete account",
          description: "Failed to delete your account. Please try again.",
        });
      },
    });
  };

  return (
    <div className="flex flex-col space-y-2">
      <h3 className="text-sm font-semibold text-muted-foreground">
        Delete Account
      </h3>
      <div className="bg-destructive/10 border border-destructive/20 p-3 rounded-lg space-y-3">
        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete your account? This action cannot be
          undone.
        </p>
        <Dialog>
          <DialogTrigger>
            <div
              className="bg-destructive/80 cursor-pointer items-center text-secondary px-4 py-2 text-sm font-medium rounded-lg  flex justify-start gap-3"
              size="sm"
            >
              <Trash2Icon className="size-4" />
              Delete Account
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Account</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete your account? This process
                cannot be unodone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <div className="flex gap-5">
                <DialogClose>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <LoadingButton
                  variant="destructive"
                  loading={isPending}
                  onClick={handleDeleteUser}
                  className="bg-destructive/80"
                >
                  Delete Account
                </LoadingButton>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default DeleteUser;
