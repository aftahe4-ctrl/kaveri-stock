import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { supabase } from "./supabase";
import LoginPage from "./LoginPage";
import DashboardPage from "./DashboardPage";
import ProductsPage from "./ProductsPage";
import CategoriesPage from "./CategoriesPage";
import OrdersPage from "./OrdersPage";
import SuppliersPage from "./SuppliersPage";
import UsersPage from "./UsersPage";

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Get current session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for login/logout events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  // If not logged in, only show the login page
  if (!session) {
    return <LoginPage />;
  }

  // If logged in, show the full dashboard structure
  return (
    <Router>
      <div className="flex min-h-screen bg-[#f8f9fa]">
        {/* Sidebar */}
        <aside className="w-64 bg-[#1e293b] text-white flex flex-col">
          <div className="p-6 text-2xl font-bold border-b border-gray-700">
            Kaveri Stock
          </div>
          <nav className="flex-1 p-4 space-y-2">
            <Link to="/" className="block p-3 rounded hover:bg-gray-700">Dashboard</Link>
            <Link to="/products" className="block p-3 rounded hover:bg-gray-700">Products</Link>
            <Link to="/categories" className="block p-3 rounded hover:bg-gray-700">Categories</Link>
            <Link to="/orders" className="block p-3 rounded hover:bg-gray-700">Orders</Link>
            <Link to="/suppliers" className="block p-3 rounded hover:bg-gray-700">Suppliers</Link>
            <Link to="/users" className="block p-3 rounded hover:bg-gray-700">Users</Link>
          </nav>
          <div className="p-4 border-t border-gray-700">
            <button 
              onClick={handleLogout}
              className="w-full text-left p-3 rounded hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/suppliers" element={<SuppliersPage />} />
          <Route path="/users" element={<UsersPage />} />
        </Routes>
      </div>
    </Router>
  );
}