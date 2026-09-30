import { useEffect, useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
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
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  if (!session) return <LoginPage />;

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex min-h-screen bg-[#0f172a] font-sans text-slate-800">
      {/* Dark Sidebar */}
      <aside className="w-64 bg-[#0f172a] text-white flex flex-col pt-6 pb-4 px-4 shrink-0">
        
        {/* Logo Section */}
        <div className="flex items-center gap-3 px-2 mb-10">
          <svg className="w-8 h-8 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v20M17 5l-10 14M21 12H3M19 17L5 7" />
            <circle cx="12" cy="12" r="3" fill="currentColor"/>
          </svg>
          <span className="text-xl font-bold tracking-wide">Kaveri Stock</span>
        </div>
        
        {/* Navigation Menu */}
        <nav className="flex-1 space-y-1">
          <Link to="/" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/') ? 'bg-[#2563eb] text-white' : 'text-slate-300 hover:bg-slate-800'}`}>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
            Dashboard
          </Link>
          <Link to="/products" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/products') ? 'bg-[#2563eb] text-white' : 'text-slate-300 hover:bg-slate-800'}`}>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
            Products
          </Link>
          <Link to="/categories" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/categories') ? 'bg-[#2563eb] text-white' : 'text-slate-300 hover:bg-slate-800'}`}>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
            Categories
          </Link>
          <Link to="/orders" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/orders') ? 'bg-[#2563eb] text-white' : 'text-slate-300 hover:bg-slate-800'}`}>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            Orders
          </Link>
          <Link to="/suppliers" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/suppliers') ? 'bg-[#2563eb] text-white' : 'text-slate-300 hover:bg-slate-800'}`}>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
            Suppliers
          </Link>
          <Link to="/users" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/users') ? 'bg-[#2563eb] text-white' : 'text-slate-300 hover:bg-slate-800'}`}>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Users
          </Link>
        </nav>
        
        {/* Logout Button */}
        <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full p-3 rounded-xl bg-[#c1121f] hover:bg-red-700 transition-colors font-semibold mt-auto">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Logout
        </button>
      </aside>

      {/* Main Content Area with Curved Corner and Background */}
      <main className="flex-1 bg-white rounded-tl-[2.5rem] relative overflow-hidden min-h-screen">
        <div className="absolute inset-0 bg-[url('/kaveri-bg.png')] bg-cover bg-center opacity-[0.15] pointer-events-none"></div>
        <div className="relative z-10 h-full overflow-y-auto p-10">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/suppliers" element={<SuppliersPage />} />
            <Route path="/users" element={<UsersPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
