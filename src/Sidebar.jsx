import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="w-64 bg-[#1e293b] text-white flex flex-col justify-between min-h-screen">
      <div>
        <div className="p-6 text-2xl font-bold tracking-wider border-b border-gray-700">
          Madina Traders
        </div>
        <nav className="mt-6 flex flex-col space-y-1">
          <Link to="/" className="flex items-center px-6 py-3 hover:bg-gray-700 transition-colors text-gray-300 hover:text-white">
            Dashboard
          </Link>
          <Link to="/products" className="flex items-center px-6 py-3 hover:bg-gray-700 transition-colors text-gray-300 hover:text-white">
            Products
          </Link>
          <Link to="/categories" className="flex items-center px-6 py-3 hover:bg-gray-700 transition-colors text-gray-300 hover:text-white">
            Categories
          </Link>
          <Link to="/orders" className="flex items-center px-6 py-3 hover:bg-gray-700 transition-colors text-gray-300 hover:text-white">
            Orders
          </Link>
          <Link to="/suppliers" className="flex items-center px-6 py-3 hover:bg-gray-700 transition-colors text-gray-300 hover:text-white">
            Suppliers
          </Link>
          <Link to="/users" className="flex items-center px-6 py-3 hover:bg-gray-700 transition-colors text-gray-300 hover:text-white">
            Users
          </Link>
          <Link to="/profile" className="flex items-center px-6 py-3 hover:bg-gray-700 transition-colors text-gray-300 hover:text-white">
            Profile
          </Link>
        </nav>
      </div>

      <div className="p-6 border-t border-gray-700">
        <button className="flex items-center text-gray-300 hover:text-white transition-colors">
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;