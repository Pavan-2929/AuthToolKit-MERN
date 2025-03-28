import axiosInstance from "@/api/axiosInstance";
import { useMutation } from "@tanstack/react-query";

const forgetPassword = async (email) => {
  console.log(email);

  const { data } = await axiosInstance.post("/api/auth/forgetPassword", email, {
    withCredentials: true,
  });

  return data;
};

const useForgetPassword = () => {
  return useMutation({
    mutationFn: forgetPassword,
  });
};

export default useForgetPassword;
