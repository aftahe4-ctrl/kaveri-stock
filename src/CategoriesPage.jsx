import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const { data, error } = await supabase.from('categories').select('*');
      if (error) setErrorMessage(error.message);
      else if (data) setCategories(data);
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
        .from('categories')
        .update({ name, description })
        .eq('id', editingId);

      if (error) setErrorMessage(error.message);
      else {
        setCategories(categories.map(c => c.id === editingId ? { ...c, name, description } : c));
        resetForm();
      }
    } else {
      const { data, error } = await supabase
        .from('categories')
        .insert([{ name, description }])
        .select();

      if (error) setErrorMessage(error.message);
      else if (data) {
        setCategories([data[0], ...categories]);
        resetForm();
      }
    }
    setIsSubmitting(false);
  }

  function handleEdit(category) {
    setEditingId(category.id);
    setName(category.name);
    setDescription(category.description || "");
  }

  async function handleDelete(id) {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) setErrorMessage(error.message);
    else setCategories(categories.filter(c => c.id !== id));
  }

  function resetForm() {
    setEditingId(null);
    setName("");
    setDescription("");
  }

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <main className="flex-1 p-8">
      <h1 className="text-3xl font-bold mb-8">Categories Management</h1>
      
      <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100 mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">{editingId ? "Edit Category" : "Add New Category"}</h3>
        <form onSubmit={handleSubmit} className="flex gap-4 items-center">
          <input 
            type="text" 
            placeholder="Category Name" 
            required 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="w-64 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4b8df8]"
          />
          <input 
            type="text" 
            placeholder="Description (Optional)" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4b8df8]"
          />
          <button type="submit" disabled={isSubmitting} className="bg-[#2ecc71] text-white px-6 py-2 rounded font-semibold hover:bg-green-600 disabled:opacity-50 transition-colors">
            {isSubmitting ? "Saving..." : editingId ? "Update" : "Add Category"}
          </button>
          {editingId && <button type="button" onClick={resetForm} className="bg-gray-400 text-white px-4 py-2 rounded font-semibold hover:bg-gray-500 transition-colors">Cancel</button>}
        </form>
      </div>

      <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100 mb-6">
        <input 
          type="text" 
          placeholder="Search categories..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4b8df8]"
        />
      </div>

      <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Product Categories</h3>
        <div className="space-y-3">
          {errorMessage && <div className="p-4 bg-red-100 text-red-700 border border-red-400 rounded"><strong>Error:</strong> {errorMessage}</div>}
          
          {filteredCategories.map((category) => (
            <div key={category.id} className="p-4 border rounded bg-gray-50 flex justify-between items-center">
              <div>
                <p className="font-bold text-lg text-gray-800">{category.name}</p>
                <p className="text-sm text-gray-600 mt-0.5">{category.description || "No description provided."}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(category)} className="bg-blue-500 text-white px-3 py-1.5 rounded text-sm font-semibold hover:bg-blue-600 transition-colors">Edit</button>
                <button onClick={() => handleDelete(category.id)} className="bg-red-500 text-white px-3 py-1.5 rounded text-sm font-semibold hover:bg-red-600 transition-colors">Delete</button>
              </div>
            </div>
          ))}
          
          {filteredCategories.length === 0 && !errorMessage && <p className="text-gray-500">No categories found.</p>}
        </div>
      </div>
    </main>
  );
}