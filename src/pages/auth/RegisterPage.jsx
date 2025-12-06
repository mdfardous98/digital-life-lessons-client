import RegisterForm from "../../components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-2xl">
        <div className="card-body">
          <h2 className="card-title text-3xl justify-center mb-6">Register</h2>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
