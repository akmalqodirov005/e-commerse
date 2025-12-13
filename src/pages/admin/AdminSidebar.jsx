import React, { useEffect, useCallback } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { LayoutGrid, Tag, MapPin, Users, X, Home } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authSlice";

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accessToken = useSelector((state) => state.auth.accessToken);

  const navItems = [
    { path: "/admin/products", label: "Products", icon: <LayoutGrid size={18} /> },
    { path: "/admin/categories", label: "Categories", icon: <Tag size={18} /> },
    { path: "/admin/locations", label: "Locations", icon: <MapPin size={18} /> },
    { path: "/admin/users", label: "Users", icon: <Users size={18} /> },
  ];

  const closeSidebar = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  // Route o'zgarganda mobile da yopish
  useEffect(() => {
    if (window.innerWidth < 768) {
      closeSidebar();
    }
  }, [location.pathname, closeSidebar]);

  // Escape tugmasi
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        closeSidebar();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, closeSidebar]);

  // Body scroll
  useEffect(() => {
    if (isOpen && window.innerWidth < 768) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Logout function
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    closeSidebar();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30 transition-opacity duration-300"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed md:static top-0 left-0 h-full bg-white border-r border-gray-200
        flex flex-col z-40 w-64
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
        aria-label="Admin sidebar"
      >
        <div className="p-6 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 md:mb-8 flex-shrink-0">
            <h2 className="text-2xl font-semibold text-gray-900">
              Admin Panel
            </h2>
            <button
              onClick={closeSidebar}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors active:scale-95"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-1 flex-1 overflow-y-auto">
            {/* Admin Links */}
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium 
                    transition-all flex-shrink-0
                    ${isActive
                      ? "bg-black text-white shadow-sm"
                      : "text-gray-700 hover:bg-gray-100 active:bg-gray-200"
                    }
                  `}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;