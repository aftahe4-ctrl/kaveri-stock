import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const { data, error } = await supabase.from('products').select('*');
      if (error) {
        setErrorMessage(error.message);
      } else if (data) {
        setProducts(data);
      }
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
        .from('products')
        .update({ name, category, price: parseFloat(price), stock: parseInt(stock) })
        .eq('id', editingId);

      if (error) {
        setErrorMessage(error.message);
      } else {
        setProducts(products.map(p => p.id === editingId ? { ...p, name, category, price: parseFloat(price), stock: parseInt(stock) } : p));
        resetForm();
      }
    } else {
      const { data, error } = await supabase
        .from('products')
        .insert([{ name, category, price: parseFloat(price), stock: parseInt(stock) }])
        .select();

      if (error) {
        setErrorMessage(error.message);
      } else if (data) {
        setProducts([data[0], ...products]);
        resetForm();
      }
    }
    setIsSubmitting(false);
  }

  function handleEdit(product) {
    setEditingId(product.id);
    setName(product?.name || "");
    setCategory(product?.category || "");
    setPrice(product?.price || "");
    setStock(product?.stock || "");
  }

  // FIXED: Removed the window.confirm popup for instant deletion
  async function handleDelete(id) {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      setErrorMessage(error.message);
    } else {
      setProducts(products.filter(p => p.id !== id));
    }
  }

  function resetForm() {
    setEditingId(null);
    setName("");
    setCategory("");
    setPrice("");
    setStock("");
  }

  const filteredProducts = products.filter(product =>
    product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product?.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="flex-1 p-8">
      <h1 className="text-3xl font-bold mb-8">Products Management</h1>
      
      <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100 mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">
          {editingId ? "Edit Product" : "Add New Product"}
        </h3>
        <form onSubmit={handleSubmit} className="flex gap-4 items-center">
          <input 
            type="text" 
            placeholder="Product Name" 
            required 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4b8df8]"
          />
          <input 
            type="text" 
            placeholder="Category" 
            required 
            value={category} 
            onChange={(e) => setCategory(e.target.value)} 
            className="w-40 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4b8df8]"
          />
          <input 
            type="number" 
            placeholder="Price ($)" 
            required 
            min="0" 
            step="0.01" 
            value={price} 
            onChange={(e) => setPrice(e.target.value)} 
            className="w-32 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4b8df8]"
          />
          <input 
            type="number" 
            placeholder="Stock" 
            required 
            min="0" 
            value={stock} 
            onChange={(e) => setStock(e.target.value)} 
            className="w-28 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4b8df8]"
          />
          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="bg-[#2ecc71] text-white px-6 py-2 rounded font-semibold hover:bg-green-600 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? "Saving..." : editingId ? "Update" : "Add Product"}
          </button>
          {editingId && (
            <button 
              type="button" 
              onClick={resetForm}
              className="bg-gray-400 text-white px-4 py-2 rounded font-semibold hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100 mb-6">
        <input 
          type="text" 
          placeholder="Search products by name or category..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4b8df8]"
        />
      </div>

      <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">All Registered Products</h3>
        <div className="space-y-3">
          {errorMessage && (
            <div className="p-4 bg-red-100 text-red-700 border border-red-400 rounded">
              <strong>Error:</strong> {errorMessage}
            </div>
          )}

          {filteredProducts.map((product) => (
            <div key={product.id} className="p-4 border rounded bg-gray-50 flex justify-between items-center">
              <div>
                <p className="font-bold text-lg text-gray-800">{product?.name}</p>
                <p className="text-sm text-gray-600 mt-0.5">Category: {product?.category || "Uncategorized"}</p>
                <p className="text-xs text-gray-500 mt-1">Stock: <span className="font-semibold text-blue-600">{product?.stock}</span></p>
              </div>
              <div className="flex items-center gap-4">
                <p className="font-bold text-[#2ecc71] text-lg">${product?.price}</p>
                <button 
                  onClick={() => handleEdit(product)}
                  className="bg-blue-500 text-white px-3 py-1.5 rounded text-sm font-semibold hover:bg-blue-600 transition-colors"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(product.id)}
                  className="bg-red-500 text-white px-3 py-1.5 rounded text-sm font-semibold hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {filteredProducts.length === 0 && !errorMessage && (
            <p className="text-gray-500">No products found.</p>
          )}
        </div>
      </div>
    </main>
  );
}
