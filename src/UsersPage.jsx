import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("Staff");
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const { data, error } = await supabase.from('users').select('*');
      if (error) setErrorMessage(error.message);
      else if (data) setUsers(data);
    } catch (err) {
      setErrorMessage(err.message);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    if (editingId) {
      const { error } = await supabase.from('users').update({ name, email: email || null, phone: phone || null, role }).eq('id', editingId);
      if (error) setErrorMessage(error.message);
      else {
        setUsers(users.map(u => u.id === editingId ? { ...u, name, email: email || null, phone: phone || null, role } : u));
        resetForm();
      }
    } else {
      const { data, error } = await supabase.from('users').insert([{ name, email: email || null, phone: phone || null, role }]).select();
      if (error) setErrorMessage(error.message);
      else if (data) {
        setUsers([data[0], ...users]);
        resetForm();
      }
    }
    setIsSubmitting(false);
  }

  function handleEdit(user) {
    setEditingId(user.id);
    setName(user.name);
    setEmail(user.email || "");
    setPhone(user.phone || "");
    setRole(user.role || "Staff");
  }

  async function handleDelete(id) {
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) setErrorMessage(error.message);
    else setUsers(users.filter(u => u.id !== id));
  }

  function resetForm() {
    setEditingId(null);
    setName("");
    setEmail("");
    setPhone("");
    setRole("Staff");
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.phone && user.phone.includes(searchTerm))
  );

  return (
    <main className="flex-1 p-8">
      <h1 className="text-3xl font-bold mb-8">Users Management</h1>
      
      <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100 mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">{editingId ? "Edit User" : "Add New User"}</h3>
        <form onSubmit={handleSubmit} className="flex gap-4 items-center">
          <input type="text" placeholder="Full Name" required value={name} onChange={(e) => setName(e.target.value)} className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4b8df8]"/>
          <input type="email" placeholder="Email Address (Optional)" value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4b8df8]"/>
          <input type="text" placeholder="Phone Number (Optional)" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-44 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4b8df8]"/>
          <select value={role} onChange={(e) => setRole(e.target.value)} className="w-36 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4b8df8]">
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Staff">Staff</option>
          </select>
          <button type="submit" disabled={isSubmitting} className="bg-[#2ecc71] text-white px-6 py-2 rounded font-semibold hover:bg-green-600 disabled:opacity-50 transition-colors">
            {isSubmitting ? "Saving..." : editingId ? "Update" : "Add User"}
          </button>
          {editingId && <button type="button" onClick={resetForm} className="bg-gray-400 text-white px-4 py-2 rounded font-semibold hover:bg-gray-500 transition-colors">Cancel</button>}
        </form>
      </div>

      <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100 mb-6">
        <input type="text" placeholder="Search users by name, email, or phone..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4b8df8]"/>
      </div>

      <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Registered Users</h3>
        <div className="space-y-3">
          {errorMessage && <div className="p-4 bg-red-100 text-red-700 border border-red-400 rounded"><strong>Error:</strong> {errorMessage}</div>}
          {filteredUsers.map((user) => (
            <div key={user.id} className="p-4 border rounded bg-gray-50 flex justify-between items-center">
              <div>
                <p className="font-bold text-lg text-gray-800">{user.name}</p>
                <p className="text-sm text-gray-600 mt-0.5">
                  {user.email && `Email: ${user.email}`} 
                  {user.email && user.phone && ` | `}
                  {user.phone && `Phone: ${user.phone}`}
                  {!user.email && !user.phone && `No contact details provided`}
                </p>
                <p className="text-xs text-blue-600 font-semibold mt-1">Role: {user.role}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(user)} className="bg-blue-500 text-white px-3 py-1.5 rounded text-sm font-semibold hover:bg-blue-600 transition-colors">Edit</button>
                <button onClick={() => handleDelete(user.id)} className="bg-red-500 text-white px-3 py-1.5 rounded text-sm font-semibold hover:bg-red-600 transition-colors">Delete</button>
              </div>
            </div>
          ))}
          {filteredUsers.length === 0 && !errorMessage && <p className="text-gray-500">No users found.</p>}
        </div>
      </div>
    </main>
  );
}