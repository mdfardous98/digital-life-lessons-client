import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

const CommentsSection = ({ lessonId }) => {
  const { currentUser } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/lessons/${lessonId}/comments`
      );
      if (!res.ok) throw new Error("Failed to fetch comments");
      const data = await res.json();
      setComments(data);
    } catch (err) {
      console.error(err);
      toast.error("Could not load comments");
    }
  }, [lessonId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const addComment = async () => {
    if (!newComment.trim()) return;

    try {
      const token = await currentUser.getIdToken();
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/lessons/${lessonId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ commentText: newComment }),
        }
      );

      if (!res.ok) throw new Error("Failed to add comment");

      const createdComment = await res.json();

      toast.success("Comment added");
      setNewComment("");

      setComments((prev) => [...prev, createdComment]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add comment");
    }
  };

  return (
    <div>
      <h3 className="text-2xl font-bold mb-4">Comments</h3>

      {comments.map((c) => (
        <div key={c._id} className="chat chat-start">
          <div className="chat-image avatar">
            <div className="w-10 rounded-full">
              <img src={c.userId.photoURL} alt={c.userId.displayName} />
            </div>
          </div>
          <div className="chat-header">{c.userId.displayName}</div>
          <div className="chat-bubble">{c.commentText}</div>
        </div>
      ))}

      {currentUser && (
        <div className="form-control mt-4">
          <div className="input-group">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add comment..."
              className="input input-bordered w-full"
            />
            <button onClick={addComment} className="btn btn-square">
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentsSection;
