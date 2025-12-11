import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  FaHeart,
  FaBookmark,
  FaEye,
  FaArrowRight,
  FaLightbulb,
  FaUsers,
  FaChartLine,
  FaStar,
  FaCrown,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";

const Home = () => {
  const [featuredLessons, setFeaturedLessons] = useState([]);
  const [topContributors, setTopContributors] = useState([]);
  const [mostSavedLessons, setMostSavedLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/lessons/public?limit=6`);
      setFeaturedLessons(response.data.lessons.slice(0, 3));
      setMostSavedLessons(response.data.lessons.slice(3, 6));

      setTopContributors([
        {
          id: 1,
          name: "Tajwar Fradous",
          lessonsCount: 42,
          avatar: "https://i.ibb.co.com/3mPmT2gW/IMG-20230126-171522.jpg",
        },
        {
          id: 2,
          name: "Monkey D Luffy",
          lessonsCount: 35,
          avatar:
            "https://i.ibb.co.com/VWy6RmfH/a53a10232289593-Y3-Jvc-Cwz-NTU4-LDI3-ODIs-MCwy-MTE.png",
        },
        {
          id: 3,
          name: "Bruce wayne",
          lessonsCount: 28,
          avatar: "https://i.ibb.co.com/mrFV8z25/images-3.jpg",
        },
        {
          id: 4,
          name: "Jon Wick",
          lessonsCount: 25,
          avatar: "https://i.ibb.co.com/7d03s46P/images-4.jpg",
        },
      ]);
    } catch (error) {
      console.error("Error fetching home data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const heroSlides = [
    {
      title: "Preserve Your Wisdom",
      description:
        "Document life lessons, share insights, and grow through community wisdom.",
      bgColor: "from-blue-500 to-teal-500",
      buttonText: "Start Your Journey",
      buttonLink: "/dashboard/add-lesson",
      buttonColor: "bg-white text-blue-600 hover:bg-gray-100",
    },
    {
      title: "Learn From Others",
      description: "Discover valuable lessons from people around the world.",
      bgColor: "from-green-400 to-teal-600",
      buttonText: "Explore Lessons",
      buttonLink: "/public-lessons",
      buttonColor: "bg-white text-green-600 hover:bg-gray-100",
    },
    {
      title: "Upgrade to Premium",
      description: "Unlock exclusive content and advanced features.",
      bgColor: "from-purple-500 to-pink-600",
      buttonText: "Get Premium",
      buttonLink: "/pricing",
      buttonColor: "bg-white text-purple-600 hover:bg-gray-100",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };

  const benefits = [
    {
      icon: <FaLightbulb className="text-3xl text-yellow-400" />,
      title: "Preserve Wisdom",
      description:
        "Document your life lessons and insights for future reflection and sharing.",
    },
    {
      icon: <FaUsers className="text-3xl text-blue-400" />,
      title: "Community Learning",
      description:
        "Learn from others experiences and share your own wisdom with the community.",
    },
    {
      icon: <FaChartLine className="text-3xl text-green-400" />,
      title: "Personal Growth",
      description:
        "Track your personal development journey through the lessons you learn.",
    },
    {
      icon: <FaStar className="text-3xl text-purple-400" />,
      title: "Premium Insights",
      description:
        "Access exclusive premium content from experienced mentors and thought leaders.",
    },
  ];

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <>
      <Helmet>
        <title>Digital Life Lessons - Home</title>
        <meta
          name="description"
          content="Preserve wisdom, share insights, and grow together through life's lessons"
        />
      </Helmet>

      <section className="relative overflow-hidden">
        <div className="relative h-[500px]">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r ${slide.bgColor}`}
              >
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="relative container mx-auto px-4 h-full flex items-center">
                  <div className="max-w-2xl text-white">
                    <h1 className="text-5xl font-bold mb-4 animate-fadeIn">
                      {slide.title}
                    </h1>
                    <p className="text-xl mb-8 animate-fadeIn">
                      {slide.description}
                    </p>
                    <Link
                      to={slide.buttonLink}
                      className={`inline-flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${slide.buttonColor}`}
                    >
                      <span>{slide.buttonText}</span>
                      <FaArrowRight />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-3 rounded-full transition-all duration-300"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-3 rounded-full transition-all duration-300"
          >
            <FaChevronRight />
          </button>

          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Life Lessons
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover handpicked lessons that inspire, teach, and transform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredLessons.map((lesson) => (
              <div
                key={lesson._id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
              >
                {lesson.image && (
                  <img
                    src={lesson.image}
                    alt={lesson.title}
                    className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                  />
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                      {lesson.category || "General"}
                    </span>
                    <span className="px-3 py-1 bg-teal-100 text-teal-600 rounded-full text-sm">
                      {lesson.emotionalTone || "Neutral"}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{lesson.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {lesson.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <img
                        src={
                          lesson.author?.photoURL ||
                          "https://yourdomain.com/images/default.jpg"
                        }
                        alt={lesson.author?.displayName || "Anonymous"}
                        className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-md"
                      />
                      <span className="text-sm text-gray-600">
                        {lesson.author?.displayName || "Anonymous"}
                      </span>
                    </div>
                    <Link
                      to={`/lessons/${lesson._id}`}
                      className="text-blue-600 hover:text-blue-500 font-medium"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Learning From Life Matters
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Real growth comes from real experiences. Here's why documenting
              life lessons is transformative.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4 animate-fadeIn">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Top Contributors of the Week
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Meet our most active community members sharing valuable insights
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topContributors.map((contributor) => (
              <div
                key={contributor.id}
                className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-2xl transition-shadow duration-300"
              >
                <img
                  src={contributor.avatar}
                  alt={contributor.name}
                  className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-white shadow-md transition-transform duration-300 hover:scale-105"
                />
                <h3 className="text-xl font-bold mb-1">{contributor.name}</h3>
                <div className="flex items-center justify-center space-x-1 text-gray-600 mb-4">
                  <FaBookmark className="text-blue-600" />
                  <span>{contributor.lessonsCount} lessons</span>
                </div>
                <Link
                  to="/public-lessons"
                  className="text-blue-600 hover:text-blue-500 font-medium inline-flex items-center"
                >
                  <span>View Lessons</span>
                  <FaArrowRight className="ml-1" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
