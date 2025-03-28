import { Globe } from "lucide-react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import useGoogleLogin from "@/hooks/auth/useGoogleAuth";
import { login, setUser } from "@/redux/auth/authSlice";
import { useToast } from "@/hooks/use-toast";
import LoadingButton from "./common/LoadingButton";

const SocialAuth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();

  const {
    mutate: googleLogin,
    error,
    isError,
    isPending,
  } = useGoogleLogin();

  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);

      const { displayName, email, photoURL } = result.user;

      const data = {
        username: displayName,
        email,
        avatarUrl: photoURL,
      };

      const expiryTime = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      googleLogin(data, {
        onSuccess: (response) => {
          dispatch(login());
          dispatch(
            setUser({
              user: response.data,
              expiryTime,
            })
          );
          toast({
            title: "Login Successful",
            description: "You have successfully logged in.",
          });
          navigate("/");
        },
        onError: (error) => {
          console.error(error);
          toast({
            variant: "desctructive",
            title: "Google auth error",
            description: "Failed to login with Google. Please try again.",
          });
        },
      });
    } catch (error) {
      console.error("Google login error", error);
    }
  };

  return (
    <>
      {isError && (
        <p className="text-medium text-destructive text-center">
          {error?.response?.data?.message ||
            error?.message ||
            "Internal Server Error"}
        </p>
      )}
      <div className="w-full gap-4">
        <LoadingButton
          loading={isPending}
          onClick={handleGoogleLogin}
          variant="outline"
          className="flex items-center w-full justify-center gap-3"
        >
          <Globe className="h-5 w-5 text-red-500" />
          <span>Continue with Google</span>
        </LoadingButton>
      </div>
    </>
  );
};

export default SocialAuth;
