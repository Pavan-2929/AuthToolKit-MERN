import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosInstance";

const registerUser = async (registerData) => {
  const { data } = await axiosInstance.post(
    "/api/auth/register",
    registerData,
    {
      withCredentials: true,
    }
  );

  return data;
};

const useRegister = () => {
  return useMutation({
    mutationFn: registerUser,
  });
};

export default useRegister;
