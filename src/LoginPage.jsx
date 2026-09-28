import { useState } from "react";
import { supabase } from "./supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAuth(e) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert("Registration successful! You can now log in.");
        setIsLogin(true);
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f8f9fa]">
      <div className="bg-white p-8 rounded-md shadow-sm border border-gray-100 w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {isLogin ? "Kaveri Stock Login" : "Create Account"}
        </h2>
        
        {errorMessage && (
          <div className="p-3 mb-4 bg-red-100 text-red-700 border border-red-400 rounded text-sm">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <input 
            type="email" 
            placeholder="Email Address" 
            required 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4b8df8]"
          />
          <input 
            type="password" 
            placeholder="Password" 
            required 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4b8df8]"
          />
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-[#4b8df8] text-white p-2 rounded font-semibold hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            {loading ? "Processing..." : isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <p 
          className="mt-6 text-center text-sm cursor-pointer text-blue-500 hover:underline" 
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Need an account? Sign Up" : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
}