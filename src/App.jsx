import { useTheme } from "./contexts/ThemeContext";

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-base-200">
      <div className="navbar bg-base-100 shadow-lg fixed top-0 z-50">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-primary">Digital Life Lessons</h1>
        </div>
        <button
          onClick={toggleTheme}
          className="btn btn-ghost btn-circle"
        >
          {theme === "dark" ? "Sun" : "Moon"}
        </button>
      </div>

      <div className="pt-20 text-center">
        <h2 className="text-4xl font-bold mt-20">
          Welcome to Digital Life Lessons
        </h2>
        <p className="mt-4 text-lg">Firebase + Theme ready!</p>
      </div>
    </div>
  );
}

export default App;
