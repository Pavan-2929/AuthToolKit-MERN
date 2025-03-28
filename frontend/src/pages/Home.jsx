import React from "react";
import { useSelector } from "react-redux";

const Home = () => {
  const currentUser = useSelector((state) => state.auth.currentUser);

  return <div>HOME PAGE</div>;
};

export default Home;
