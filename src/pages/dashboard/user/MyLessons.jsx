import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const MyLessons = () => {
  const { currentUser } = useAuth();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const token = await currentUser.getIdToken();
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/lessons/my`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setLessons(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load lessons");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) fetchLessons();
  }, [currentUser]);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete Lesson?",
      text: "This cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = await currentUser.getIdToken();
          await fetch(`${import.meta.env.VITE_API_URL}/api/lessons/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
          setLessons(lessons.filter((l) => l._id !== id));
          toast.success("Lesson deleted");
        } catch (err) {
          console.error(err);
          toast.error("Failed to delete");
        }
      }
    });
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="overflow-x-auto">
      <h1 className="text-3xl font-bold mb-6">My Lessons ({lessons.length})</h1>
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Tone</th>
            <th>Visibility</th>
            <th>Access</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {lessons.map((lesson) => (
            <tr key={lesson._id}>
              <td>{lesson.title}</td>
              <td>{lesson.category}</td>
              <td>{lesson.emotionalTone}</td>
              <td>
                <span
                  className={`badge ${
                    lesson.visibility === "public"
                      ? "badge-success"
                      : "badge-ghost"
                  }`}
                >
                  {lesson.visibility}
                </span>
              </td>
              <td>
                <span
                  className={`badge ${
                    lesson.accessLevel === "premium"
                      ? "badge-warning"
                      : "badge-info"
                  }`}
                >
                  {lesson.accessLevel}
                </span>
              </td>
              <td className="flex gap-2">
                <Link
                  to={`/dashboard/update-lesson/${lesson._id}`}
                  className="btn btn-sm btn-primary"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(lesson._id)}
                  className="btn btn-sm btn-error"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default MyLessons;
