import { useAuth } from "../../../contexts/AuthContext";
import useLessons from "../../../hooks/useLessons";
import LessonCard from "../../../components/lessons/LessonCard";

const Profile = () => {
  const { currentUser } = useAuth();
  const { data: lessons, loading } = useLessons("/api/lessons/my");

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      <div className="card bg-base-100 shadow-xl p-6 mb-8">
        <img
          src={currentUser.photoURL}
          className="w-32 rounded-full mx-auto mb-4"
        />
        <h2 className="text-2xl font-bold text-center">
          {currentUser.displayName}
        </h2>
        <p className="text-center">{currentUser.email}</p>
        <p className="text-center badge badge-primary mt-2">
          {currentUser.isPremium ? "Premium" : "Free"}
        </p>
      </div>
      <h2 className="text-2xl font-bold mb-4">My Lessons</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {lessons.map((lesson) => (
          <LessonCard key={lesson._id} lesson={lesson} />
        ))}
      </div>
    </div>
  );
};

export default Profile;
