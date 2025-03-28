import axiosInstance from "@/api/axiosInstance";
import { useMutation } from "@tanstack/react-query";

const verifyMagicLink = async (token) => {
  const { data } = await axiosInstance.post(
    `/api/auth/magic-link/verify/${token}`,
    {},
    {
      withCredentials: true,
    }
  );

  return data;
};

const useVerifyMagicLink = () => {
  return useMutation({
    mutationFn: verifyMagicLink,
  });
};

export default useVerifyMagicLink;
