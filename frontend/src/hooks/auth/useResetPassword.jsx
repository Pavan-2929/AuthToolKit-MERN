import axiosInstance from "@/api/axiosInstance";
import { useMutation } from "@tanstack/react-query";

const resetPassword = async ({ token, password }) => {
  const { data } = await axiosInstance.put(
    `/api/auth/resetPassword/${token}`,
    {
      password,
    },
    {
      withCredentials: true,
    }
  );

  return data;
};

const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPassword,
  });
};

export default useResetPassword;
