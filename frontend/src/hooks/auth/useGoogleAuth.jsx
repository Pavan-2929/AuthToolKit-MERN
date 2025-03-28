import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosInstance";

const googleLogin = async (loginData) => {
  const { data } = await axiosInstance.post("/api/auth/google", loginData, {
    withCredentials: true,
  });

  return data;
};

const useGoogleLogin = () => {
  return useMutation({
    mutationFn: googleLogin,
  });
};

export default useGoogleLogin;
