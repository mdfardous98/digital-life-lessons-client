import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  FaTimesCircle,
  FaArrowLeft,
  FaCreditCard,
  FaQuestionCircle,
  FaShieldAlt,
  FaSync,
} from "react-icons/fa";

const PaymentCancel = () => {
  return (
    <>
      <Helmet>
        <title>Payment Cancelled - Digital Life Lessons</title>
      </Helmet>

      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 via-pink-50 to-yellow-50 px-4 py-12 animate-fade-in">
        <div className="max-w-2xl w-full text-center">
          <div className="mb-6">
            <FaTimesCircle className="text-6xl text-red-500 mx-auto transform transition-transform hover:scale-110" />
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Payment Cancelled
          </h1>

          <p className="text-xl text-gray-600 mb-8">
            Your payment was not completed. Don't worry - you can try again
            anytime.
          </p>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              What Would You Like to Do Next?
            </h2>

            <div className="space-y-4">
              <Link
                to="/pricing"
                className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all transform hover:scale-105 group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <FaCreditCard className="text-2xl text-purple-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Try Payment Again
                    </h3>
                    <p className="text-gray-600">
                      Complete your upgrade to Premium
                    </p>
                  </div>
                </div>
                <FaArrowLeft className="text-gray-400 group-hover:text-purple-500 transition-colors transform rotate-180" />
              </Link>

              <Link
                to="/dashboard"
                className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all transform hover:scale-105 group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <FaSync className="text-2xl text-green-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Continue with Free Plan
                    </h3>
                    <p className="text-gray-600">
                      Explore free features and create basic lessons
                    </p>
                  </div>
                </div>
                <FaArrowLeft className="text-gray-400 group-hover:text-green-500 transition-colors transform rotate-180" />
              </Link>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FaQuestionCircle className="text-2xl text-purple-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Need Help?
                    </h3>
                    <p className="text-gray-600">
                      Contact our support team for assistance
                    </p>
                  </div>
                </div>
                <a
                  href="mailto:support@lifelessons.com"
                  className="text-purple-600 hover:text-purple-700 font-semibold transition-colors"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Common Payment Issues
            </h2>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 text-sm font-bold">1</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Insufficient Funds
                  </h4>
                  <p className="text-gray-600">
                    Ensure your payment method has sufficient balance
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-yellow-600 text-sm font-bold">2</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Card Declined</h4>
                  <p className="text-gray-600">
                    Check with your bank if international transactions are
                    enabled
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-bold">3</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Network Issues
                  </h4>
                  <p className="text-gray-600">
                    Try again with a stable internet connection
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white mb-8 shadow-lg">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <FaShieldAlt className="text-2xl" />
              <h3 className="text-xl font-bold">Secure Payment Guarantee</h3>
            </div>
            <p className="opacity-90">
              Your payment information is encrypted and secure. We never store
              your credit card details.
            </p>
          </div>

          <div className="space-y-4">
            <Link
              to="/pricing"
              className="inline-flex items-center justify-center px-8 py-4 bg-purple-500 text-white rounded-xl font-bold text-lg hover:bg-purple-600 transition-colors transform hover:scale-105 w-full"
            >
              <FaCreditCard className="mr-3" />
              Try Payment Again
            </Link>

            <Link
              to="/"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 font-semibold transition-colors transform hover:scale-105"
            >
              <FaArrowLeft className="mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentCancel;
