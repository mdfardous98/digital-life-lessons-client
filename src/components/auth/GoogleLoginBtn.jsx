import { auth, googleProvider } from "../../lib/firebase";
import { signInWithPopup } from "firebase/auth";
import toast from "react-hot-toast";

export default function GoogleLoginBtn() {
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("Logged in with Google!");
    } catch (err) {
         console.error(err);
      toast.error("Google login failed");
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="btn btn-outline w-full flex items-center justify-center gap-3"
    >
      <img src="/google.svg" alt="Google" className="w-5 h-5" />
      Continue with Google
    </button>
  );
}
