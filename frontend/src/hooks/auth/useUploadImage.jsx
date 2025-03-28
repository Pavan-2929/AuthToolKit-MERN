import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosInstance";

const uploadImage = async (formData) => {
  const { data } = await axiosInstance.post(
    "/api/user/upload/image",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data", // Ensure correct headers
      },
      withCredentials: true,
    }
  );

  return data;
};

const useImageUpload = () => {
  return useMutation({
    mutationFn: uploadImage,
  });
};

export default useImageUpload;
