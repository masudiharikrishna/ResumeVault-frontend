"use client";

import { useState, useEffect } from "react";
import { Search, Plus, HardDrive, ShieldCheck, AlertCircle, LogOut, FileText, Mail, User, Loader2, Check, Globe } from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";
import ResumeCard from "@/components/dashboard/ResumeCard";
import UploadModal from "@/components/dashboard/UploadModal";
import ResumePreview from "@/components/dashboard/ResumePreview";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { logout as reduxLogout, updateProfile as reduxUpdateProfile } from "@/store/Reducers/AuthReducer";
import { BackendService } from "@/utils/Backend";
import { DOCUMENTS_BASE, USER_PROFILE, DOCUMENT_DELETE } from "@/constants/ApiConstants";
import { ROUTES } from "@/constants/routeConstants";

interface ResumeData {
  id: string;
  title: string;
  fileName: string;
  size: string;
  updatedAt: string;
  type?: "resume" | "cover-letter";
  fileUrl?: string;
  s3Key?: string;
  iv?: string;
  mimeType?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  
  // Redux Auth State
  const authState = useSelector((state: RootState) => state.AuthReducer);
  const token = authState.userData?.token;
  const reduxUser = authState.userData?.user;

  // Safe user object for rendering
  const user = {
    name: reduxUser?.name || "User",
    email: reduxUser?.email || "",
  };

  const [activeTab, setActiveTab] = useState("resumes");
  const [searchQuery, setSearchQuery] = useState("");
  const [documents, setDocuments] = useState<ResumeData[]>([]);
  const [isDocsLoading, setIsDocsLoading] = useState(true);

