import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const LessonCard = ({ lesson }) => {
  const { isPremium } = useAuth();
  const isPremiumLesson = lesson.accessLevel === "premium";

  return (
    <div
      className={`card bg-base-100 shadow-xl hover:shadow-2xl transition-all ${
        isPremiumLesson && !isPremium ? "blur-sm" : ""
      }`}
    >
      {isPremiumLesson && !isPremium && (
        <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center z-10">
          <div className="text-center">
            <span className="text-6xl mb-4">Lock</span>
            <p className="text-white text-xl font-bold mb-4">Premium Lesson</p>
            <Link to="/pricing" className="btn btn-warning">
              Upgrade Now
            </Link>
          </div>
        </div>
      )}

      <figure className="h-48">
        <img
          src={
            lesson.image || "https://via.placeholder.com/400x200?text=No+Image"
          }
          alt={lesson.title}
          className="w-full h-full object-cover"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{lesson.title}</h2>
        <p className="text-sm opacity-80 line-clamp-2">{lesson.description}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          <div className="badge badge-primary">{lesson.category}</div>
          <div className="badge badge-secondary">{lesson.emotionalTone}</div>
          {isPremiumLesson && (
            <div className="badge badge-warning">Premium</div>
          )}
        </div>
        <div className="card-actions justify-end mt-4">
          <Link
            to={`/lessons/${lesson._id}`}
            className="btn btn-sm btn-primary"
          >
            See Details
          </Link>
        </div>
      </div>
    </div>
  );
};
export default LessonCard;
