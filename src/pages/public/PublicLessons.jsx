import { useState, useEffect } from "react";
import LessonCard from "../../components/lessons/LessonCard";

const PublicLessons = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/lessons/public`)
      .then((res) => res.json())
      .then((data) => {
        setLessons(data);
        setLoading(false);
      });
  }, []);

  if (loading)
    return <div className="text-center py-20">Loading lessons...</div>;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold text-center mb-10">
        Public Life Lessons
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {lessons.map((lesson) => (
          <LessonCard key={lesson._id} lesson={lesson} />
        ))}
      </div>
    </div>
  );
};
export default PublicLessons;
