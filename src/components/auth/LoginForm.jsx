import { useState } from "react";
import { auth } from "../../lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import GoogleLoginBtn from "./GoogleLoginBtn";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Welcome back!");
      navigate("/");
    } catch (err) {
         console.error(err);
      toast.error("Invalid email or password");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input input-bordered w-full"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input input-bordered w-full"
        required
      />
      <button type="submit" className="btn btn-primary w-full">
        Login
      </button>
      <div className="divider">OR</div>
      <GoogleLoginBtn />
      <p className="text-center">
        Don't have an account?{" "}
        <Link to="/register" className="link link-primary">
          Register
        </Link>
      </p>
    </form>
  );
}