  // Settings form states
  const [settingsName, setSettingsName] = useState(user.name);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authState.status || !token) {
      router.push(ROUTES.LOGIN);
    }
  }, [authState.status, token, router]);

  // Sync settings inputs when activeTab changes or user changes
  useEffect(() => {
    if (activeTab === "settings") {
      setSettingsName(user.name);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSettingsError(null);
      setSettingsSuccess(false);
    }
  }, [activeTab, reduxUser]);

  // Fetch documents from backend
  const fetchDocuments = () => {
    if (!token) return;
    const docType = activeTab === "resumes" ? "resume" : "cover-letter";
    setIsDocsLoading(true);

    BackendService.Get(
      {
        url: DOCUMENTS_BASE,
        accessToken: token,
        data: {
          query: searchQuery,
          type: docType,
        },
      },
      {
        success: (data: any) => {
          const mapped: ResumeData[] = data.map((d: any) => ({
            id: d._id,
            title: d.title,
            fileName: d.fileName,
            size: d.size,
            updatedAt: new Date(d.updatedAt).toLocaleDateString(),
            type: d.type,
            s3Key: d.s3Key,
            iv: d.iv,
            mimeType: d.mimeType,
          }));
          setDocuments(mapped);
          setIsDocsLoading(false);
        },
        failure: (err: any) => {
          console.error("Failed to load documents", err);
          setIsDocsLoading(false);
        },
      }
    );
  };

  // Sync profile details on mount
  useEffect(() => {
    if (!token) return;

    BackendService.Get(
      {
        url: USER_PROFILE,
        accessToken: token,
      },
      {
        success: (data: any) => {
          dispatch(reduxUpdateProfile(data));
        },
        failure: (err: any) => {
          console.error("Failed to fetch user profile", err);
        },
      }
    );
  }, [token]);

  // Refresh documents list when tab, search query, or token changes
  useEffect(() => {
    if (activeTab !== "settings") {
      fetchDocuments();
    }
  }, [activeTab, searchQuery, token]);

  // Modal states
  const [uploadOpen, setUploadOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedResume, setSelectedResume] = useState<ResumeData | null>(null);
  
  // Custom Confirmation Modal states
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [resumeToDeleteId, setResumeToDeleteId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setResumeToDeleteId(id);
    setDeleteConfirmOpen(true);
  };

  const executeDelete = () => {
    if (resumeToDeleteId && token) {
      BackendService.Delete(
        {
          url: DOCUMENT_DELETE(resumeToDeleteId),
          accessToken: token,
          data: {},
        },
        {
          success: () => {
            fetchDocuments();
            if (selectedResume?.id === resumeToDeleteId) {
              setPreviewOpen(false);
              setSelectedResume(null);
            }
            setDeleteConfirmOpen(false);
            setResumeToDeleteId(null);
          },
          failure: (err: any) => {
            console.error("Failed to delete document", err);
            alert("Failed to delete document: " + (err?.response?.data?.message || err?.message));
            setDeleteConfirmOpen(false);
            setResumeToDeleteId(null);
          },
        }
      );
    }
  };

  const handleUploadSuccess = () => {
    fetchDocuments();
  };

  const handleOpenPreview = (doc: ResumeData) => {
    setSelectedResume(doc);
    setPreviewOpen(true);
  };

  const handleLogout = () => {
    dispatch(reduxLogout());
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsError(null);

    // If trying to change password
    if (currentPassword || newPassword || confirmPassword) {
      if (!currentPassword) {
        setSettingsError("Please enter your current password to authorize updates.");
        return;
      }
      if (newPassword.length < 6) {
        setSettingsError("New password must be at least 6 characters long.");
        return;
      }
      if (newPassword !== confirmPassword) {
        setSettingsError("New passwords do not match. Please verify.");
        return;
      }
    }

    if (!settingsName.trim()) {
      setSettingsError("Name cannot be empty.");
      return;
    }

    setSettingsLoading(true);

    const updateData: any = { name: settingsName };
    if (currentPassword && newPassword) {
      updateData.currentPassword = currentPassword;
      updateData.newPassword = newPassword;
    }

    BackendService.Patch(
      {
        url: USER_PROFILE,
        accessToken: token,
        data: updateData,
      },
      {
        success: (data: any) => {
          setSettingsLoading(false);
          setSettingsSuccess(true);
          dispatch(reduxUpdateProfile(data));
          
          setTimeout(() => {
            setSettingsSuccess(false);
            setActiveTab("resumes"); // Redirect back to resumes view
          }, 1200);
        },
        failure: (err: any) => {
          setSettingsLoading(false);
          const errMsg = err?.response?.data?.message || err?.message || "Profile update failed.";
          setSettingsError(Array.isArray(errMsg) ? errMsg[0] : errMsg);
        },
      }
    );
  };

  // Compute stats
  const resumesCount = documents.filter(d => d.type === "resume" || !d.type).length;
  const coverLettersCount = documents.filter(d => d.type === "cover-letter").length;
  const totalSizeMB = documents.reduce((acc, r) => {
    const sizeVal = parseFloat(r.size.replace(/[^\d.]/g, "")) || 0;
    return acc + sizeVal;
  }, 0).toFixed(1);

  const filteredDocs = documents;

  return (

      <div className="flex bg-[#030307] text-[#f8fafc] min-h-screen">
      
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onUploadClick={() => setUploadOpen(true)} 
        user={user}
        onLogout={handleLogout}
      />

      {/* Main Panel Content */}
      <main className="flex-1 flex flex-col min-w-0 min-h-screen overflow-y-auto">
        
        {/* Top Header Bar */}
        <header className="h-16 border-b border-white/5 bg-[#04040a]/80 backdrop-blur px-8 flex items-center justify-between sticky top-0 z-30">
          
          {/* Search bar */}
          <div className="relative w-full max-w-sm">
            {activeTab !== "settings" ? (
              <>
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={activeTab === "resumes" ? "Search resumes in cloud..." : "Search cover letters..."}
                  className="w-full rounded-full bg-black/30 border border-white/10 py-1.5 pl-9 pr-4 text-xs text-white placeholder-zinc-500 outline-none focus:border-cyber-indigo/50"
                />
              </>
            ) : (
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Profile Configurations</span>
            )}
          </div>

          {/* <div className="flex items-center gap-4">
            <span className="text-xs text-zinc-500 flex items-center gap-1">
              <ShieldCheck className="h-4 w-4 text-cyber-cyan animate-pulse" />
              Connected securely
            </span>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg border border-white/5 hover:border-white/10 text-zinc-400 hover:text-white cursor-pointer"
              title="Log Out"
            >
              <LogOut className="h-4.5 w-4.5" />
            </button>
          </div> */}
        </header>

        {/* Dashboard Grid & Details */}
        <div className="p-8 space-y-8 flex-1 bg-cyber-dots">
          
          {activeTab === "settings" ? (
            /* Settings View (Full Page Tab) */
            <div className="max-w-5xl mx-auto space-y-6">
              
              {/* Header */}
              <div className="border-b border-white/5 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">Profile & Security Settings</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">Manage your personal vault configuration, avatar representation, and access credentials.</p>
                </div>
              </div>

              {settingsSuccess ? (
                /* Success Badge */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-panel rounded-2xl border border-cyber-emerald/20 bg-cyber-emerald/5 p-12 text-center flex flex-col items-center justify-center space-y-4"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyber-emerald/10 border border-cyber-emerald/30">
                    <Check className="h-6 w-6 text-cyber-emerald animate-pulse" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Profile updated successfully!</h4>
                  <p className="text-xs text-zinc-400">Your secure account details have been synchronized. Redirecting to vault...</p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column: Avatar & Account Info Card */}
                  <div className="lg:col-span-4 space-y-6">
                    <div className="glass-panel rounded-2xl border border-white/5 bg-slate-900/10 p-6 flex flex-col items-center text-center relative overflow-hidden group">
                      <div className="absolute -top-12 -left-12 -z-10 h-24 w-24 rounded-full bg-cyber-indigo/5 blur-xl" />
                      
                      {/* Avatar initial bubble with dynamic pulse */}
                      <div className="relative flex items-center justify-center h-20 w-20 rounded-full border border-cyber-indigo/35 bg-linear-to-tr from-cyber-indigo/20 to-cyber-purple/20 text-white font-extrabold text-2xl shadow-[0_0_30px_rgba(99,102,241,0.1)]">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                          className="absolute inset-0 rounded-full border border-dashed border-cyber-indigo/30 scale-105"
                        />
                        {user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "JD"}
                      </div>
                      
                      <h4 className="mt-4 text-sm font-bold text-white tracking-tight truncate max-w-50">{user.name}</h4>
                      <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mt-0.5">{user.email}</p>
                    </div>

                    {/* Account stats card */}
                    <div className="glass-panel rounded-2xl border border-white/5 bg-slate-900/10 p-5 space-y-4">
                      <h5 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider border-b border-white/5 pb-2">Vault Statistics</h5>
                      <div className="space-y-3 text-[11px] text-zinc-400">
                        <div className="flex justify-between items-center">
                          <span>Vault Tier:</span>
                          <span className="text-cyber-cyan font-bold uppercase tracking-wider text-[9px] bg-cyber-cyan/10 px-2 py-0.5 rounded border border-cyber-cyan/20">Student Vault</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Vaulted CVs:</span>
                          <span className="text-white font-bold">{resumesCount} Files</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Cover Letters:</span>
                          <span className="text-white font-bold">{coverLettersCount} Files</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Cloud Security:</span>
                          <span className="text-cyber-emerald font-semibold flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-cyber-emerald animate-ping" />
                            Hardware AES
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Settings Form fields */}
                  <form onSubmit={handleSaveSettings} className="lg:col-span-8 glass-panel rounded-2xl border border-white/5 bg-slate-900/10 p-6 md:p-8 space-y-6 relative overflow-hidden">
                    <div className="absolute -top-12 -right-12 -z-10 h-32 w-32 rounded-full bg-cyber-indigo/10 blur-2xl" />

                    {settingsError && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-3 flex gap-2 items-center text-xs text-rose-400"
                      >
                        <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                        <span>{settingsError}</span>
                      </motion.div>
                    )}

                    {/* Profile Details Block */}
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider border-b border-white/5 pb-2">Personal Details</h4>
                      <div>
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                          <input
                            type="text"
                            required
                            value={settingsName}
                            onChange={(e) => setSettingsName(e.target.value)}
                            placeholder="John Doe"
                            className="w-full rounded-lg bg-black/30 border border-white/10 py-2.5 pl-10 pr-4 text-xs text-white placeholder-zinc-600 outline-none transition-all focus:border-cyber-indigo/50 focus:bg-black/50"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
                          Email Address (Read-only)
                        </label>
                        <div className="relative">
                          <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-600" />
                          <input
                            type="email"
                            disabled
                            value={user.email}
                            className="w-full rounded-lg bg-white/2 border border-white/5 py-2.5 pl-10 pr-4 text-xs text-zinc-500 outline-none cursor-not-allowed"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Security credentials block */}
                    <div className="border-t border-white/5 pt-5 space-y-4">
                      <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider border-b border-white/5 pb-2">Security Credentials</h4>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">Current Password</label>
                          <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Type current password to authorize updates"
                            className="w-full rounded-lg bg-black/30 border border-white/10 py-2.5 px-4 text-xs text-white placeholder-zinc-600 outline-none focus:border-cyber-indigo/50 focus:bg-black/50"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">New Password</label>
                            <input
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="Min. 6 characters"
                              className="w-full rounded-lg bg-black/30 border border-white/10 py-2.5 px-4 text-xs text-white placeholder-zinc-600 outline-none focus:border-cyber-indigo/50 focus:bg-black/50"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">Confirm New Password</label>
                            <input
                              type="password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder="Confirm new password"
                              className="w-full rounded-lg bg-black/30 border border-white/10 py-2.5 px-4 text-xs text-white placeholder-zinc-600 outline-none focus:border-cyber-indigo/50 focus:bg-black/50"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Submit Action Buttons */}
                    <div className="pt-6 border-t border-white/5 flex justify-end gap-3">
                      <button
                        type="submit"
                        disabled={settingsLoading}
                        className="rounded-lg bg-linear-to-r from-cyber-indigo to-cyber-purple py-2.5 px-6 text-xs font-bold text-white shadow-md shadow-cyber-indigo/15 hover:scale-[1.01] transition-all cursor-pointer active:scale-98 disabled:opacity-50 flex items-center gap-1.5"
                      >
                        {settingsLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                        Save Profile Changes
                      </button>
                    </div>
                  </form>
                  
                </div>
              )}
            </div>
          ) : (
            /* Vault Documents Grid view */
            <>
              {/* Top Banner stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel rounded-2xl border border-white/5 bg-slate-900/10 p-5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Vaulted CVs</span>
                    <span className="text-2xl font-extrabold text-white mt-1 block">{resumesCount} Resumes</span>
                  </div>
                  <FileText className="h-10 w-10 text-cyber-indigo/20" />
                </div>

                <div className="glass-panel rounded-2xl border border-white/5 bg-slate-900/10 p-5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Cover Letters</span>
                    <span className="text-2xl font-extrabold text-white mt-1 block">{coverLettersCount} Letters</span>
                  </div>
                  <Mail className="h-10 w-10 text-cyber-purple/20" />
                </div>

                {/* <div className="glass-panel rounded-2xl border border-white/5 bg-slate-900/10 p-5 flex items-center justify-between col-span-1 md:col-span-1">
                  <div>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Cloud Storage Used</span>
                    <span className="text-2xl font-extrabold text-cyber-cyan mt-1 block">
                      {totalSizeMB} MB <span className="text-xs font-semibold text-zinc-500">/ 100 MB Limit</span>
                    </span>
                  </div>
                  <HardDrive className="h-10 w-10 text-cyber-cyan/10" />
                </div> */}
              </div>

              {/* Documents Header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {activeTab === "resumes" ? "Resume Vault" : "Cover Letter Vault"}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Showing {filteredDocs.length} of {activeTab === "resumes" ? resumesCount : coverLettersCount} matching {activeTab === "resumes" ? "resumes" : "cover letters"}
                  </p>
                </div>
                
                <button
                  onClick={() => setUploadOpen(true)}
                  className="flex items-center gap-1.5 rounded-full bg-linear-to-r from-cyber-indigo to-cyber-purple py-2 px-4 text-xs font-bold text-white shadow-md shadow-cyber-indigo/15 hover:scale-[1.01] transition-all cursor-pointer active:scale-98"
                >
                  <Plus className="h-4 w-4" />
                  Upload {activeTab === "resumes" ? "CV" : "Cover Letter"}
                </button>
              </div>

              {/* Grid Layout */}
              {filteredDocs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDocs.map((doc) => (
                    <ResumeCard
                      key={doc.id}
                      resume={doc}
                      onPreview={handleOpenPreview}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              ) : (
                /* Empty State */
                <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-dashed border-white/10 bg-white/1 max-w-lg mx-auto">
                  <AlertCircle className="h-10 w-10 text-zinc-600 mb-4" />
                  <h4 className="text-sm font-semibold text-white">
                    No {activeTab === "resumes" ? "resumes" : "cover letters"} found
                  </h4>
                  <p className="text-xs text-zinc-500 mt-1 max-w-60">
                    We couldn't find any vaulted {activeTab === "resumes" ? "CVs" : "cover letters"} matching your active search query.
                  </p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-4 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Reset Search
                  </button>
                </div>
              )}
            </>
          )}

        </div>
      </main>

      {/* Upload Modal Overlay */}
      <UploadModal 
        isOpen={uploadOpen} 
        onClose={() => setUploadOpen(false)} 
        onUploadSuccess={handleUploadSuccess} 
        documentType={activeTab === "resumes" ? "resume" : "cover-letter"}
      />

      {/* Slide-over Preview Drawer */}
      <ResumePreview 
        isOpen={previewOpen} 
        resume={selectedResume} 
        onClose={() => {
          setPreviewOpen(false);
          setSelectedResume(null);
        }} 
      />

      {/* Reusable Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteConfirmOpen}
        title="Confirm Deletion"
        message={`Are you sure you want to permanently delete this ${activeTab === "resumes" ? "resume" : "cover letter"} from your secure cloud vault? This action cannot be undone.`}
        confirmLabel="Delete"
        type="danger"
        onConfirm={executeDelete}
        onCancel={() => {
          setDeleteConfirmOpen(false);
          setResumeToDeleteId(null);
        }}
      />

      </div>

  );
}
