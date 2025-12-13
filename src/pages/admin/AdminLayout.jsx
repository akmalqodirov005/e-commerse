import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { Menu } from "lucide-react";
import AdminNavbar from "./AdminNavbar";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      <AdminNavbar/>
      {/* Mobile Navbar */}
      <header className="md:hidden flex-shrink-0 flex items-center gap-3 px-4 py-3 bg-white border-b shadow-sm">
        <button
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors active:scale-95"
          onClick={() => setIsSidebarOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <h1 className="text-xl font-semibold text-gray-900">Admin Panel</h1>
      </header>

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;