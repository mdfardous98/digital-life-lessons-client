
import React from "react";

const HomePage = () => {
  return (
    <div className="py-8">
      <h1 className="text-4xl font-bold text-white mb-4">
        Welcome to Digital Life Lessons
      </h1>
      <p className="text-lg text-gray-300 mb-8">
        Preserve your wisdom. Inspire others. Grow together.
      </p>
      <div className="mt-8">
        <img
          src="/path/to/your/owl-image.png" 
          alt="Owl"
          className="w-full max-w-md mx-auto rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
};

export default HomePage;
