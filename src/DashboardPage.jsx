import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalStock, setTotalStock] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  async function fetchDashboardStats() {
    const { data: products, error: productsError } = await supabase.from('products').select('stock');
    if (!productsError && products) {
      setTotalProducts(products.length);
      const stockCount = products.reduce((sum, item) => sum + (item.stock || 0), 0);
      setTotalStock(stockCount);
    }

    const { data: orders, error: ordersError } = await supabase.from('orders').select('total_amount, status');
    if (!ordersError && orders) {
      setTotalOrders(orders.length);
      const revenue = orders
        .filter(order => order.status === 'Completed')
        .reduce((sum, order) => sum + (order.total_amount || 0), 0);
      setTotalRevenue(revenue);
    }
  }

  return (
    <div className="max-w-6xl">
      <h1 className="text-3xl font-extrabold text-slate-800 mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        
        {/* Products Card - Blue */}
        <div className="bg-gradient-to-br from-[#3b82f6] to-[#2563eb] text-white rounded-2xl p-6 shadow-lg shadow-blue-500/30">
          <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
          </div>
          <h3 className="text-blue-100 font-medium mb-1">Total Products</h3>
          <p className="text-4xl font-bold">{totalProducts}</p>
        </div>

        {/* Stock Card - Green */}
        <div className="bg-gradient-to-br from-[#2ecc71] to-[#27ae60] text-white rounded-2xl p-6 shadow-lg shadow-green-500/30">
          <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <svg className="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
          </div>
          <h3 className="text-green-100 font-medium mb-1">Total Stock</h3>
          <p className="text-4xl font-bold">{totalStock}</p>
        </div>

        {/* Orders Card - Yellow */}
        <div className="bg-gradient-to-br from-[#facc15] to-[#eab308] text-white rounded-2xl p-6 shadow-lg shadow-yellow-500/30">
          <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <svg className="w-6 h-6 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          </div>
          <h3 className="text-yellow-100 font-medium mb-1">Total Orders</h3>
          <p className="text-4xl font-bold">{totalOrders}</p>
        </div>

        {/* Revenue Card - Purple */}
        <div className="bg-gradient-to-br from-[#a855f7] to-[#9333ea] text-white rounded-2xl p-6 shadow-lg shadow-purple-500/30">
          <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <svg className="w-6 h-6 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
          </div>
          <h3 className="text-purple-100 font-medium mb-1">Revenue</h3>
          <p className="text-4xl font-bold">৳ {totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Upgraded Quick Actions Panel */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 relative z-20">
        <h3 className="text-xl font-bold mb-3 text-slate-800">Quick Actions</h3>
        <p className="text-slate-500 mb-6 font-medium">Use the buttons below to instantly navigate to key management areas of your Kaveri Stock system.</p>
        <div className="flex flex-wrap gap-4">
          <Link to="/products" className="flex items-center gap-2 bg-[#2563eb] text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
            Manage Products
          </Link>
          <Link to="/orders" className="flex items-center gap-2 bg-[#eab308] text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors shadow-md shadow-yellow-500/20">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            Process Orders
          </Link>
          <Link to="/categories" className="flex items-center gap-2 bg-[#10b981] text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-600 transition-colors shadow-md shadow-emerald-500/20">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
            Edit Categories
          </Link>
        </div>
      </div>
    </div>
  );
}
