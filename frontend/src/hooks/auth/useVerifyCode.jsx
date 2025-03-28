import axiosInstance from "@/api/axiosInstance";
import { useMutation } from "@tanstack/react-query";

const veirfyCode = async ({ email, verificationCode }) => {
  const { data } = await axiosInstance.post(
    "/api/auth/verify",
    { email, verificationCode },
    {
      withCredentials: true,
    }
  );

  return data;
};

const useVerifyCode = () => {
  return useMutation({
    mutationFn: veirfyCode,
  });
};

export default useVerifyCode;
