"use client";
import { useState } from "react";
import { EyeIcon, EyeSlashIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { useTheme } from "@/components/theme";

export function LoginForm({ onLogin }: { onLogin: () => void }) {
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!pass) {
      setError("Password is required.");
      return;
    }

    setLoading(true);
    
    // Simulate network delay for UI feedback
    await new Promise((resolve) => setTimeout(resolve, 1200));

    if (pass === "savana123") {
      onLogin();
    } else {
      setError("The email or password you entered is incorrect.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8 lg:p-12 bg-[var(--ink)]/5 text-[var(--ink)]">
      <div className="flex w-full max-w-6xl bg-[var(--bg)] rounded-[2rem] overflow-hidden shadow-2xl border border-[var(--line)] h-[650px] max-h-[95vh]">
        {/* Left Section - Visual Showcase */}
        <div className="hidden lg:flex lg:w-7/12 relative flex-col justify-end p-12">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-10000 hover:scale-105 ease-linear" 
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80")' }}
        />
        {/* Subtle dark overlay for editorial feel and text contrast */}
        <div className="absolute inset-0 bg-[var(--ink)]/20 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)]/80 via-[var(--ink)]/10 to-transparent" />
        
        <div className="relative z-10 text-[var(--bg)] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both">
          <p className="text-[10px] tracking-[0.2em] uppercase opacity-70 mb-4 font-medium">Architectural Studies / 2026</p>
          <p className="font-serif text-3xl max-w-lg leading-relaxed text-[var(--bg)]/90">
            Designing spaces that shape how we live, work, and experience the world.
          </p>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="w-full lg:w-5/12 flex flex-col justify-center items-center px-6 sm:px-12 xl:px-16 py-12 relative h-full overflow-y-auto">
        <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* Brand */}
          <div className="mb-8">
            <img
              src={theme === "dark" ? "/savanaarsitekwhite.png" : "/savanaarsitekblack.png"}
              alt="SAVANA"
              className="h-9 w-auto object-contain transition-opacity mb-2"
            />
            <p className="text-[10px] tracking-widest uppercase opacity-40">Digital Studio</p>
          </div>

          {/* Welcome Heading */}
          <div className="mb-6">
            <h2 className="text-3xl font-serif mb-2">Welcome back.</h2>
            <p className="text-sm opacity-60">Sign in to continue to your studio workspace.</p>
          </div>

          {/* Validation Error */}
          <div className={`overflow-hidden transition-all duration-300 ${error ? 'max-h-24 mb-6' : 'max-h-0'}`}>
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm border border-red-200 dark:border-red-900/50 flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {error}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email Input */}
            <div className="space-y-2 group">
              <label htmlFor="email" className="text-[13px] font-medium opacity-80 block">Email address</label>
              <input 
                id="email"
                type="email" 
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder="you@example.com" 
                className="w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3.5 text-sm outline-none focus:border-[var(--ink)] focus:ring-1 focus:ring-[var(--ink)] text-[var(--ink)] transition-all placeholder:opacity-30" 
                aria-invalid={error.includes("email")}
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-[13px] font-medium opacity-80 block">Password</label>
              <div className="relative group">
                <input 
                  id="password"
                  type={showPass ? "text" : "password"} 
                  value={pass}
                  onChange={(e) => { setPass(e.target.value); setError(""); }}
                  placeholder="Enter your password" 
                  className="w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] pl-4 pr-12 py-3.5 text-sm outline-none focus:border-[var(--ink)] focus:ring-1 focus:ring-[var(--ink)] text-[var(--ink)] transition-all placeholder:opacity-30" 
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink)] opacity-40 hover:opacity-100 transition-opacity p-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--ink)]"
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember & Recovery */}
            <div className="flex items-center justify-between text-sm pt-2">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input type="checkbox" className="peer sr-only" />
                  <div className="w-4 h-4 rounded border border-[var(--line)] bg-[var(--bg)] peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--ink)] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[var(--bg)] transition-all peer-checked:bg-[var(--ink)] peer-checked:border-[var(--ink)]" />
                  <svg className="absolute w-3 h-3 text-[var(--bg)] opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="opacity-70 group-hover:opacity-100 transition-opacity text-[13px]">Remember me</span>
              </label>
              
              <a href="#" className="font-medium opacity-70 hover:opacity-100 transition-opacity text-[13px] hover:underline underline-offset-4">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button 
              disabled={loading}
              className="w-full h-12 mt-4 flex items-center justify-center rounded-xl bg-[var(--ink)] text-[var(--bg)] font-medium text-sm hover:opacity-90 hover:-translate-y-[1px] active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              {loading ? (
                <>
                  <ArrowPathIcon className="w-4 h-4 animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

        </div>
      </div>
      </div>
    </div>
  );
}
