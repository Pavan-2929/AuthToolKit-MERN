"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserAvatar from "./UserAvatar";
import { BotIcon, LogOutIcon, UserIcon } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import useLogout from "@/hooks/auth/useLogout";
import { useQueryClient } from "@tanstack/react-query";
import { logout } from "@/redux/auth/authSlice";
const UserButton = ({ className }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.auth.currentUser);
  const { mutate, isPending, isError, error } = useLogout();
  const queryClient = useQueryClient();

  if (!currentUser) {
    return <Skeleton className="h-12 w-12 rounded-full" />;
  }

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={cn("rounded-full cursor-pointer", className)}>
          <UserAvatar avatarUrl={currentUser.avatarUrl} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuLabel>
          Logged in as @{currentUser.username}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <NavLink to={`/profile`}>
          <DropdownMenuItem>
            <UserIcon className="mr-3 size-4" />
            Profile
          </DropdownMenuItem>
        </NavLink>
        <DropdownMenuSeparator className="block md:hidden" />
        <NavLink to="/chatbot" className="block md:hidden">
          <DropdownMenuItem>
            <BotIcon className="mr-3 size-4" />
            Chatbot
          </DropdownMenuItem>
        </NavLink>
        <DropdownMenuSeparator className="block md:hidden" />
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOutIcon className="mr-3 size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
