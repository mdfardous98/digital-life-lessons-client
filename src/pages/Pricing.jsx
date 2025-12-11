import React from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useStripe } from "../contexts/StripeContext";
import toast from "react-hot-toast";
import {
  FaCrown,
  FaCheck,
  FaTimes,
  FaStar,
  FaLock,
  FaUnlock,
  FaUsers,
  FaChartLine,
  FaAd,
  FaShieldAlt,
  FaRocket,
  FaHeadphones,
  FaArrowRight,
  FaGem,
  FaTrophy,
} from "react-icons/fa";

const Pricing = () => {
  const { user, isPremium } = useAuth();
  const { createCheckoutSession } = useStripe();
  const navigate = useNavigate();

  const handleUpgrade = async () => {
    if (!user) {
      toast.error("Please login to upgrade to Premium");
      navigate("/login");
      return;
    }

    if (isPremium) {
      toast.error("You are already a Premium member");
      return;
    }

    try {
      await createCheckoutSession();
    } catch (error) {
      console.error("Upgrade error:", error);
    }
  };

  const features = [
    { name: "Create Premium Lessons", free: false, premium: true },
    { name: "Access Premium Content", free: false, premium: true },
    { name: "Ad-Free Experience", free: false, premium: true },
    { name: "Advanced Analytics", free: false, premium: true },
    { name: "Priority Support", free: false, premium: true },
    { name: "Unlimited Lessons", free: true, premium: true },
    { name: "Create Public Lessons", free: true, premium: true },
    { name: "Basic Analytics", free: true, premium: true },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Life Coach",
      content:
        "Premium features have transformed how I share my lessons. The ad-free experience and analytics are invaluable.",
      avatar:
        "https://ui-avatars.com/api/?name=Sarah+Johnson&background=6366f1&color=fff",
    },
    {
      name: "Michael Chen",
      role: "Entrepreneur",
      content:
        "Being able to create premium content has helped me monetize my wisdom while helping others grow.",
      avatar:
        "https://ui-avatars.com/api/?name=Michael+Chen&background=8b5cf6&color=fff",
    },
    {
      name: "Emma Wilson",
      role: "Writer",
      content:
        "The premium community is amazing. I've connected with like-minded individuals and learned so much.",
      avatar:
        "https://ui-avatars.com/api/?name=Emma+Wilson&background=10b981&color=fff",
    },
  ];

  const faqs = [
    {
      question: "What happens after I upgrade?",
      answer:
        "You'll get immediate access to all premium features. Your account will be updated automatically.",
    },
    {
      question: "Is this a recurring subscription?",
      answer:
        "No, this is a one-time payment for lifetime access to all premium features.",
    },
    {
      question: "Can I create premium lessons?",
      answer:
        "Yes! As a premium member, you can create both free and premium lessons.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards through our secure Stripe payment system.",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Pricing - Digital Life Lessons</title>
        <meta
          name="description"
          content="Upgrade to Premium for exclusive features and content"
        />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center py-12">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full mb-6 shadow-lg animate-fade-in">
            <FaCrown />
            <span className="font-semibold">PREMIUM</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 animate-fade-in">
            Upgrade Your Learning Experience
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 animate-fade-in">
            Get lifetime access to premium features, exclusive content, and
            advanced tools for sharing wisdom.
          </p>

          {isPremium ? (
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-primary to-secondary text-white px-6 py-4 rounded-xl shadow-lg transform hover:scale-105 transition-transform">
              <FaTrophy className="text-2xl" />
              <div>
                <p className="font-bold text-lg">You are a Premium Member!</p>
                <p className="text-sm opacity-90">
                  Thank you for supporting our community
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleUpgrade}
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl font-bold text-lg shadow-lg transform hover:scale-105 transition-transform"
              >
                <FaCrown className="mr-3" />
                Upgrade to Premium - ৳1500
              </button>
              <Link
                to="/dashboard/add-lesson"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-primary text-primary rounded-xl font-bold text-lg hover:bg-primary hover:text-white transition-colors shadow-sm"
              >
                Continue with Free Plan
              </Link>
            </div>
          )}
        </div>

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Free Plan */}
          <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-102 transition-transform">
            <div className="text-center mb-8">
              <div className="inline-block p-3 bg-gray-100 rounded-lg mb-4">
                <FaUsers className="text-3xl text-gray-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Free Plan
              </h2>
              <div className="mb-4">
                <span className="text-4xl font-bold text-gray-900">৳0</span>
                <span className="text-gray-600 ml-2">forever</span>
              </div>
              <p className="text-gray-600">
                Perfect for getting started with sharing lessons
              </p>
            </div>

            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  {feature.free ? (
                    <FaCheck className="text-green-500 mr-3 flex-shrink-0" />
                  ) : (
                    <FaTimes className="text-gray-300 mr-3 flex-shrink-0" />
                  )}
                  <span
                    className={feature.free ? "text-gray-900" : "text-gray-400"}
                  >
                    {feature.name}
                  </span>
                </div>
              ))}
            </div>

            <Link
              to="/dashboard/add-lesson"
              className="block w-full text-center py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors shadow-sm"
            >
              Get Started Free
            </Link>
          </div>

          {/* Premium Plan */}
          <div className="bg-gradient-to-br from-primary via-purple-600 to-secondary rounded-2xl shadow-xl p-8 text-white relative transform hover:scale-102 transition-transform">
            {!isPremium && (
              <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                <div className="bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold">
                  POPULAR
                </div>
              </div>
            )}

            <div className="text-center mb-8">
              <div className="inline-block p-3 bg-white/20 rounded-lg mb-4">
                <FaCrown className="text-3xl" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Premium Plan</h2>
              <div className="mb-4">
                <span className="text-4xl font-bold">৳1,500</span>
                <span className="opacity-80 ml-2">one-time payment</span>
              </div>
              <p className="opacity-90">
                Unlock all features and create premium content
              </p>
            </div>

            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <FaCheck className="text-yellow-300 mr-3 flex-shrink-0" />
                  <span>{feature.name}</span>
                </div>
              ))}
            </div>

            {isPremium ? (
              <div className="text-center py-3 bg-white/20 rounded-lg font-semibold">
                You are a Premium Member
              </div>
            ) : (
              <button
                onClick={handleUpgrade}
                className="w-full py-3 bg-white text-primary rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-sm"
              >
                Upgrade Now
              </button>
            )}
          </div>
        </div>

        {/* Feature Details */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Premium Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: FaStar,
                color: "blue",
                title: "Premium Content",
                desc: "Access exclusive lessons from top contributors",
              },
              {
                icon: FaChartLine,
                color: "green",
                title: "Advanced Analytics",
                desc: "Track engagement and growth with detailed insights",
              },
              {
                icon: FaAd,
                color: "red",
                title: "Ad-Free Experience",
                desc: "Enjoy clean, distraction-free learning",
              },
              {
                icon: FaHeadphones,
                color: "purple",
                title: "Priority Support",
                desc: "Get help faster with dedicated support",
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="text-center p-6 bg-white rounded-xl shadow-lg transform hover:scale-105 transition-transform"
                >
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 bg-${item.color}-100 rounded-full mb-4 transition-colors hover:bg-${item.color}-200`}
                  >
                    <Icon className={`text-3xl text-${item.color}-600`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            What Our Premium Members Say
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>

          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg transform hover:scale-102 transition-transform"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        {!isPremium && (
          <div className="text-center py-12 bg-gradient-to-r from-primary to-secondary rounded-2xl transform hover:scale-102 transition-transform">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Upgrade Your Learning Journey?
            </h2>
            <p className="text-white/90 text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of Premium members and unlock the full potential of
              Digital Life Lessons.
            </p>
            <button
              onClick={handleUpgrade}
              className="inline-flex items-center px-8 py-4 bg-white text-primary rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              <FaCrown className="mr-3" />
              Get Lifetime Premium - ৳1500
              <FaArrowRight className="ml-3" />
            </button>
            <p className="text-white/80 mt-4 text-sm">
              One-time payment • Lifetime access • 30-day money-back guarantee
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default Pricing;
