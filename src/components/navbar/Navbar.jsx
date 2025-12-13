import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, X, LogOut, Home, Shield } from "lucide-react";
import { logout } from "../../features/auth/authSlice";
import { toast } from "sonner";

const Navbar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const accessToken = useSelector((state) => state.auth.accessToken);
  const cartCount = useSelector((state) => state.cart.items.length);

  const adminMode = location.pathname.startsWith("/admin");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Scroll effekti - navbar scroll qilganda ko'rinish o'zgaradi
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Menu ochilganda body scroll ni to'xtatish
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Successfully logged out')
    setMenuOpen(false);
  };

  if (adminMode) return null;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg"
            : "bg-white shadow-md"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <NavLink
              to="/"
              className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
            >
              <span className="text-3xl">🛍️</span>
              Akki Store
            </NavLink>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-2">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                  }`
                }
              >
                <Home size={18} />
                <span>Home</span>
              </NavLink>

              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                  }`
                }
              >
                <Shield size={18} />
                <span>Admin</span>
              </NavLink>

              <NavLink
                to="/cart"
                className={({ isActive }) =>
                  `relative flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                  }`
                }
              >
                <ShoppingCart size={18} />
                <span>Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 shadow-lg animate-pulse">
                    {cartCount}
                  </span>
                )}
              </NavLink>

              {accessToken && (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-md hover:shadow-lg ml-2"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              )}
            </div>

            {/* Mobile: Cart va Menu */}
            <div className="md:hidden flex items-center gap-3">
              <NavLink
                to="/cart"
                className="relative p-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
              >
                <ShoppingCart size={22} className="text-gray-700" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-lg">
                    {cartCount}
                  </span>
                )}
              </NavLink>

              <button
                onClick={toggleMenu}
                className="p-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
                aria-label="Toggle menu"
              >
                {menuOpen ? (
                  <X size={24} className="text-gray-700" />
                ) : (
                  <Menu size={24} className="text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay - orqa fon */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300"
          onClick={toggleMenu}
        />
      )}

      {/* Mobile Menu Slide - o'ngdan chiquvchi menyu */}
      <div
        className={`fixed top-16 right-0 h-[calc(100vh-4rem)] w-64 bg-white shadow-2xl z-40 md:hidden transform transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-2 p-4">
          <NavLink
            to="/"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`
            }
          >
            <Home size={20} />
            <span>Home</span>
          </NavLink>

          <NavLink
            to="/admin"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`
            }
          >
            <Shield size={20} />
            <span>Admin</span>
          </NavLink>

          {accessToken && (
            <>
              <div className="my-2 border-t border-gray-200"></div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-md"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;