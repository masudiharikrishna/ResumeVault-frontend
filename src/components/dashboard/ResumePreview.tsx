"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Briefcase, GraduationCap, Mail, Phone, Globe, Download, Loader2, AlertCircle } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import axios from "axios";
import { API_ENDPOINTS } from "@/constants/api";

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

interface ResumePreviewProps {
  isOpen: boolean;
  resume: ResumeData | null;
  onClose: () => void;
}

export default function ResumePreview({ isOpen, resume, onClose }: ResumePreviewProps) {
  const authState = useSelector((state: RootState) => state.AuthReducer);
  const token = authState.userData?.token;

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let url: string | null = null;

    if (isOpen && resume && token) {
      // If it's a mock document without real s3Key, skip preview fetch
      if (!resume.s3Key && !resume.fileUrl) {
        setIsLoading(false);
        setError("Preview not available for demo items");
        return;
      }

      if (resume.fileUrl) {
        setPreviewUrl(resume.fileUrl);
        return;
      }

      setIsLoading(true);
      setError(null);

      axios
        .get(API_ENDPOINTS.DOCUMENTS.PREVIEW(resume.id), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        })
        .then((response) => {
          url = URL.createObjectURL(response.data);
          setPreviewUrl(url);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Failed to load document preview", err);
          setError("Could not retrieve secure preview. Please try downloading the file.");
          setIsLoading(false);
        });
    }

    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
      setPreviewUrl(null);
    };
  }, [isOpen, resume, token]);

  const handleDownload = () => {
    const activeUrl = previewUrl || resume?.fileUrl;
    if (activeUrl && resume) {
      const link = document.createElement("a");
      link.href = activeUrl;
      link.download = resume.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (resume && token) {
      axios
        .get(API_ENDPOINTS.DOCUMENTS.DOWNLOAD(resume.id), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        })
        .then((response) => {
          const url = URL.createObjectURL(response.data);
          const link = document.createElement("a");
          link.href = url;
          link.download = resume.fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        })
        .catch((err) => {
          console.error("Failed to download document", err);
          alert("Failed to download secure document. Please try again.");
        });
    }
  };

  if (!resume) return null;

  const activeUrl = previewUrl || resume.fileUrl;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Slide-over panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-lg bg-[#04040a] border-l border-white/10 h-full flex flex-col justify-between shadow-2xl z-10"
          >
            {/* Top Navigation */}
            <div className="p-4 border-b border-white/5 bg-[#06060f] flex items-center justify-between">
              <span className="text-[10px] text-zinc-500 font-mono truncate max-w-[250px]">{resume.fileName}</span>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg border border-white/5 hover:border-white/10 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Document Content View */}
            {isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center bg-cyber-dots">
                <Loader2 className="h-8 w-8 text-cyber-cyan animate-spin mb-2" />
                <p className="text-xs text-zinc-500">Decrypting secure document...</p>
              </div>
            ) : error ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-cyber-dots">
                <AlertCircle className="h-8 w-8 text-rose-500 mb-2" />
                <p className="text-xs text-zinc-400 font-semibold">{error}</p>
              </div>
            ) : activeUrl ? (
              <div className="flex-1 p-3 bg-cyber-dots flex flex-col h-full min-h-[500px]">
                <iframe
                  src={activeUrl}
                  className="w-full flex-1 border border-white/10 rounded-xl bg-[#030307]/50 shadow-inner"
                  title={resume.title}
                />
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 bg-cyber-dots">
                {resume.type === "cover-letter" ? (
                  /* Cover Letter Layout */
                  <div className="space-y-6">
                    {/* Sender Info */}
                    <div className="border-b border-white/5 pb-6 text-center md:text-left">
                      <h2 className="text-xl font-bold text-white tracking-tight">John Doe</h2>
                      <p className="text-xs text-cyber-purple font-semibold mt-0.5">Applicant Cover Letter</p>

                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px] text-zinc-400">
                        <span className="flex items-center justify-center md:justify-start gap-1.5">
                          <Mail className="h-3 w-3 text-zinc-500" />
                          john.doe@resumevault.com
                        </span>
                        <span>Phone: +1 (555) 019-2834</span>
                        <span>Address: San Francisco, CA</span>
                        <span className="text-zinc-500">Vault ID: {resume.id}</span>
                      </div>
                    </div>

                    {/* Letter Details */}
                    <div className="text-[11px] text-zinc-400 space-y-1">
                      <p className="font-semibold text-white">Date: June 11, 2026</p>
                      <p className="mt-4 text-zinc-300 font-semibold">To: Hiring Manager</p>
                      <p className="text-zinc-500">Subject: Application for {resume.title}</p>
                    </div>

                    {/* Letter Body */}
                    <div className="space-y-4 text-xs text-zinc-300 leading-relaxed font-sans pt-2">
                      <p>Dear Hiring Manager,</p>
                      <p>
                        I am writing to express my enthusiastic interest in the professional opportunities within your organization. Having followed your company's growth, I am inspired by your commitment to innovation and technical excellence.
                      </p>
                      <p>
                        In my previous roles, I have focused on solving complex workflow problems, building high-performance systems, and collaborating with cross-functional teams to deliver stable, user-first applications. My goal is to apply these experiences directly to support your team's objectives.
                      </p>
                      <p>
                        This Cover Letter and my corresponding CV have been securely archived and synced via ResumeVault. I would welcome the opportunity to discuss my qualifications and how my background aligns with your current hiring goals.
                      </p>
                      <p className="pt-4">Sincerely,</p>
                      <p className="font-bold text-white">John Doe</p>
                    </div>
                  </div>
                ) : (
                  /* CV Resume Layout */
                  <>
                    {/* Header Profile */}
                    <div className="text-center md:text-left border-b border-white/5 pb-6">
                      <h2 className="text-2xl font-bold text-white tracking-tight">John Doe</h2>
                      <h3 className="text-sm font-semibold text-cyber-cyan mt-1">{resume.title}</h3>

                      {/* Contact grid */}
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-zinc-400">
                        <span className="flex items-center justify-center md:justify-start gap-1.5">
                          <Mail className="h-3.5 w-3.5 text-zinc-500" />
                          john.doe@resumevault.com
                        </span>
                        <span className="flex items-center justify-center md:justify-start gap-1.5">
                          <Phone className="h-3.5 w-3.5 text-zinc-500" />
                          +1 (555) 019-2834
                        </span>
                        <span className="flex items-center justify-center md:justify-start gap-1.5">
                          <Globe className="h-3.5 w-3.5 text-zinc-500" />
                          linkedin.com/in/johndoe
                        </span>
                        <span className="text-zinc-500 text-[10px]">Vault ID: {resume.id}</span>
                      </div>
                    </div>

                    {/* Professional Summary */}
                    <div>
                      <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Professional Profile</h4>
                      <p className="text-xs text-zinc-300 leading-relaxed">
                        Highly motivated and results-driven professional. Proven history of optimizing execution frameworks, working collaboratively within cross-functional teams, and executing solutions to complex challenges.
                      </p>
                    </div>

                    {/* Work Experience */}
                    <div>
                      <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <Briefcase className="h-3.5 w-3.5 text-cyber-purple" />
                        Professional Experience
                      </h4>
                      <div className="space-y-4">
                        <div className="border-l-2 border-white/5 pl-4 relative">
                          <div className="absolute h-2 w-2 rounded-full bg-cyber-purple -left-[5px] top-1.5" />
                          <div className="flex items-start justify-between text-xs">
                            <div>
                              <h5 className="font-bold text-white leading-none">Senior Specialist</h5>
                              <span className="text-[10px] text-zinc-400 mt-1 block">TechScale Solutions</span>
                            </div>
                            <span className="text-[9px] text-zinc-500 font-semibold">2024 - Present</span>
                          </div>
                          <ul className="mt-2 space-y-1.5 list-disc list-outside pl-3.5 text-[11px] text-zinc-400 leading-relaxed">
                            <li>Architected core application optimizations, increasing rendering performance by 35%.</li>
                            <li>Orchestrated container deployments, handling over 2M daily API queries.</li>
                            <li>Mentored team members in project design and microservice practices.</li>
                          </ul>
                        </div>

                        <div className="border-l-2 border-white/5 pl-4 relative">
                          <div className="absolute h-2 w-2 rounded-full bg-cyber-purple -left-[5px] top-1.5" />
                          <div className="flex items-start justify-between text-xs">
                            <div>
                              <h5 className="font-bold text-white leading-none">Associate Specialist</h5>
                              <span className="text-[10px] text-zinc-400 mt-1 block">CloudFlow Inc</span>
                            </div>
                            <span className="text-[9px] text-zinc-500 font-semibold">2021 - 2024</span>
                          </div>
                          <ul className="mt-2 space-y-1.5 list-disc list-outside pl-3.5 text-[11px] text-zinc-400 leading-relaxed">
                            <li>Implemented checkout platforms and real-time user notification dashboards.</li>
                            <li>Overhauled search indexes, reducing lookup latencies by 20%.</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Education */}
                    <div>
                      <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <GraduationCap className="h-3.5 w-3.5 text-cyber-cyan" />
                        Education
                      </h4>
                      <div className="border-l-2 border-white/5 pl-4 relative text-xs">
                        <div className="absolute h-2 w-2 rounded-full bg-cyber-cyan -left-[5px] top-1.5" />
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-bold text-white">B.S. in Computer Science & Engineering</h5>
                            <span className="text-[10px] text-zinc-400 mt-0.5 block">Stanford University</span>
                          </div>
                          <span className="text-[9px] text-zinc-500 font-semibold">Graduated 2020</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Bottom Controls */}
            <div className="p-4 border-t border-white/5 bg-[#06060f] flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 rounded-lg border border-white/10 bg-white/5 py-2.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              >
                Close Preview
              </button>
              <button
                onClick={handleDownload}
                disabled={!resume}
                className="flex-grow flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-cyber-indigo to-cyber-purple py-2.5 text-xs font-bold text-white shadow-md shadow-cyber-indigo/15 hover:scale-[1.01] transition-all cursor-pointer active:scale-98 disabled:opacity-50"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
