import LoginForm from "../../components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-2xl">
        <div className="card-body">
          <h2 className="card-title text-3xl justify-center mb-6">Login</h2>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
