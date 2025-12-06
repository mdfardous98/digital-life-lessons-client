import { useState } from "react";
import { auth } from "../../lib/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import GoogleLoginBtn from "./GoogleLoginBtn";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validatePassword = (pass) => {
    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasMinLength = pass.length >= 6;
    return { hasUpper, hasLower, hasMinLength };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const validation = validatePassword(password);
    if (!validation.hasUpper)
      return toast.error("Password must contain uppercase letter");
    if (!validation.hasLower)
      return toast.error("Password must contain lowercase letter");
    if (!validation.hasMinLength)
      return toast.error("Password must be at least 6 characters");

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(res.user, { displayName: name });
      toast.success("Account created successfully!");
      navigate("/");
    } catch (err) {
         console.error(err);
      toast.error("Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input
        type="text"
        name="name"
        placeholder="Full Name"
        onChange={handleChange}
        className="input input-bordered w-full"
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
        className="input input-bordered w-full"
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
        className="input input-bordered w-full"
        required
      />
      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        onChange={handleChange}
        className="input input-bordered w-full"
        required
      />
      <button type="submit" className="btn btn-primary w-full">
        Create Account
      </button>
      <div className="divider">OR</div>
      <GoogleLoginBtn />
      <p className="text-center">
        Already have an account?{" "}
        <Link to="/login" className="link link-primary">
          Login
        </Link>
      </p>
    </form>
  );
}
