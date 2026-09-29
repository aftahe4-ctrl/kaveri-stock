import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [status, setStatus] = useState("Pending");
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const { data, error } = await supabase.from('orders').select('*');
      if (error) setErrorMessage(error.message);
      else if (data) setOrders(data);
    } catch (err) {
      setErrorMessage(err.message);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    if (editingId) {
      const { error } = await supabase
        .from('orders')
        .update({ customer_name: customerName, customer_phone: customerPhone, total_amount: parseFloat(totalAmount), status })
        .eq('id', editingId);

      if (error) setErrorMessage(error.message);
      else {
        setOrders(orders.map(o => o.id === editingId ? { ...o, customer_name: customerName, customer_phone: customerPhone, total_amount: parseFloat(totalAmount), status } : o));
        resetForm();
      }
    } else {
      const { data, error } = await supabase
        .from('orders')
        .insert([{ customer_name: customerName, customer_phone: customerPhone, total_amount: parseFloat(totalAmount), status }])
        .select();

      if (error) setErrorMessage(error.message);
      else if (data) {
        setOrders([data[0], ...orders]);
        resetForm();
      }
    }
    setIsSubmitting(false);
  }

  function handleEdit(order) {
    setEditingId(order.id);
    setCustomerName(order.customer_name);
    setCustomerPhone(order.customer_phone);
    setTotalAmount(order.total_amount);
    setStatus(order.status || "Pending");
  }

  async function handleDelete(id) {
    const { error } = await supabase.from('orders').delete().eq('id', id);
    if (error) setErrorMessage(error.message);
    else setOrders(orders.filter(o => o.id !== id));
  }

  function resetForm() {
    setEditingId(null);
    setCustomerName("");
    setCustomerPhone("");
    setTotalAmount("");
    setStatus("Pending");
  }

  const filteredOrders = orders.filter(order =>
    order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer_phone.includes(searchTerm)
  );

  return (
    <main className="flex-1 p-8">
      <h1 className="text-3xl font-bold mb-8">Orders Management</h1>
      
      <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100 mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">{editingId ? "Edit Order" : "Add New Order"}</h3>
        <form onSubmit={handleSubmit} className="flex gap-4 items-center">
          <input type="text" placeholder="Customer Name" required value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4b8df8]"/>
          <input type="text" placeholder="Phone Number" required value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="w-44 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4b8df8]"/>
          <input type="number" placeholder="Amount (BDT)" required min="0" step="0.01" value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} className="w-32 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4b8df8]"/>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-36 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4b8df8]">
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <button type="submit" disabled={isSubmitting} className="bg-[#2ecc71] text-white px-6 py-2 rounded font-semibold hover:bg-green-600 disabled:opacity-50 transition-colors">
            {isSubmitting ? "Saving..." : editingId ? "Update" : "Add Order"}
          </button>
          {editingId && <button type="button" onClick={resetForm} className="bg-gray-400 text-white px-4 py-2 rounded font-semibold hover:bg-gray-500 transition-colors">Cancel</button>}
        </form>
      </div>

      <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100 mb-6">
        <input type="text" placeholder="Search orders by customer name or phone..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4b8df8]"/>
      </div>

      <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Customer Orders</h3>
        <div className="space-y-3">
          {errorMessage && <div className="p-4 bg-red-100 text-red-700 border border-red-400 rounded"><strong>Error:</strong> {errorMessage}</div>}
          {filteredOrders.map((order) => (
            <div key={order.id} className="p-4 border rounded bg-gray-50 flex justify-between items-center">
              <div>
                <p className="font-bold text-lg text-gray-800">{order.customer_name}</p>
                <p className="text-sm text-gray-600 mt-0.5">Phone: {order.customer_phone}</p>
                <p className="text-xs text-blue-600 font-semibold mt-1">Status: {order.status}</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="font-bold text-[#2ecc71] text-lg">৳ {order.total_amount}</p>
                <button onClick={() => handleEdit(order)} className="bg-blue-500 text-white px-3 py-1.5 rounded text-sm font-semibold hover:bg-blue-600 transition-colors">Edit</button>
                <button onClick={() => handleDelete(order.id)} className="bg-red-500 text-white px-3 py-1.5 rounded text-sm font-semibold hover:bg-red-600 transition-colors">Delete</button>
              </div>
            </div>
          ))}
          {filteredOrders.length === 0 && !errorMessage && <p className="text-gray-500">No orders found.</p>}
        </div>
      </div>
    </main>
  );
}
