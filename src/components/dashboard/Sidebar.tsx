"use client";

import { useRouter } from "next/navigation";
import { 
  Shield, FileText, LayoutTemplate, Sparkles, 
  Settings, LogOut, UploadCloud, GraduationCap, Mail
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onUploadClick: () => void;
  user: { name: string; email: string };
}

export default function Sidebar({ activeTab, setActiveTab, onUploadClick, user }: SidebarProps) {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/");
  };

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "JD";

  return (
    <aside className="w-64 border-r border-white/5 bg-[#04040a] flex flex-col justify-between h-screen sticky top-0">
      
      {/* Top Section */}
      <div className="p-6">
        {/* Brand */}
        <div className="flex items-center gap-2 select-none mb-8">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-tr from-cyber-indigo to-cyber-cyan shadow-md">
            <Shield className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="text-base font-bold tracking-tight text-white">
            Resume<span className="text-cyber-cyan">Vault</span>
          </span>
        </div>

        {/* User Card */}
        <div className="p-3.5 rounded-xl bg-white/3 border border-white/5 mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-linear-to-tr from-cyber-indigo to-cyber-purple flex items-center justify-center font-bold text-white text-sm">
              {initials}
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-white truncate">{user.name}</h4>
              <span className="text-[10px] text-zinc-500 truncate block">{user.email}</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-1.5">
            <GraduationCap className="h-3.5 w-3.5 text-cyber-cyan" />
            <span className="text-[9px] font-bold uppercase tracking-wider text-cyber-cyan bg-cyber-cyan/10 px-1.5 py-0.5 rounded">
              Student Vault
            </span>
          </div>
        </div>

        {/* Action Button */}
        {activeTab !== "settings" && (
          <button
            onClick={onUploadClick}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-linear-to-r from-cyber-indigo to-cyber-purple py-2.5 px-4 text-xs font-bold text-white shadow-md shadow-cyber-indigo/15 hover:scale-[1.01] transition-all cursor-pointer active:scale-98"
          >
            <UploadCloud className="h-4 w-4" />
            Upload New {activeTab === "resumes" ? "CV" : "Letter"}
          </button>
        )}


        {/* Navigation */}
        <div className="mt-8 space-y-1.5">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block px-2 mb-2">
            Navigation
          </span>

          {/* My Resumes */}
          <button
            onClick={() => setActiveTab("resumes")}
            className={`w-full flex items-center gap-2.5 rounded-lg py-2 px-3 text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "resumes"
                ? "bg-white/5 text-cyber-cyan border-l-2 border-cyber-cyan font-bold"
                : "text-zinc-400 hover:text-white hover:bg-white/2 border-l-2 border-transparent"
            }`}
          >
            <FileText className="h-4 w-4" />
            My Resumes
          </button>

          {/* Cover Letters */}
          <button
            onClick={() => setActiveTab("coverLetters")}
            className={`w-full flex items-center gap-2.5 rounded-lg py-2 px-3 text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "coverLetters"
                ? "bg-white/5 text-cyber-cyan border-l-2 border-cyber-cyan font-bold"
                : "text-zinc-400 hover:text-white hover:bg-white/2 border-l-2 border-transparent"
            }`}
          >
            <Mail className="h-4 w-4" />
            Cover Letters
          </button>

          {/* Templates (Coming Soon) */}
          <div
            className="w-full flex items-center justify-between rounded-lg py-2 px-3 text-xs font-semibold text-zinc-500 border-l-2 border-transparent select-none"
          >
            <span className="flex items-center gap-2.5">
              <LayoutTemplate className="h-4 w-4 text-zinc-600" />
              Templates
            </span>
            <span className="text-[8px] font-bold bg-white/5 border border-white/5 rounded px-1.5 py-0.5 text-zinc-500 scale-95">
              Soon
            </span>
          </div>

          {/* ATS Optimizer (Coming Soon) */}
          <div
            className="w-full flex items-center justify-between rounded-lg py-2 px-3 text-xs font-semibold text-zinc-500 border-l-2 border-transparent select-none"
          >
            <span className="flex items-center gap-2.5">
              <Sparkles className="h-4 w-4 text-zinc-600" />
              ATS Scanner
            </span>
            <span className="text-[8px] font-bold bg-white/5 border border-white/5 rounded px-1.5 py-0.5 text-zinc-500 scale-95">
              Soon
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-6 border-t border-white/5 space-y-2">
        <button
          onClick={() => setActiveTab("settings")}
          className={`w-full flex items-center gap-2.5 rounded-lg py-2.5 px-3 text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "settings"
              ? "bg-white/5 text-cyber-cyan border-l-2 border-cyber-cyan font-bold"
              : "text-zinc-400 hover:text-white hover:bg-white/2 border-l-2 border-transparent"
          }`}
        >
          <Settings className="h-4 w-4" />
          Profile Settings
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2.5 rounded-lg py-2.5 px-3 text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 hover:border-rose-500/20 transition-all cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>

    </aside>
  );
}
