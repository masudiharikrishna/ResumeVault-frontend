"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, User, Shield, Eye, EyeOff, ShieldAlert, ArrowLeft, Loader2, Check, FileCheck2, Sparkles, UploadCloud, FolderHeart } from "lucide-react";
import { useDispatch } from "react-redux";
import { login as reduxLogin } from "@/store/Reducers/AuthReducer";
import { BackendService } from "@/utils/Backend";
import { AUTH_SIGNUP } from "@/constants/ApiConstants";
import { ROUTES } from "@/constants/routeConstants";


export default function SignupPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Validation / Loading states
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Verify passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);

    // Real API registration request
    BackendService.Post(
      {
        url: AUTH_SIGNUP,
        data: { name, email, password },
      },
      {
        success: (data: any) => {
          // data contains { token, user: { id, name, email } }
          dispatch(reduxLogin(data));
          setIsLoading(false);
          setIsSuccess(true);
          setTimeout(() => {
            router.push(ROUTES.DASHBOARD);
          }, 1000);
        },
        failure: (err: any) => {
          setIsLoading(false);
          const errMsg = err?.response?.data?.message || err?.message || "Registration failed. Please try again.";
          setError(Array.isArray(errMsg) ? errMsg[0] : errMsg);
        },
      }
    );
  };


  return (

      <div className="min-h-screen bg-[#030307] text-[#f8fafc] grid grid-cols-1 lg:grid-cols-12 relative overflow-hidden">
      
      {/* Left Column - Visuals & Brand Info (Desktop only) */}
      <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-12 bg-black/30 border-r border-white/5 relative overflow-hidden bg-cyber-dots bg-cyber-grid">
        {/* Glows */}
        <div className="absolute top-1/4 left-1/4 -z-10 h-72 w-72 rounded-full bg-cyber-purple/15 blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 -z-10 h-80 w-80 rounded-full bg-cyber-cyan/15 blur-[120px]" />

        {/* Header Branding */}
        <div className="flex items-center justify-between">
          <Link 
            href={ROUTES.HOME} 
            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-1.5">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-linear-to-tr from-cyber-indigo to-cyber-cyan shadow-md">
              <Shield className="h-3 w-3 text-white" />
            </div>
            <span className="text-xs font-bold text-white tracking-tight">ResumeVault</span>
          </div>
        </div>

        {/* Center centerpiece visual */}
        <div className="flex-1 flex flex-col items-center justify-center my-8 text-center">
          <div className="relative h-72 w-full max-w-sm flex items-center justify-center">
            {/* Concentric rotating border rings */}
            <motion.div 
              animate={{ rotate: -360 }} 
              transition={{ repeat: Infinity, duration: 30, ease: "linear" }} 
              className="absolute h-44 w-44 rounded-full border border-dashed border-cyber-cyan/20" 
            />
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ repeat: Infinity, duration: 40, ease: "linear" }} 
              className="absolute h-52 w-52 rounded-full border border-dashed border-cyber-purple/15" 
            />

            {/* Glowing Cloud Storage Base */}
            <motion.div 
              animate={{ y: [0, -6, 0] }} 
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-cyber-cyan/20 to-cyber-indigo/20 border border-cyber-cyan/35 shadow-[0_0_50px_rgba(6,182,212,0.15)]"
            >
              <div className="absolute inset-0.5 rounded-full bg-black/40 blur-xs" />
              <UploadCloud className="relative z-10 h-10 w-10 text-cyber-cyan animate-pulse" />
            </motion.div>

            {/* Floating synced items (floating upward into the cloud) */}
            <motion.div
              initial={{ y: 80, x: -60, opacity: 0 }}
              animate={{ 
                y: [-20, -110, -20],
                x: [-60, -45, -60],
                opacity: [0, 1, 0]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 6, 
                ease: "linear"
              }}
              className="absolute z-20 flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/60 p-2 shadow-lg backdrop-blur-md"
            >
              <div className="flex h-5 w-5 items-center justify-center rounded bg-cyber-emerald/10 text-cyber-emerald">
                <Check className="h-3 w-3" />
              </div>
              <div className="text-left">
                <p className="text-[8px] font-bold text-white">cv_tech_lead.pdf</p>
                <p className="text-[6px] text-zinc-500 font-medium">Uploaded Successfully</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 90, x: 60, opacity: 0 }}
              animate={{ 
                y: [20, -70, 20],
                x: [60, 45, 60],
                opacity: [0, 1, 0]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 7, 
                ease: "linear",
                delay: 2.5
              }}
              className="absolute z-20 flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/60 p-2 shadow-lg backdrop-blur-md"
            >
              <div className="flex h-5 w-5 items-center justify-center rounded bg-cyber-purple/10 text-cyber-purple">
                <Sparkles className="h-3 w-3" />
              </div>
              <div className="text-left">
                <p className="text-[8px] font-bold text-white">resume_creative.docx</p>
                <p className="text-[6px] text-zinc-500 font-medium">ATS Match Ready</p>
              </div>
            </motion.div>

            {/* Floating extra elements */}
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 15, 0]
              }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="absolute top-12 right-16 z-20 flex h-7 w-7 items-center justify-center rounded-full border border-cyber-purple/30 bg-cyber-purple/10 text-cyber-purple backdrop-blur-md"
            >
              <FolderHeart className="h-3.5 w-3.5" />
            </motion.div>
          </div>

          <div className="mt-4">
            <h3 className="text-base font-bold text-white tracking-tight">Create Your Professional Vault</h3>
            <p className="text-xs text-zinc-400 max-w-xs leading-relaxed mt-1.5">
              Organize multiple iterations of your CVs and portfolios under a unified, private dashboard. Open, update, or share with employers instantly.
            </p>
          </div>
        </div>

        {/* Footer info pills */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-3 bg-white/1 border border-white/5 rounded-xl p-3 backdrop-blur-xs">
            <FileCheck2 className="h-4.5 w-4.5 text-cyber-cyan shrink-0" />
            <div className="text-left">
              <p className="text-xs font-bold text-white">Unlimited PDF Storage</p>
              <p className="text-[10px] text-zinc-500 font-medium">Keep as many version drafts as your job hunt demands, completely free.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/1 border border-white/5 rounded-xl p-3 backdrop-blur-xs">
            <Sparkles className="h-4.5 w-4.5 text-cyber-purple shrink-0" />
            <div className="text-left">
              <p className="text-xs font-bold text-white">ATS-Scoring & Templates</p>
              <p className="text-[10px] text-zinc-500 font-medium">Prepare for resume scanning software automatically (Coming Soon).</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Form Container (All viewports) */}
      <div className="col-span-12 lg:col-span-7 flex items-center justify-center p-6 relative overflow-hidden bg-cyber-dots bg-cyber-grid">
        {/* Background neon glows */}
        <div className="absolute top-1/4 left-1/4 -z-10 h-72 w-72 rounded-full bg-cyber-indigo/10 blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 -z-10 h-80 w-80 rounded-full bg-cyber-purple/10 blur-[120px]" />

        {/* Floating Back Link (Visible on mobile/tablet, hidden on desktop since it is in left panel) */}
        <div className="absolute top-6 left-6 lg:hidden">
          <Link 
            href={ROUTES.HOME} 
            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        {/* Card Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="glass-panel w-full max-w-md overflow-hidden rounded-2xl border border-white/10 p-6 shadow-2xl md:p-8"
        >
          {isLoading || isSuccess ? (
            /* Verification Screen */
            <div className="flex min-h-95 flex-col items-center justify-center text-center">
              {isLoading ? (
                <>
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-cyber-indigo/30 bg-cyber-indigo/5">
                    <div className="absolute inset-0 rounded-full border-t-2 border-l-2 border-cyber-indigo animate-spin" />
                    <Shield className="h-8 w-8 text-cyber-indigo animate-pulse" />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-white">Creating your vault...</h3>
                  <p className="text-xs text-zinc-500 mt-1">Deploying private database enclaves</p>
                </>
              ) : (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center"
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-cyber-emerald/10 border border-cyber-emerald/30">
                    <Check className="h-10 w-10 text-cyber-emerald animate-pulse" />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-white">Account created!</h3>
                  <p className="text-xs text-zinc-500 mt-1">Redirecting to your personal resume vault</p>
                </motion.div>
              )}
            </div>
          ) : (
            /* Form Screen */
            <>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-tr from-cyber-indigo to-cyber-purple">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">Create Vault Account</h2>
                  <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider block">100% Free Registration</p>
                </div>
              </div>

              {/* Mismatch warnings */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-5 rounded-lg border border-rose-500/20 bg-rose-500/5 p-3 flex gap-2 items-center text-xs text-rose-400"
                >
                  <ShieldAlert className="h-4.5 w-4.5 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {/* Full Name */}
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                    Full Name
                  </label>
                  <div className="relative mt-1">
                    <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full rounded-lg bg-black/30 border border-white/10 py-2.5 pl-10 pr-4 text-xs text-white placeholder-zinc-600 outline-none transition-all focus:border-cyber-indigo/50 focus:bg-black/50"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                    Email Address
                  </label>
                  <div className="relative mt-1">
                    <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="developer@resumevault.com"
                      className="w-full rounded-lg bg-black/30 border border-white/10 py-2.5 pl-10 pr-4 text-xs text-white placeholder-zinc-600 outline-none transition-all focus:border-cyber-indigo/50 focus:bg-black/50"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                    Password
                  </label>
                  <div className="relative mt-1">
                    <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-lg bg-black/30 border border-white/10 py-2.5 pl-10 pr-10 text-xs text-white placeholder-zinc-600 outline-none transition-all focus:border-cyber-indigo/50 focus:bg-black/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-zinc-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                    Confirm Password
                  </label>
                  <div className="relative mt-1">
                    <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-lg bg-black/30 border border-white/10 py-2.5 pl-10 pr-10 text-xs text-white placeholder-zinc-600 outline-none transition-all focus:border-cyber-indigo/50 focus:bg-black/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-zinc-400 hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="mt-6 w-full cursor-pointer rounded-lg bg-linear-to-r from-cyber-indigo via-cyber-purple to-cyber-cyan py-3 text-xs font-bold text-white shadow-lg shadow-cyber-indigo/25 hover:scale-[1.01] transition-all active:scale-[0.99]"
                >
                  Create Free Account
                </button>
              </form>

              <div className="mt-6 border-t border-white/5 pt-6 text-center text-xs text-zinc-500">
                Already have an account?{" "}
                <Link href={ROUTES.LOGIN} className="font-bold text-cyber-cyan hover:underline transition-all">
                  Sign in here
                </Link>
              </div>
            </>
          )}
        </motion.div>
      </div>

      </div>

  );
}
