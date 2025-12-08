import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
} from "react-share";
import ReportModal from "../../components/lessons/ReportModal";
import LessonCard from "../../components/lessons/LessonCard";

const LessonDetailsPage = () => {
  const { id } = useParams();
  const { currentUser, isPremium } = useAuth();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [related, setRelated] = useState([]);
  const [liked, setLiked] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [showReport, setShowReport] = useState(false);

  const [views] = useState(() => Math.floor(Math.random() * 10000) + 100);

  const shareUrl = window.location.href;
  const title = lesson?.title || "Check out this life lesson!";

  useEffect(() => {
    const fetchData = async () => {
      const token = currentUser ? await currentUser.getIdToken() : null;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/lessons/public/${id}`,
        { headers }
      );
      const data = await res.json();

      if (data.accessLevel === "premium" && !isPremium) {
        toast.error("Upgrade to Premium to view this lesson");
        navigate("/pricing");
        return;
      }

      setLesson(data);
      setLikesCount(data.likesCount || 0);
      setLiked(data.likes?.includes(currentUser?.uid));
      setFavorited(await checkFavorite(data._id));

      // Related lessons
      const relRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/lessons/public?category=${
          data.category
        }`
      );
      const relData = await relRes.json();
      setRelated(relData.filter((l) => l._id !== id).slice(0, 6));
    };

    const checkFavorite = async (lessonId) => {
      if (!currentUser) return false;
      const token = await currentUser.getIdToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const favs = await res.json();
      return favs.some((f) => f._id === lessonId);
    };

    fetchData();
  }, [id, currentUser, isPremium, navigate]);

  const handleLike = async () => {
    if (!currentUser) return toast.error("Please log in to like");
    const token = await currentUser.getIdToken();

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/lessons/${id}/like`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await res.json();
    setLiked(data.liked);
    setLikesCount(data.likesCount);
  };

  const handleFavorite = async () => {
    if (!currentUser) return toast.error("Please log in");
    const token = await currentUser.getIdToken();

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/lessons/${id}/favorite`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await res.json();
    setFavorited(data.favorited);
    toast.success(data.favorited ? "Saved!" : "Removed from favorites");
  };

  if (!lesson)
    return <div className="text-center py-20 text-2xl">Loading...</div>;

  return (
    <>
      {showReport && (
        <ReportModal lessonId={id} onClose={() => setShowReport(false)} />
      )}

      <div className="container mx-auto py-10 px-6 max-w-6xl">
        {/* Premium Full-Screen Lock */}
        {lesson.accessLevel === "premium" && !isPremium && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
            <div className="text-center text-white p-10">
              <span className="text-9xl mb-6 block">Lock</span>
              <h2 className="text-5xl font-bold mb-6">Premium Lesson</h2>
              <p className="text-2xl mb-8">Upgrade to unlock full content</p>
              <Link to="/pricing" className="btn btn-warning btn-lg">
                Upgrade Now →
              </Link>
            </div>
          </div>
        )}

        <div
          className={
            lesson.accessLevel === "premium" && !isPremium
              ? "blur-3xl pointer-events-none"
              : ""
          }
        >
          {/* 1. Lesson Content */}
          <h1 className="text-5xl font-bold mb-6">{lesson.title}</h1>

          {lesson.image && (
            <img
              src={lesson.image}
              alt={lesson.title}
              className="w-full h-96 object-cover rounded-2xl mb-8 shadow-2xl"
            />
          )}

          <p className="text-xl leading-relaxed text-base-content/90 mb-12 whitespace-pre-wrap">
            {lesson.description}
          </p>

          {/* 2. Metadata */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="text-center bg-base-200 p-5 rounded-xl">
              <p className="text-sm opacity-70">Category</p>
              <p className="font-bold text-lg">{lesson.category}</p>
            </div>

            <div className="text-center bg-base-200 p-5 rounded-xl">
              <p className="text-sm opacity-70">Tone</p>
              <p className="font-bold text-lg">{lesson.emotionalTone}</p>
            </div>

            <div className="text-center bg-base-200 p-5 rounded-xl">
              <p className="text-sm opacity-70">Created</p>
              <p className="font-bold text-lg">
                {new Date(lesson.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="text-center bg-base-200 p-5 rounded-xl">
              <p className="text-sm opacity-70">Views</p>
              <p className="font-bold text-lg">{views.toLocaleString()}K</p>
            </div>
          </div>

          {/* 3. Author Card */}
          <div className="card bg-base-100 shadow-xl p-8 mb-12">
            <div className="flex items-center gap-6">
              <div className="avatar">
                <div className="w-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img src={lesson.author?.photoURL || "/avatar.png"} />
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold">
                  {lesson.author?.displayName}
                </h3>
                <p className="opacity-70">Life Teacher</p>

                <Link
                  to={`/profile/${lesson.author?._id}`}
                  className="btn btn-ghost btn-sm mt-2"
                >
                  View all lessons by this author
                </Link>
              </div>
            </div>
          </div>

          {/* 4. Stats */}
          <div className="flex flex-wrap gap-8 justify-center text-2xl font-bold mb-10">
            <button onClick={handleLike} className="flex items-center gap-2">
              {liked ? "Heart Filled" : "Heart"} {likesCount} Likes
            </button>

            <button
              onClick={handleFavorite}
              className="flex items-center gap-2"
            >
              {favorited ? "Bookmark Filled" : "Bookmark"}{" "}
              {likesCount > 342 ? "342+" : "0"} Favorites
            </button>

            <div className="flex items-center gap-2">
              Eye {views.toLocaleString()}K Views
            </div>
          </div>

          {/* 5. Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <button onClick={handleFavorite} className="btn btn-outline btn-lg">
              {favorited ? "Saved" : "Save to Favorites"}
            </button>

            <button onClick={handleLike} className="btn btn-primary btn-lg">
              {liked ? "Liked" : "Like"} ({likesCount})
            </button>

            <button
              onClick={() => setShowReport(true)}
              className="btn btn-error btn-lg"
            >
              Report Lesson
            </button>

            <div className="flex gap-2">
              <FacebookShareButton url={shareUrl} quote={title}>
                <FacebookIcon size={40} round />
              </FacebookShareButton>

              <TwitterShareButton url={shareUrl} title={title}>
                <TwitterIcon size={40} round />
              </TwitterShareButton>

              <LinkedinShareButton url={shareUrl} title={title}>
                <LinkedinIcon size={40} round />
              </LinkedinShareButton>
            </div>
          </div>

          {/* Related Lessons */}
          <h2 className="text-3xl font-bold mb-8">Similar Lessons</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {related.map((l) => (
              <LessonCard key={l._id} lesson={l} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default LessonDetailsPage;
