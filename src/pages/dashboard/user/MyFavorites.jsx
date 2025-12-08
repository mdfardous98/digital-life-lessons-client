import useLessons from "../../../hooks/useLessons";
import LessonCard from "../../../components/lessons/LessonCard";

const MyFavorites = () => {
  const { data: favorites, loading } = useLessons("/api/favorites");

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Favorites</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {favorites.map((lesson) => (
          <LessonCard key={lesson._id} lesson={lesson} />
        ))}
      </div>
    </div>
  );
};

export default MyFavorites;
