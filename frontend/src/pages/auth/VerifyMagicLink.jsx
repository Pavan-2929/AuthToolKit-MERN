import useVerifyMagicLink from "@/hooks/auth/useVerifyMagicLink";
import { useToast } from "@/hooks/use-toast";
import { login, setUser } from "@/redux/auth/authSlice";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const VerifyMagicLink = () => {
  const { mutate, isError, error, isPending } = useVerifyMagicLink();

  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = params;
  const { toast } = useToast();

  const expiryTime = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const verifyMagicLinkHandler = () => {
    mutate(token, {
      onSuccess: (response) => {
        console.log(response);

        dispatch(login());
        dispatch(
          setUser({
            user: response.data,
            expiryTime,
          }),
        );
        toast({
          title: "Verification successful",
          description: "You've been logged in successfully.",
        });
        navigate("/");
      },
      onError: (error) => {
        console.error(error);
        navigate("/login");
      },
    });
  };

  useEffect(() => {
    verifyMagicLinkHandler();
  }, [token]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="rounded bg-white p-6 text-center shadow-lg">
        {isPending && (
          <div>
            <p className="text-lg font-semibold">
              Verifying your magic link...
            </p>
            <div className="mx-auto mt-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          </div>
        )}
        {isError && (
          <p className="font-medium text-red-600">
            {error?.response?.data?.message ||
              "Verification failed. Redirecting..."}
          </p>
        )}
        <p className="font-medium text-green-600">
          Verification successful! Redirecting...
        </p>
      </div>
    </div>
  );
};

export default VerifyMagicLink;
