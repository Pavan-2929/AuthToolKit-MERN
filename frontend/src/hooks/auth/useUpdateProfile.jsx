import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosInstance";

const updateProfile = async (formData) => {
  const { data } = await axiosInstance.put(
    "/api/user/update/profile",
    formData,
    {
      withCredentials: true,
    }
  );

  return data;
};

const useUpdateProfile = () => {
  return useMutation({
    mutationFn: updateProfile,
  });
};

export default useUpdateProfile;
