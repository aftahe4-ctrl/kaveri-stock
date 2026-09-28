import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export default function DashboardPage() {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalStock, setTotalStock] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  async function fetchDashboardStats() {
    // 1. Fetch Products for Total Count and Total Stock
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('stock');
      
    if (!productsError && products) {
      setTotalProducts(products.length);
      const stockCount = products.reduce((sum, item) => sum + (item.stock || 0), 0);
      setTotalStock(stockCount);
    }

    // 2. Fetch Orders for Total Orders and Revenue (Completed orders only)
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('total_amount, status');

    if (!ordersError && orders) {
      setTotalOrders(orders.length);
      const revenue = orders
        .filter(order => order.status === 'Completed')
        .reduce((sum, order) => sum + (order.total_amount || 0), 0);
      setTotalRevenue(revenue);
    }
  }

  return (
    <main className="flex-1 p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Total Products Card */}
        <div className="bg-[#4b8df8] text-white rounded-md p-6 shadow-sm flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold mb-2">Total Products</h3>
          <p className="text-4xl font-bold">{totalProducts}</p>
        </div>

        {/* Total Stock Card */}
        <div className="bg-[#2ecc71] text-white rounded-md p-6 shadow-sm flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold mb-2">Total Stock</h3>
          <p className="text-4xl font-bold">{totalStock}</p>
        </div>

        {/* Total Orders Card */}
        <div className="bg-[#f1c40f] text-white rounded-md p-6 shadow-sm flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold mb-2">Total Orders</h3>
          <p className="text-4xl font-bold">{totalOrders}</p>
        </div>

        {/* Revenue Card */}
        <div className="bg-[#9b59b6] text-white rounded-md p-6 shadow-sm flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold mb-2">Revenue</h3>
          <p className="text-4xl font-bold">${totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Quick Actions</h3>
        <p className="text-gray-600 mb-4">Use the sidebar navigation to manage your inventory, process orders, and update supplier details.</p>
        <div className="flex gap-4">
          <a href="/products" className="bg-[#4b8df8] text-white px-6 py-2 rounded font-semibold hover:bg-blue-600 transition-colors">
            Go to Products
          </a>
          <a href="/orders" className="bg-[#f1c40f] text-white px-6 py-2 rounded font-semibold hover:bg-yellow-500 transition-colors">
            Manage Orders
          </a>
        </div>
      </div>
    </main>
  );
}