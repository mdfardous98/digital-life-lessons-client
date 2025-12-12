import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FaCheckCircle,
  FaCrown,
  FaArrowRight,
  FaBook,
  FaUsers,
  FaStar,
  FaChartLine,
} from "react-icons/fa";
import Lottie from "react-lottie";
import animationData from "../assets/success-animation.json";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const { user, checkPremiumStatus, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [premiumActivated, setPremiumActivated] = useState(false);
  // const sessionId = searchParams.get("session_id");

  // const sessionId = searchParams.get("session_id") || null;

  // 1. Get the session_id from the URL query parameters
  const sessionId = new URLSearchParams(location.search).get("session_id");

  useEffect(() => {
    if (authLoading) {
      return;
    }

    const verify = async () => {
      if (!sessionId) {
        toast.error("Invalid payment session");
        navigate("/pricing");
        return;
      }

      if (!user) {
        toast.error("Please login to view payment status");
        navigate("/login");
        return;
      }

      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await checkPremiumStatus();
        const token = await user.getIdToken();

      
        const url =
          `${import.meta.env.VITE_API_URL}/api/users/me` +
          (sessionId ? `?session_id=${encodeURIComponent(sessionId)}` : "");

       
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data?.isPremium) {
          setPremiumActivated(true);
          toast.success("Premium activated successfully!");
        } else {
          setPremiumActivated(false);
          toast.info(
            "Premium activation is being processed. Please refresh in a moment."
          );
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        toast.error("Payment verification failed");
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [sessionId, user, checkPremiumStatus, navigate, authLoading]);

  const lottieOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Payment Successful - Digital Life Lessons</title>
      </Helmet>

      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 px-4 py-12 animate-fade-in">
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto mb-6">
            <Lottie options={lottieOptions} height={128} width={128} />
          </div>

          <div className="text-center mb-2">
            <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4 transform transition-transform hover:scale-110" />
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {premiumActivated ? "Payment Successful!" : "Payment Received"}
            </h1>
            <p className="text-xl text-gray-600 mb-6 max-w-2xl">
              {premiumActivated
                ? "Thank you for upgrading to Premium! Your account has been activated with all premium features."
                : "We received your payment. Premium activation may still be processing. Please refresh in a moment."}
            </p>
          </div>
        </div>

        {premiumActivated ? (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-full mb-8 shadow-lg transform transition-transform hover:scale-105">
            <div className="flex items-center space-x-3">
              <FaCrown className="text-2xl" />
              <span className="text-xl font-bold">PREMIUM MEMBER</span>
            </div>
          </div>
        ) : (
          <div className="px-6 py-3 rounded-full mb-8">
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">
                Activation status:{" "}
                <strong className="text-gray-900">
                  {premiumActivated ? "Active" : "Pending"}
                </strong>
              </span>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl w-full mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            What You Can Do Now
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-start space-x-4 p-4 border border-gray-200 rounded-xl hover:border-green-400 transition-all transform hover:scale-[1.02]">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center transition-colors hover:bg-blue-200">
                  <FaCrown className="text-2xl text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Create Premium Lessons
                </h3>
                <p className="text-gray-600">
                  Share exclusive content with other premium members
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 border border-gray-200 rounded-xl hover:border-green-400 transition-all transform hover:scale-[1.02]">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center transition-colors hover:bg-green-200">
                  <FaBook className="text-2xl text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Access Premium Content
                </h3>
                <p className="text-gray-600">
                  Unlock all premium lessons from top contributors
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 border border-gray-200 rounded-xl hover:border-purple-400 transition-all transform hover:scale-[1.02]">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center transition-colors hover:bg-purple-200">
                  <FaChartLine className="text-2xl text-purple-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Advanced Analytics
                </h3>
                <p className="text-gray-600">
                  Track your lesson performance with detailed insights
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 border border-gray-200 rounded-xl hover:border-red-400 transition-all transform hover:scale-[1.02]">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center transition-colors hover:bg-red-200">
                  <FaUsers className="text-2xl text-red-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Premium Community
                </h3>
                <p className="text-gray-600">
                  Connect with other premium members and mentors
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Start Your Premium Journey
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/dashboard/add-lesson"
                className="inline-flex items-center justify-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors transform hover:scale-105"
              >
                <FaBook className="mr-2" />
                Create Your First Premium Lesson
                <FaArrowRight className="ml-2" />
              </Link>

              <Link
                to="/public-lessons"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-green-500 text-green-500 rounded-lg hover:bg-green-500 hover:text-white transition-colors transform hover:scale-105"
              >
                <FaStar className="mr-2" />
                Browse Premium Content
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl w-full mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Payment Details
          </h2>

          <div className="space-y-4 max-w-md mx-auto">
            <div className="flex justify-between items-center py-3 border-b">
              <span className="text-gray-600">Plan</span>
              <span className="font-semibold">Lifetime Premium</span>
            </div>

            <div className="flex justify-between items-center py-3 border-b">
              <span className="text-gray-600">Amount</span>
              <span className="font-semibold">৳1,500</span>
            </div>

            <div className="flex justify-between items-center py-3 border-b">
              <span className="text-gray-600">Payment Date</span>
              <span className="font-semibold">
                {new Date().toLocaleDateString()}
              </span>
            </div>

            <div className="flex justify-between items-center py-3 border-b">
              <span className="text-gray-600">Status</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                Completed
              </span>
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              A receipt has been sent to{" "}
              <span className="font-semibold">{user?.email}</span>
            </p>
          </div>
        </div>

        <div className="text-center space-y-4">
          <div className="space-x-4">
            <Link
              to="/dashboard"
              className="inline-flex items-center text-green-500 hover:text-green-600 font-semibold transition-colors transform hover:scale-105"
            >
              Go to Dashboard
              <FaArrowRight className="ml-2" />
            </Link>
          </div>

          <p className="text-gray-500 text-sm">
            Need help? Contact support@lifelessons.com
          </p>
        </div>
      </div>
    </>
  );
};

export default PaymentSuccess;
