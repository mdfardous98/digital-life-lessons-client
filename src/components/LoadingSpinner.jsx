import React from "react";

const LoadingSpinner = ({ size = "md", fullScreen = false }) => {
  const sizes = {
    sm: "w-6 h-6",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const spinner = (
    <div className="flex justify-center items-center">
      <div
        className={`${sizes[size]} animate-spin rounded-full border-4 border-gray-300 border-t-gradient-to-r from-indigo-500 via-purple-500 to-pink-500`}
      ></div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-80 flex justify-center items-center z-50 transition-colors duration-300">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
