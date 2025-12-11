import React from "react";
import { Link } from "react-router-dom";
import {
  FaBook,
  FaFacebook,
  FaLinkedin,
  FaInstagram,
  FaHeart,
} from "react-icons/fa";
import { FaXTwitter, FaGithub } from "react-icons/fa6";
import logo from "../assets/logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = {
    facebook: "https://www.facebook.com/tajwar.fardous",
    x: "https://twitter.com/YourRealXHandle",
    linkedin: "https://www.linkedin.com/in/YourRealProfile",
    instagram: "https://www.instagram.com/YourRealAccount",
    github: "https://github.com/mdfardous98",
  };

  return (
    <footer className="bg-gradient-to-t from-gray-900 to-gray-800 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo + description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 rounded-lg overflow-hidden transform hover:scale-110 transition-transform duration-300">
                <img
                  src={logo}
                  alt="Digital Life Lessons logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-2xl font-bold text-gray-100">
                Digital Life Lessons
              </span>
            </div>

            <p className="text-gray-300 mb-4">
              Preserving wisdom, sharing insights, and growing together through
              life's lessons. Join our community to learn, share, and inspire.
            </p>

            <div className="flex space-x-4">
              {Object.entries(socialLinks).map(([key, url]) => {
                const Icon =
                  key === "facebook"
                    ? FaFacebook
                    : key === "x"
                    ? FaXTwitter
                    : key === "linkedin"
                    ? FaLinkedin
                    : key === "instagram"
                    ? FaInstagram
                    : FaGithub;
                return (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 transition-transform duration-300 transform hover:scale-110"
                    aria-label={key}
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-100">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-white hover:underline transition-colors duration-300"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/public-lessons"
                  className="text-gray-300 hover:text-white hover:underline transition-colors duration-300"
                >
                  Public Lessons
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/add-lesson"
                  className="text-gray-300 hover:text-white hover:underline transition-colors duration-300"
                >
                  Add Lesson
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="text-gray-300 hover:text-white hover:underline transition-colors duration-300"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-100">
              Contact Us
            </h3>
            <ul className="space-y-2 text-gray-300">
              <li>Email: mdjfardous@gmail.com</li>
              <li>Phone: +880 1688 645 882</li>
              <li>Address: Dhaka, Bangladesh</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-300 mb-4 md:mb-0">
            &copy; {currentYear} Digital Life Lessons. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <Link
              to="/terms"
              className="text-gray-300 hover:text-white hover:underline transition-colors duration-300"
            >
              Terms & Conditions
            </Link>
            <Link
              to="/privacy"
              className="text-gray-300 hover:text-white hover:underline transition-colors duration-300"
            >
              Privacy Policy
            </Link>
            <Link
              to="/cookies"
              className="text-gray-300 hover:text-white hover:underline transition-colors duration-300"
            >
              Cookie Policy
            </Link>
          </div>
        </div>

        <div className="text-center mt-8 pt-4 border-t border-gray-700">
          <p className="text-gray-400 flex items-center justify-center space-x-1">
            <span>Made with</span>
            <FaHeart className="text-red-500 mx-1 animate-pulse" />
            <span>by MD FARDOUS</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
