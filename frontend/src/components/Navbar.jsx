import React from "react";
import UserButton from "./common/UserButton";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="sticky left-0 top-0 z-50 border border-b bg-card">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-4 px-4 sm:px-6 lg:px-8 py-3 sm:gap-y-0">
        <div className="text-2xl font-bold text-primary">
          <NavLink to="/">AuthToolkit</NavLink>
        </div>
        <div className="order-2 ms-auto flex items-center sm:order-3">
          <UserButton />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
