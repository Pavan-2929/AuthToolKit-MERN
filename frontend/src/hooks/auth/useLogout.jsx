import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosInstance";

const logoutUser = async () => {
  await axiosInstance.post(
    "/api/auth/logout",
    {},
    {
      withCredentials: true,
    }
  );
};

const useLogout = () => {
  return useMutation({
    mutationFn: logoutUser,
  });
};

export default useLogout;
