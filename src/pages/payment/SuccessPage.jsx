import { useEffect } from "react";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import successAnim from "../../assets/lottie/success.json";

const SuccessPage = () => {
  useEffect(() => {
    // verify session
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 to-emerald-100">
      <div className="text-center">
        <Lottie animationData={successAnim} className="w-96 mx-auto" />
        <h1 className="text-5xl font-bold text-green-700 mb-4">
          Payment Successful!
        </h1>
        <p className="text-2xl mb-8">Welcome to Premium</p>
        <Link to="/dashboard" className="btn btn-success btn-lg">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};
export default SuccessPage;
