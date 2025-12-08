import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaGithub,
  FaYoutube,
  FaHeart,
  FaArrowUp,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import logo from "../../assets/images/logo.png";

const Footer = () => {
  const socialLinks = {
    facebook: "https://facebook.com/yourpage",
    twitter: "https://twitter.com/yourhandle",
    youtube: "https://youtube.com/yourchannel",
    github: "https://github.com/yourusername",
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-500 footer-grid">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ">
        {/* 3 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 footer-container">
          {/* Column 1  */}
          <div className="space-y-4 footer-col-1">
            {/*  Logo + name */}
            <div className="flex items-center space-x-3">
              <img src={logo} alt="Logo" className="logo" />
              <span className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-yellow-400 via-pink-300 to-white">
                Digital Life Lessons
              </span>
            </div>

            {/*  Description */}
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Preserve your wisdom. Inspire others. Grow together.
              </p>
            </div>

            {/* Social icons + Back to Top */}
            <div className="flex items-center space-x-4">
              <div className="flex space-x-3">
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-500 hover:text-blue-500"
                >
                  <FaFacebook className="w-5 h-5" />
                </a>
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-500 hover:text-gray-300"
                >
                  <FaXTwitter className="w-5 h-5" />
                </a>
                <a
                  href={socialLinks.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-500 hover:text-red-500"
                >
                  <FaYoutube className="w-5 h-5" />
                </a>
                <a
                  href={socialLinks.github}
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-500 hover:text-gray-300"
                >
                  <FaGithub className="w-5 h-5" />
                </a>
              </div>
            </div>

            <button
              onClick={scrollToTop}
              className="ml-4 inline-flex items-center space-x-2 bg-gray-800 text-white hover:bg-gray-700 px-3 py-2 rounded-md transition text-sm"
            >
              <FaArrowUp />
              <span>Back to Top</span>
            </button>
          </div>

          {/* Column 2  */}
          <div className="space-y-6 footer-col-2">
            <div>
              <Link
                to="/terms"
                className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Terms
              </Link>
            </div>
            <div>
              <Link
                to="/conditions"
                className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Conditions
              </Link>
            </div>
          </div>

          {/* Column 3 */}
          <div className="space-y-6 footer-col-3">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              📧 support@digitallifelessons.com
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <span>📞 +880 1688 645 882 •</span>
              <br />
              <span>📍 Dhaka, Bangladesh</span>
            </div>
          </div>
        </div>

        {/* bottom row */}
        <div className="mt-8 border-t border-gray-200 dark:border-gray-800 pt-6 text-center text-xs text-gray-500 footer-bottom">
          © {new Date().getFullYear()} Digital Life Lessons. All rights
          reserved. Built with <FaHeart className="inline text-red-500 mx-1" />{" "}
          by Md Fardous
        </div>
      </div>
    </footer>
  );
};

export default Footer;
