import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosInstance";

const deleteUser = async () => {
  await axiosInstance.delete("/api/user/delete", {
    withCredentials: true,
  });
};

const useDeleteUser = () => {
  return useMutation({
    mutationFn: deleteUser,
  });
};

export default useDeleteUser;
