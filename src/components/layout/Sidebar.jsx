import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const userMenu = [
  { name: "Dashboard", path: "/dashboard", icon: "Home" },
  { name: "Add Lesson", path: "/dashboard/add-lesson", icon: "Plus" },
  { name: "My Lessons", path: "/dashboard/my-lessons", icon: "Book" },
  { name: "Favorites", path: "/dashboard/my-favorites", icon: "Heart" },
  { name: "Profile", path: "/dashboard/profile", icon: "User" },
];

const adminMenu = [
  { name: "Admin Dashboard", path: "/dashboard/admin", icon: "Layout" },
  {
    name: "Manage Users",
    path: "/dashboard/admin/manage-users",
    icon: "Users",
  },
  {
    name: "Manage Lessons",
    path: "/dashboard/admin/manage-lessons",
    icon: "FileText",
  },
  {
    name: "Reported Lessons",
    path: "/dashboard/admin/reported-lessons",
    icon: "Alert",
  },
  { name: "Admin Profile", path: "/dashboard/admin/profile", icon: "Settings" },
];

export default function Sidebar() {
  const { userRole } = useAuth();
  const location = useLocation();
  const isAdmin = userRole === "admin";
  const menu = isAdmin ? adminMenu : userMenu;

  return (
    <div className="bg-base-100 h-screen w-64 fixed left-0 top-16 pt-8 shadow-xl z-40">
      <ul className="menu p-4">
        {menu.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`flex items-center gap-3 text-lg font-medium ${
                location.pathname === item.path
                  ? "bg-primary text-white"
                  : "hover:bg-base-200"
              } rounded-lg`}
            >
              <span>{item.icon}</span>
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
