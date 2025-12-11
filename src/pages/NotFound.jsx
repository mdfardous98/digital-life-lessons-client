import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaHome,
  FaCompass,
  FaBook,
  FaQuestionCircle,
  FaArrowLeft,
  FaExclamationTriangle,
} from "react-icons/fa";

const NotFound = () => {
  const popularLinks = [
    { path: "/", name: "Home", icon: <FaHome /> },
    { path: "/public-lessons", name: "Public Lessons", icon: <FaBook /> },
    { path: "/dashboard", name: "Dashboard", icon: <FaCompass /> },
    { path: "/pricing", name: "Pricing", icon: <FaQuestionCircle /> },
  ];

  const commonErrors = [
    "Oops! Double-check if the URL didn’t wander off.",
    "Are you logged in? Some pages only open to VIPs.",
    "Looks like this page might have moved… or gone on vacation.",
    "Try refreshing the page or clearing your cache — sometimes the internet just needs a coffee break.",
    "By the way, this masterpiece was crafted by MD Fardous. Got feedback or just want to say hi? Reach him at mdjfardous@gmail.com😎",
  ];

  return (
    <>
      <Helmet>
        <title>404 - Page Not Found</title>
        <meta
          name="description"
          content="The page you are looking for doesn't exist or has been moved."
        />
      </Helmet>

      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 px-4 py-12 animate-fade-in">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mb-6 shadow-lg transform transition-transform hover:scale-110">
              <FaExclamationTriangle className="text-6xl text-white" />
            </div>
            <h1 className="text-7xl md:text-8xl font-bold text-gray-900 mb-4">
              404
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Page Not Found
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Oops! The page you're looking for seems to have wandered off into
              the digital wilderness.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <FaSearch className="text-2xl text-purple-500" />
              <h3 className="text-2xl font-bold text-gray-900">
                Looking for something?
              </h3>
            </div>

            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Search lessons, users, or topics..."
                className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all duration-200"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                Search
              </button>
            </div>

            <p className="text-gray-600">Or try one of these popular pages:</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {popularLinks.map((link, index) => (
              <Link
                key={index}
                to={link.path}
                className="group flex flex-col items-center p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all hover:scale-[1.03]"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {React.cloneElement(link.icon, {
                    className: "text-2xl text-white",
                  })}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {link.name}
                </h3>
                <p className="text-gray-600 text-center text-sm">
                  {link.path === "/" && "Return to the homepage"}
                  {link.path === "/public-lessons" &&
                    "Browse community lessons"}
                  {link.path === "/dashboard" &&
                    "Access your personal dashboard"}
                  {link.path === "/pricing" && "View premium plans"}
                </p>
              </Link>
            ))}
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 text-white mb-8 shadow-lg">
            <h3 className="text-2xl font-bold mb-6">Troubleshooting Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {commonErrors.map((tip, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="font-bold">{index + 1}</span>
                    </div>
                  </div>
                  <p className="opacity-90">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center space-y-6">
            <div className="space-x-4">
              <Link
                to="/"
                className="inline-flex items-center px-6 py-3 bg-purple-500 text-white rounded-xl font-semibold hover:bg-purple-600 transition-colors transform hover:scale-105"
              >
                <FaHome className="mr-2" />
                Go to Homepage
              </Link>
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center px-6 py-3 border-2 border-purple-500 text-purple-500 rounded-xl font-semibold hover:bg-purple-500 hover:text-white transition-colors transform hover:scale-105"
              >
                <FaArrowLeft className="mr-2" />
                Go Back
              </button>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <p className="text-gray-600 mb-2">
                Still having trouble? We're here to help!
              </p>
              <div className="space-x-4">
                <a
                  href="mailto:support@lifelessons.com"
                  className="inline-flex items-center text-purple-500 hover:text-purple-400 font-semibold transition-colors"
                >
                  Contact Support
                </a>
                <span className="text-gray-400">•</span>
                <a
                  href="/dashboard"
                  className="inline-flex items-center text-purple-500 hover:text-purple-400 font-semibold transition-colors"
                >
                  Visit Dashboard
                </a>
                <span className="text-gray-400">•</span>
                <a
                  href="/public-lessons"
                  className="inline-flex items-center text-purple-500 hover:text-purple-400 font-semibold transition-colors"
                >
                  Browse Lessons
                </a>
              </div>
            </div>

            <div className="pt-6">
              <p className="text-gray-500 italic">
                "Not all who wander are lost, but this page definitely is."
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
