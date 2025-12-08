import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";

const reasons = [
  "Inappropriate Content",
  "Hate Speech or Harassment",
  "Misleading or False Information",
  "Spam or Promotional Content",
  "Sensitive or Disturbing Content",
  "Other",
];

const ReportModal = ({ lessonId, onClose }) => {
  const { currentUser } = useAuth();
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");

  const submitReport = async () => {
    if (!reason) return toast.error("Please select a reason");

    const token = await currentUser.getIdToken();
    await fetch(
      `${import.meta.env.VITE_API_URL}/api/lessons/${lessonId}/report`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason, message }),
      }
    );
    toast.success("Report submitted. Thank you!");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-base-100 p-8 rounded-2xl max-w-md w-full">
        <h3 className="text-2xl font-bold mb-4">Report This Lesson</h3>
        <select
          className="select select-bordered w-full mb-4"
          onChange={(e) => setReason(e.target.value)}
        >
          <option value="">Select reason</option>
          {reasons.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
        <textarea
          className="textarea textarea-bordered w-full"
          placeholder="Additional details (optional)"
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="modal-action">
          <button onClick={submitReport} className="btn btn-error">
            Submit Report
          </button>
          <button onClick={onClose} className="btn">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
export default ReportModal;
