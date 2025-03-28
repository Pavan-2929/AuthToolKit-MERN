import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosInstance";

const loginUser = async (loginData) => {
  console.log(loginData);

  const { data } = await axiosInstance.post("/api/auth/login", loginData, {
    withCredentials: true,
  });

  return data;
};

const useLogin = () => {
  return useMutation({
    mutationFn: loginUser,
  });
};

export default useLogin;
