import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import toast from "react-hot-toast";

const ReportedLessons = () => {
  const { currentUser } = useAuth();
  const [reports, setReports] = useState([]);

  useEffect(() => {
    if (!currentUser) return;

    const fetchReports = async () => {
      try {
        const token = await currentUser.getIdToken();
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/admin/reports`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setReports(data);
      } catch (error) {
        toast.error("Failed to fetch reports");
        console.error(error);
      }
    };

    fetchReports();
  }, [currentUser]);

  // Delete lesson
  const handleDelete = async (lessonId) => {
    if (!lessonId) return;

    try {
      const token = await currentUser.getIdToken();
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/lessons/${lessonId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Lesson deleted");
      setReports(reports.filter((r) => r.lessonId?._id !== lessonId));
    } catch (error) {
      toast.error("Failed to delete lesson");
      console.error(error);
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">
        Reported Lessons ({reports.length})
      </h1>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Reason</th>
              <th>Reporter</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report._id}>
                <td>{report.lessonId?.title || "Deleted"}</td>
                <td>{report.reason}</td>
                <td>{report.reporterEmail}</td>
                <td>{new Date(report.createdAt).toLocaleDateString()}</td>
                <td className="flex gap-2">
                  <button
                    onClick={() => handleDelete(report.lessonId?._id)}
                    className="btn btn-error btn-sm"
                  >
                    Delete Lesson
                  </button>
                  <button className="btn btn-ghost btn-sm">Ignore</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportedLessons;
