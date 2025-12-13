import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { logout } from "../../features/auth/authSlice";
import { UserIcon } from "../../assets";
import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";
import { toast } from "sonner";

const AdminNavbar = () => {
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.auth.accessToken);

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await api.get("/auth/profile");
      return res.data;
    },
  });
  console.log(user);

  return (
    <nav className="w-full bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-full flex items-center gap-6 px-6 py-3">
        {/* Home */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `text-sm font-medium transition ${
              isActive
                ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                : "text-gray-700 hover:text-blue-600"
            }`
          }
        >
          Home
        </NavLink>

        {/* Admin */}
        <NavLink
          to="/admin"
          className={({ isActive }) =>
            `text-sm font-medium transition ${
              isActive
                ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                : "text-gray-700 hover:text-blue-600"
            }`
          }
        >
          Admin
        </NavLink>

        {/* Logout button */}
        {accessToken && (
          <button
            onClick={() => {
              dispatch(logout()), toast.success("Successfully logged out");
            }}
            className="ml-auto px-4 py-1.5 text-sm rounded-md bg-red-500 text-white hover:bg-red-600 transition"
          >
            Logout
          </button>
        )}

        <Link to={`profile/${user?._id}`}>
          <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-gray-200 shadow-md">
            <img
              className="w-full h-full object-cover"
              src={user?.avatar}
              alt="avatar"
            />
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default AdminNavbar;
