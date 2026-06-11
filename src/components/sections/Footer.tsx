"use client";

import { useState } from "react";
import { Shield, ArrowRight, Check } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail("");
      setSubscribed(false);
    }, 3000);
  };

  return (
    <footer className="bg-[#020205] border-t border-white/5 py-16 md:py-20 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 items-start">
          
          {/* Brand & Status (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-cyber-indigo to-cyber-cyan shadow-md">
                <Shield className="h-4.5 w-4.5 text-white" />
              </div>
              <span className="text-base font-bold tracking-tight text-white">
                Resume<span className="text-cyber-cyan">Vault</span>
              </span>
            </div>
            <p className="text-xs text-zinc-500 max-w-sm leading-relaxed">
              ResumeVault is a secure, version-controlled cloud storage engine dedicated to helping job seekers and students organize their application assets.
            </p>
            
            {/* Operational badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-cyber-emerald/20 bg-cyber-emerald/5 py-1 px-3 text-[10px] font-semibold text-cyber-emerald">
              <span className="h-1.5 w-1.5 rounded-full bg-cyber-emerald animate-ping" />
              All Vault Systems Operational
            </div>
          </div>

          {/* Links 1 (2 cols) */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Product</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#features" className="text-zinc-400 hover:text-white transition-colors">Features</a></li>
              <li><a href="#showcase" className="text-zinc-400 hover:text-white transition-colors">Interactive Showcase</a></li>
              <li><span className="text-zinc-600 cursor-not-allowed">Integrations (Soon)</span></li>
            </ul>
          </div>

          {/* Links 2 (2 cols) */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Security & Legal</h4>
            <ul className="space-y-2 text-xs">
              <li><span className="text-zinc-400 hover:text-white transition-colors cursor-pointer">Security Protocol</span></li>
              <li><span className="text-zinc-400 hover:text-white transition-colors cursor-pointer">Privacy Policy</span></li>
              <li><span className="text-zinc-400 hover:text-white transition-colors cursor-pointer">Terms of Service</span></li>
            </ul>
          </div>

          {/* Newsletter (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Stay Updated</h4>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Get monthly newsletters containing ATS template optimization updates and resume layout tips.
            </p>

            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@resumevault.com"
                className="flex-1 rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-xs text-white placeholder-zinc-600 outline-none focus:border-cyber-indigo/50"
              />
              <button
                type="submit"
                className="flex items-center justify-center rounded-lg bg-white p-2 text-black hover:bg-zinc-200 transition-colors"
              >
                {subscribed ? <Check className="h-4 w-4 text-cyber-emerald" /> : <ArrowRight className="h-4 w-4" />}
              </button>
            </form>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-16 border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-zinc-600">
          <p>© {new Date().getFullYear()} ResumeVault. Built with security and privacy priority.</p>
          <p>Next.js 16 + Tailwind v4 + Framer Motion</p>
        </div>
      </div>
    </footer>
  );
}
