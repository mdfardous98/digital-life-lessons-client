import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../lib/firebase";
import Lottie from "lottie-react";
import successAnimation from "../../assets/lottie/success.json";

const categories = [
  "Personal Growth",
  "Career",
  "Relationships",
  "Mindset",
  "Mistakes Learned",
];
const tones = ["Motivational", "Sad", "Realization", "Gratitude"];

export default function LessonForm({ onSuccess }) {
  const { currentUser, isPremium } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    emotionalTone: "",
    visibility: "private",
    accessLevel: "free",
    image: null,
  });

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category || !formData.emotionalTone) {
      toast.error("Please fill all fields");
      return;
    }

    if (formData.accessLevel === "premium" && !isPremium) {
      toast.error("Upgrade to Premium to create premium lessons");
      return;
    }

    setLoading(true);
    let imageUrl = null;

    try {
      // Upload image if exists
      if (formData.image) {
        const imageRef = ref(
          storage,
          `lessons/${Date.now()}_${formData.image.name}`
        );
        await uploadBytes(imageRef, formData.image);
        imageUrl = await getDownloadURL(imageRef);
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/lessons`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await currentUser.getIdToken()}`,
        },
        body: JSON.stringify({
          ...formData,
          image: imageUrl,
        }),
      });

      if (!res.ok) throw new Error("Failed");

      toast.success("Lesson created successfully!");
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onSuccess?.();
      }, 3000);
      setFormData({
        title: "",
        description: "",
        category: "",
        emotionalTone: "",
        visibility: "private",
        accessLevel: "free",
        image: null,
      });
    } catch (err) {
      console.error("Create lesson error:", err);
      toast.error("Failed to create lesson");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <Lottie animationData={successAnimation} className="w-96" />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          placeholder="Lesson Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="input input-bordered w-full"
          required
        />
        <textarea
          placeholder="Share your life lesson..."
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="textarea textarea-bordered w-full h-40"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="select select-bordered"
            required
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <select
            value={formData.emotionalTone}
            onChange={(e) =>
              setFormData({ ...formData, emotionalTone: e.target.value })
            }
            className="select select-bordered"
            required
          >
            <option value="">Emotional Tone</option>
            {tones.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="file-input file-input-bordered w-full"
        />

        <div className="grid grid-cols-2 gap-4">
          <select
            value={formData.visibility}
            onChange={(e) =>
              setFormData({ ...formData, visibility: e.target.value })
            }
            className="select select-bordered"
          >
            <option value="private">Private</option>
            <option value="public">Public</option>
          </select>

          <div className="relative">
            <select
              value={formData.accessLevel}
              onChange={(e) =>
                setFormData({ ...formData, accessLevel: e.target.value })
              }
              className="select select-bordered w-full"
              disabled={!isPremium && formData.accessLevel === "premium"}
            >
              <option value="free">Free</option>
              <option value="premium">Premium</option>
            </select>
            {!isPremium && (
              <div
                className="tooltip tooltip-right absolute right-2 top-3"
                data-tip="Upgrade to Premium"
              >
                Lock
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? "Creating..." : "Create Lesson"}
        </button>
      </form>
    </>
  );
}
