import { login } from "../utils/lmsState";
import { useState } from "react";
import FadeUp from "../utils/motions/FadeUp";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await login(email, password);

      if (res?.error) {
        setError(res.error);
        alert(res.error);
      } else {
        const token = res.token;
        localStorage.setItem("token", token);
        alert("User logged in successfully!");
        window.open("/lms/dashboard", "_self");
      }
    } catch (err) {
      const errorMessage =
        err?.message || "An error occurred during login.";

      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FadeUp>
      <div className="flex min-h-screen w-full items-center justify-center bg-[#faf8f3] p-4">

        {/* Login Card */}
        <div className="w-full max-w-sm min-h-40 p-6 bg-white rounded-2xl border border-[#e7eee9] shadow-lg flex flex-col gap-4">

          {/* Form Title */}
          <div className="text-center mb-2">
            <h2 className="text-3xl font-semibold text-[#1f5d42] font-serif">
              Welcome Back
            </h2>

            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="h-px w-8 bg-[#f59e0b]/60"></span>
              <span className="text-[#f59e0b] text-sm">✦</span>
              <span className="h-px w-8 bg-[#f59e0b]/60"></span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">

            {/* Email Field */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[#3f5f50]">
                Email
              </label>

              <input
                type="email"
                required
                disabled={isLoading}
                value={email}
                className="border border-[#cfdcd4] rounded-lg p-2.5 bg-[#fdfefd] text-[#234d3a] outline-none focus:ring-2 focus:ring-[#f59e0b]/30 focus:border-[#1f5d42] disabled:bg-gray-100 disabled:cursor-not-allowed transition"
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
              />
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[#3f5f50]">
                Password
              </label>

              <input
                type="password"
                required
                disabled={isLoading}
                value={password}
                className="border border-[#cfdcd4] rounded-lg p-2.5 bg-[#fdfefd] text-[#234d3a] outline-none focus:ring-2 focus:ring-[#f59e0b]/30 focus:border-[#1f5d42] disabled:bg-gray-100 disabled:cursor-not-allowed transition"
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
              />
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-red-600 text-sm font-medium bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            {/* Login Button with Spinner */}
            <button
              type="submit"
              disabled={!email || !password || isLoading}
              className="bg-[#f59e0b] text-white font-semibold rounded-lg p-2.5 mt-2 w-full hover:bg-[#d97706] transition-colors cursor-pointer disabled:hover:cursor-not-allowed disabled:bg-[#f5c978] flex items-center justify-center gap-2 shadow-sm"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>

                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>

                  <span>Logging in...</span>
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Registration Link */}
          <p className="mx-auto text-sm text-[#587064]">
            New here?{" "}

            <Link
              to="/lms/register"
              className={`text-[#1f5d42] hover:text-[#f59e0b] font-semibold transition-colors cursor-pointer ${
                isLoading
                  ? "pointer-events-none opacity-50"
                  : ""
              }`}
            >
              Register
            </Link>
          </p>

        </div>
      </div>
    </FadeUp>
  );
}