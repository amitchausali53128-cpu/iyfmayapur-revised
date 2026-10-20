import { useState } from "react";
import { motion } from "motion/react";
import { Eye, EyeOff, Lock, Mail, LoaderCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TempImg from "../../assets/Temple.webp";

const apiUrl = import.meta.env.VITE_SADHNA_API_URL || "http://localhost:4000";

const particles = [
  { left: "8%", top: "18%", size: "h-1 w-1", delay: 0 },
  { left: "21%", top: "67%", size: "h-1.5 w-1.5", delay: 1 },
  { left: "38%", top: "25%", size: "h-1 w-1", delay: 2 },
  { left: "58%", top: "72%", size: "h-1 w-1", delay: 0.5 },
  { left: "76%", top: "20%", size: "h-1.5 w-1.5", delay: 1.5 },
  { left: "91%", top: "60%", size: "h-1 w-1", delay: 2.5 },
];

export default function Auth() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${apiUrl}/api/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed. Please check your details.");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          id: data.user.id,
        }),
      );
      window.dispatchEvent(new Event("auth-change"));
      if(data.user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      }else
      navigate("/sadhna", { replace: true });
    } catch (submitError) {
      console.error("Login error:", submitError);
      setError(submitError.message || "Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden bg-[#102c3d]">
      <motion.img
        src={TempImg}
        alt="Mayapur Temple"
        initial={{ scale: 1 }}
        animate={{ scale: 1.05 }}
        transition={{ duration: 18, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        className="absolute inset-0 h-full w-full object-cover object-[62%_center] md:object-center"
      />
      <div className="absolute inset-0 bg-black/25" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/10" />
      <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/40 to-transparent" />

      <motion.div
        animate={{ opacity: [0.12, 0.28, 0.12], scale: [1, 1.15, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[20%] top-[12%] h-72 w-72 rounded-full bg-orange-400/25 blur-[100px]"
      />

      {particles.map((particle, index) => (
        <motion.span
          key={index}
          className={`absolute ${particle.size} rounded-full bg-orange-400 shadow-[0_0_12px_rgba(245,158,11,0.8)]`}
          style={{ left: particle.left, top: particle.top }}
          animate={{ y: [0, -18, 0], opacity: [0.2, 0.9, 0.2], scale: [1, 1.5, 1] }}
          transition={{ duration: 3 + index * 0.3, delay: particle.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      <div className="relative z-10 flex min-h-[calc(100vh-4rem)] items-center px-4 pb-10 pt-10 sm:px-8 md:px-12 lg:px-16 xl:px-24">
        <div className="w-full max-w-[540px]">
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-5 text-white"
          >
            <div className="mb-3 flex items-center gap-3">
              <div className="h-0.5 w-10 bg-orange-400" />
              <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-orange-300">
                Daily Sadhana Portal
              </p>
            </div>
            <h1 className="font-serif text-4xl font-thin leading-none md:text-5xl">
              Welcome{" "}
              <span className="italic text-orange-400">back.</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="overflow-hidden rounded-3xl border border-white/70 bg-[#dff4ff]/95 shadow-[0_25px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl"
          >
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
            <form onSubmit={handleSubmit} className="p-6 sm:p-8">
              <div className="mb-7">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#a66300]">
                  Continue your journey
                </p>
                <h2 className="font-serif text-3xl font-light leading-tight text-[#123047] sm:text-4xl">
                  Sign in to your{" "}
                  <span className="italic text-orange-500">Sadhana.</span>
                </h2>
                <p className="mt-3 text-sm leading-6 text-[#123047]/70">
                  Keep showing up, growing inward, and serving with purpose.
                </p>
              </div>

              {error && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="space-y-5">
                <label className="block">
                  <span className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-[#123047]/80">
                    <Mail size={13} className="text-[#b86f00]" />
                    Email address
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    className="w-full rounded-xl border border-[#123047]/15 bg-white/75 px-4 py-3 text-sm font-medium text-[#123047] outline-none backdrop-blur-md transition-all placeholder:text-[#123047]/40 hover:bg-white/90 focus:border-orange-500/70 focus:bg-white focus:ring-2 focus:ring-orange-500/15"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-[#123047]/80">
                    <Lock size={13} className="text-[#b86f00]" />
                    Password
                  </span>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                      className="w-full rounded-xl border border-[#123047]/15 bg-white/75 px-4 py-3 pr-12 text-sm font-medium text-[#123047] outline-none backdrop-blur-md transition-all placeholder:text-[#123047]/40 hover:bg-white/90 focus:border-orange-500/70 focus:bg-white focus:ring-2 focus:ring-orange-500/15"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((visible) => !visible)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#123047]/55 transition hover:text-orange-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-7 inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 px-7 py-3.5 text-sm font-semibold tracking-wide text-emerald-950 shadow-[0_12px_25px_rgba(245,158,11,0.2)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(245,158,11,0.35)] disabled:cursor-wait disabled:opacity-60"
              >
                {loading ? <LoaderCircle size={18} className="animate-spin" /> : <ArrowRight size={18} />}
                {loading ? "Entering..." : "Enter Sadhana"}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
