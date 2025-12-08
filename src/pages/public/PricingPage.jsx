import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

const PricingPage = () => {
  const { currentUser, isPremium } = useAuth();

  const handleUpgrade = async () => {
    try {
      const token = await currentUser.getIdToken();
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/create-checkout-session`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to start payment");
    }
  };

  if (isPremium) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-6 bg-white shadow-lg rounded-xl">
          <h1 className="text-5xl font-bold mb-6 text-purple-600">
            You are already Premium
          </h1>
          <p className="text-2xl">
            Enjoy lifetime access to all premium lessons!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-20 px-6">
      <h1 className="text-5xl font-bold text-center mb-4">Choose Your Plan</h1>
      <p className="text-center text-xl mb-12 opacity-80">
        One-time payment. Lifetime access.
      </p>

      <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
        {/* Free Plan */}
        <div className="card bg-white shadow-xl rounded-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
          <div className="card-body text-center p-8">
            <h2 className="text-3xl font-bold mb-4">Free</h2>
            <p className="text-5xl font-bold my-6">৳0</p>
            <ul className="space-y-3 text-left text-gray-700">
              <li>✓ View all public Free lessons</li>
              <li>✓ Create unlimited private lessons</li>
              <li>✓ Create up to 10 public Free lessons</li>
              <li>✗ Create Premium lessons</li>
              <li>✗ View Premium lessons</li>
              <li>✗ Priority listing</li>
              <li>✗ Ad-free experience</li>
              <li>✗ Analytics dashboard</li>
            </ul>
          </div>
        </div>

        {/* Premium Plan */}
        <div className="card bg-linear-to-br from-purple-600 to-indigo-700 text-white shadow-2xl ring-4 ring-purple-400 rounded-xl">
          <div className="card-body text-center p-8">
            <div className="badge badge-warning badge-lg mb-4">BEST VALUE</div>
            <h2 className="text-4xl font-bold mb-2">Premium</h2>
            <p className="text-6xl font-bold my-6">৳1500</p>
            <p className="opacity-90 mb-6">One-time • Lifetime Access</p>
            <ul className="space-y-3 text-left">
              <li>✓ Everything in Free</li>
              <li>✓ Create unlimited Premium lessons</li>
              <li>✓ View all Premium lessons</li>
              <li>✓ Priority in public feed</li>
              <li>✓ No ads</li>
              <li>✓ Advanced analytics</li>
              <li>✓ Early access to new features</li>
              <li>✓ Lifetime support</li>
            </ul>
            <button
              onClick={handleUpgrade}
              className="btn btn-warning btn-lg mt-8 w-full text-black font-bold"
            >
              Upgrade to Premium
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
