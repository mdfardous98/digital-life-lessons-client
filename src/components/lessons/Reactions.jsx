import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

const Reactions = ({ lessonId, initialLikes, initialLiked }) => {
  const { currentUser } = useAuth();
  const [liked, setLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialLikes);

  const handleLike = async () => {
    if (!currentUser) return toast.error("Login required");
    const token = await currentUser.getIdToken();
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/lessons/${lessonId}/like`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();
    setLiked(data.liked);
    setLikesCount(data.likesCount);
  };

  return (
    <button onClick={handleLike} className="btn btn-ghost">
      {liked ? "Liked" : "Like"} ({likesCount})
    </button>
  );
};
export default Reactions;
