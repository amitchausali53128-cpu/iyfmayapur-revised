import { useState } from "react";
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_SADHNA_API_URL || "http://localhost:4000";

export default function AdminRegister() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminSecret, setAdminSecret] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${apiUrl}/api/user/register/admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, adminSecret}),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed. Please check your details.");
      }

      alert("Admin registered successfully! You can now log in.");

      window.dispatchEvent(new Event("auth-change"));
      navigate("/login", { replace: true });
    } catch (submitError) {
      console.error("Registration error:", submitError);
      setError(submitError.message || "Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };


    return (<div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-100 to-blue-200">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
            <h2 className="mb-6 text-center text-2xl font-semibold text-gray-800">Admin Registration</h2>
            {error && <div className="mb-4 text-center text-sm text-red-600">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="mt-1 bg-orange-100 py-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 sm:text-sm"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                         className="mt-1 bg-orange-100 py-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 sm:text-sm"
                    />
                </div>
                
                <div className="mb-6">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                         className="mt-1 bg-orange-100 py-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 sm:text-sm"
                    />
                    <div className="mt-2 flex items-center">
                        <input
                            type="checkbox"
                            id="showPassword"
                            checked={showPassword}
                            onChange={() => setShowPassword(!showPassword)}
                            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="showPassword" className="text-sm text-gray-600">Show Password</label>
                    </div>
                    <div className="my-4">
                    <label htmlFor="secret" className="block text-sm font-medium text-gray-700">Admin Secret</label>
                    <input
                        
                        id="secret"
                        value={adminSecret}
                        onChange={(e) => setAdminSecret(e.target.value)}
                        required
                        className="mt-1 bg-orange-100 py-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 sm:text-sm"
                    />
                </div>
                    
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full rounded-md bg-blue-600 py-2 px-4 text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${loading ? "cursor-not-allowed opacity-50" : ""}`}
                >
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>
        </div>
    </div>);
}