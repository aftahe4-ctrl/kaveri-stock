import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  async function fetchSuppliers() {
    try {
      const { data, error } = await supabase.from('suppliers').select('*');
      if (error) setErrorMessage(error.message);
      else if (data) setSuppliers(data);
    } catch (err) {
      setErrorMessage(err.message);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    if (editingId) {
      const { error } = await supabase.from('suppliers').update({ company_name: companyName, address, phone }).eq('id', editingId);
      if (error) setErrorMessage(error.message);
      else {
        setSuppliers(suppliers.map(s => s.id === editingId ? { ...s, company_name: companyName, address, phone } : s));
        resetForm();
      }
    } else {
      const { data, error } = await supabase.from('suppliers').insert([{ company_name: companyName, address, phone }]).select();
      if (error) setErrorMessage(error.message);
      else if (data) {
        setSuppliers([data[0], ...suppliers]);
        resetForm();
      }
    }
    setIsSubmitting(false);
  }

  function handleEdit(supplier) {
    setEditingId(supplier.id);
    setCompanyName(supplier.company_name);
    setAddress(supplier.address);
    setPhone(supplier.phone);
  }

  async function handleDelete(id) {
    const { error } = await supabase.from('suppliers').delete().eq('id', id);
    if (error) setErrorMessage(error.message);
    else setSuppliers(suppliers.filter(s => s.id !== id));
  }

  function resetForm() {
    setEditingId(null);
    setCompanyName("");
    setAddress("");
    setPhone("");
  }

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.phone.includes(searchTerm)
  );

  return (
    <main className="flex-1 p-8">
      <h1 className="text-3xl font-bold mb-8">Suppliers Management</h1>
      
      <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100 mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">{editingId ? "Edit Supplier" : "Add New Supplier"}</h3>
        <form onSubmit={handleSubmit} className="flex gap-4 items-center">
          <input type="text" placeholder="Company Name" required value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4b8df8]"/>
          <input type="text" placeholder="Address" required value={address} onChange={(e) => setAddress(e.target.value)} className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4b8df8]"/>
          <input type="text" placeholder="Phone Number" required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-48 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4b8df8]"/>
          <button type="submit" disabled={isSubmitting} className="bg-[#2ecc71] text-white px-6 py-2 rounded font-semibold hover:bg-green-600 disabled:opacity-50 transition-colors">
            {isSubmitting ? "Saving..." : editingId ? "Update" : "Add Supplier"}
          </button>
          {editingId && <button type="button" onClick={resetForm} className="bg-gray-400 text-white px-4 py-2 rounded font-semibold hover:bg-gray-500 transition-colors">Cancel</button>}
        </form>
      </div>

      <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100 mb-6">
        <input type="text" placeholder="Search suppliers by company name or phone..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4b8df8]"/>
      </div>

      <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Registered Suppliers</h3>
        <div className="space-y-3">
          {errorMessage && <div className="p-4 bg-red-100 text-red-700 border border-red-400 rounded"><strong>Error:</strong> {errorMessage}</div>}
          {filteredSuppliers.map((supplier) => (
            <div key={supplier.id} className="p-4 border rounded bg-gray-50 flex justify-between items-center">
              <div>
                <p className="font-bold text-lg text-gray-800">{supplier.company_name}</p>
                <p className="text-sm text-gray-600 mt-0.5">Address: {supplier.address}</p>
                <p className="font-bold text-gray-600 text-sm mt-1">Phone: {supplier.phone}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(supplier)} className="bg-blue-500 text-white px-3 py-1.5 rounded text-sm font-semibold hover:bg-blue-600 transition-colors">Edit</button>
                <button onClick={() => handleDelete(supplier.id)} className="bg-red-500 text-white px-3 py-1.5 rounded text-sm font-semibold hover:bg-red-600 transition-colors">Delete</button>
              </div>
            </div>
          ))}
          {filteredSuppliers.length === 0 && !errorMessage && <p className="text-gray-500">No suppliers found.</p>}
        </div>
      </div>
    </main>
  );
}