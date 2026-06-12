"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, FileText, Download, Check, RefreshCw, Star, HardDrive } from "lucide-react";

interface MockResume {
  id: string;
  name: string;
  size: string;
  updatedAt: string;
}

const MOCK_VAULT_FILES: MockResume[] = [
  { id: "v1", name: "Senior_Developer_Resume.pdf", size: "2.4 MB", updatedAt: "10 mins ago" },
  { id: "v2", name: "Product_Designer_Portfolio.pdf", size: "5.2 MB", updatedAt: "3 days ago" },
  { id: "v3", name: "Product_Manager_CV.pdf", size: "2.1 MB", updatedAt: "1 hr ago" },
  { id: "v4", name: "Growth_Lead_CV.pdf", size: "1.5 MB", updatedAt: "Yesterday" }
];

export default function VaultShowcase() {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadSuccessId, setDownloadSuccessId] = useState<string | null>(null);
  const [totalUploads, setTotalUploads] = useState(12);

  // Uploader Simulator States
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value && e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const processFile = (file: File) => {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1) + " MB";
    setUploadedFile({ name: file.name, size: sizeInMB });
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setIsDone(true);
          setTotalUploads((prevTotal) => prevTotal + 1);
          return 100;
        }
        return prev + 10;
      });
    }, 120);
  };

  const resetUploader = () => {
    setUploadedFile(null);
    setUploadProgress(0);
    setIsUploading(false);
    setIsDone(false);
  };

  const handleDownload = (id: string) => {
    setDownloadingId(id);
    setTimeout(() => {
      setDownloadingId(null);
      setDownloadSuccessId(id);
      setTimeout(() => {
        setDownloadSuccessId(null);
      }, 2000);
    }, 1500);
  };

  return (
    <section id="showcase" className="relative py-24 md:py-32 bg-[#04040a] border-t border-b border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Interactive <span className="text-gradient-cyan-indigo">Vault Simulator</span>
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            Preview resumes stored in the mock vault, simulate lightning-fast secure downloads, or upload your own to test the cloud storage progress.
          </p>
        </div>

        {/* Dashboard Frame */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: File Listing (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md p-6 shadow-xl relative overflow-hidden">
            {/* Top glass reflection */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            
            <div>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <HardDrive className="h-5 w-5 text-cyber-cyan" />
                    Vault Index Browser
                  </h3>
                  <p className="text-xs text-zinc-400">Total uploaded files: {totalUploads} items</p>
                </div>
              </div>

              {/* Document Lists */}
              <div className="space-y-3 min-h-[200px] mt-4">
                <div className="space-y-3">
                  {MOCK_VAULT_FILES.map((resume) => (
                    <div
                      key={resume.id}
                      className="flex items-center justify-between rounded-xl bg-white/5 border border-white/5 p-4 hover:bg-white/10 hover:border-white/10 transition-all group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyber-indigo/15 border border-cyber-indigo/35 text-cyber-indigo group-hover:bg-cyber-indigo/20">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-white tracking-tight truncate">{resume.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-zinc-400">{resume.size}</span>
                            <span className="h-1 w-1 rounded-full bg-zinc-600" />
                            <span className="text-[10px] text-zinc-500">{resume.updatedAt}</span>
                          </div>
                        </div>
                      </div>

                      {/* Download CTA */}
                      <button
                        onClick={() => handleDownload(resume.id)}
                        disabled={downloadingId !== null}
                        className="flex h-8 px-3 items-center gap-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border border-white/10 text-zinc-300 hover:text-white hover:bg-white/5 active:scale-95"
                      >
                        {downloadingId === resume.id ? (
                          <>
                            <RefreshCw className="h-3 w-3 animate-spin text-cyber-cyan" />
                            Fetching...
                          </>
                        ) : downloadSuccessId === resume.id ? (
                          <>
                            <Check className="h-3 w-3 text-cyber-emerald" />
                            Saved!
                          </>
                        ) : (
                          <>
                            <Download className="h-3.5 w-3.5 group-hover:translate-y-0.5 transition-transform" />
                            Download
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Simulated stats footer */}
            <div className="border-t border-white/5 pt-6 mt-6 flex justify-between items-center text-xs text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5 text-cyber-cyan" />
                Active Session downloads: Unlimited
              </span>
              <span className="text-zinc-500">Security protocol: AES-256</span>
            </div>
          </div>

          {/* Right Column: Uploader Simulator (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md p-6 shadow-xl relative overflow-hidden">
            {/* Top glass reflection */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            
            <div className="h-full flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
                  <UploadCloud className="h-5 w-5 text-cyber-purple" />
                  Secure Upload Simulator
                </h3>
                <p className="text-xs text-zinc-400 mb-6">Verify instant file indexing speed</p>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInput}
                accept=".pdf,.doc,.docx"
                className="hidden"
              />

              {!uploadedFile ? (
                /* Empty / Drop state */
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={triggerFileInput}
                  className={`flex-1 min-h-[260px] flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all ${
                    dragActive
                      ? "border-cyber-purple bg-cyber-purple/5"
                      : "border-white/10 hover:border-cyber-indigo/40 hover:bg-white/[0.02]"
                  }`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-zinc-400 mb-4 border border-white/5">
                    <UploadCloud className="h-6 w-6" />
                  </div>
                  <h4 className="text-sm font-semibold text-white">Drag & drop your resume file</h4>
                  <p className="text-xs text-zinc-500 mt-1 max-w-[200px]">PDF, DOC, or DOCX formats accepted up to 10MB</p>
                  <button className="mt-4 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/10 transition-all">
                    Choose File
                  </button>
                </div>
              ) : (
                /* Active / Uploading / Done states */
                <div className="flex-1 flex flex-col justify-center rounded-xl border border-white/5 bg-white/[0.02] p-5 relative overflow-hidden">
                  
                  {/* File meta header */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyber-purple/10 border border-cyber-purple/30 text-cyber-purple">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{uploadedFile.name}</h4>
                      <p className="text-[10px] text-zinc-500">{uploadedFile.size}</p>
                    </div>
                  </div>

                  {/* Progressive States */}
                  <div className="mt-6 flex-1 flex flex-col justify-center">
                    {isUploading && (
                      <div>
                        <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 mb-2">
                          <span>Securing cloud upload...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-cyber-indigo to-cyber-purple transition-all duration-100" style={{ width: `${uploadProgress}%` }} />
                        </div>
                      </div>
                    )}

                    {isDone && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center gap-1.5 text-xs font-bold text-cyber-emerald">
                          <Check className="h-4 w-4 bg-cyber-emerald/10 rounded border border-cyber-emerald/20 p-0.5" />
                          Successfully Uploaded to Cloud Vault!
                        </div>
                        <p className="text-[11px] text-zinc-400 leading-relaxed">
                          Your CV file has been securely synced and encrypted in our repository. You can now access it anytime.
                        </p>
                      </motion.div>
                    )}
                  </div>

                  {/* Action Reset Button */}
                  <div className="mt-6 border-t border-white/5 pt-4 flex justify-end">
                    <button
                      onClick={resetUploader}
                      disabled={isUploading}
                      className="rounded-lg border border-white/10 bg-white/5 py-1.5 px-3 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                    >
                      Clear & Upload Another
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
