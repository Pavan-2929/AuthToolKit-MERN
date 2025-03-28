import React from "react";
import avatarImage from "@/assets/avatar.png";
import { cn } from "@/lib/utils";

const UserAvatar = ({ className, size = 48, avatarUrl }) => {
  return (
    <img
      src={avatarUrl || avatarImage}
      alt="User avatar"
      className={cn(
        "rounded-full object-cover border border-primary",
        className
      )}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    />
  );
};

export default UserAvatar;
