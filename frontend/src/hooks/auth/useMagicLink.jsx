import axiosInstance from "@/api/axiosInstance";
import { useMutation } from "@tanstack/react-query";

const magicLinkLogin = async (email) => {
  const { data } = await axiosInstance.post("/api/auth/magic-link", email, {
    withCredentials: true,
  });

  return data;
};

const useMagicLinkLogin = () => {
  return useMutation({
    mutationFn: magicLinkLogin,
  });
};

export default useMagicLinkLogin;
