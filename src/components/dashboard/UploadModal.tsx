"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UploadCloud, FileText, Check } from "lucide-react";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (newResume: any) => void;
  documentType: "resume" | "cover-letter";
}

export default function UploadModal({ isOpen, onClose, onUploadSuccess, documentType }: UploadModalProps) {

  const [title, setTitle] = useState("");
  const [file, setFile] = useState<{ name: string; size: string } | null>(null);
  
  // File Uploader States
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  
  const [rawFile, setRawFile] = useState<File | null>(null);
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
      startProcessing(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      startProcessing(e.target.files[0]);
    }
  };

  const startProcessing = (fileObj: File) => {
    setRawFile(fileObj);
    const sizeStr = (fileObj.size / (1024 * 1024)).toFixed(1) + " MB";
    setFile({ name: fileObj.name, size: sizeStr });
    
    if (!title) {
      setTitle(fileObj.name.replace(/\.[^/.]+$/, "").replace(/_/g, " "));
    }

    setIsUploading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setIsDone(true);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title || !rawFile) return;

    // Create a local blob URL for high-fidelity browser PDF rendering
    const fileUrl = URL.createObjectURL(rawFile);

    const newResume = {
      id: (documentType === "cover-letter" ? "cov_" : "res_") + Date.now(),
      title: title,
      fileName: file.name,
      size: file.size,
      updatedAt: "Just now",
      type: documentType,
      fileUrl: fileUrl
    };

    onUploadSuccess(newResume);
    handleClose();
  };

  const handleClose = () => {
    setTitle("");
    setFile(null);
    setRawFile(null);
    setProgress(0);
    setIsUploading(false);
    setIsDone(false);
    onClose();
  };


  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={isUploading ? undefined : handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="glass-panel relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 p-6 shadow-2xl md:p-8"
          >
            {/* Background neon glow */}
            <div className="absolute -top-12 -right-12 -z-10 h-32 w-32 rounded-full bg-cyber-purple/20 blur-2xl" />

            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-6">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UploadCloud className="h-5 w-5 text-cyber-cyan" />
                Upload {documentType === "cover-letter" ? "Cover Letter" : "Resume"}
              </h3>
              <button
                disabled={isUploading}
                onClick={handleClose}
                className="text-zinc-400 hover:text-white transition-colors cursor-pointer disabled:opacity-30"
              >
                <X className="h-5 w-5" />
              </button>
            </div>


            <form onSubmit={handleSubmit} className="space-y-4">
              
              {!isUploading && !isDone && (
                <>
                  {/* Title Field */}
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                      {documentType === "cover-letter" ? "Cover Letter Title" : "Resume Title"}
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder={documentType === "cover-letter" ? "e.g. Google Application Letter" : "e.g. Senior Software Architect"}
                      className="w-full rounded-lg bg-black/30 border border-white/10 py-2 px-3 text-xs text-white placeholder-zinc-500 outline-none focus:border-cyber-indigo/50"
                    />
                  </div>

                  {/* Dropzone */}
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                      Select File
                    </label>
                    <div
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`min-h-[160px] flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all ${
                        dragActive
                          ? "border-cyber-purple bg-cyber-purple/5"
                          : "border-white/10 hover:border-cyber-indigo/40 hover:bg-white/[0.02]"
                      }`}
                    >
                      <UploadCloud className="h-8 w-8 text-zinc-500 mb-2" />
                      <span className="text-xs font-semibold text-white">
                        Click or drag {documentType === "cover-letter" ? "cover letter" : "resume"} file here
                      </span>
                      <span className="text-[10px] text-zinc-500 mt-1">PDF, DOCX, or DOC up to 10MB</span>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileInput}
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                      />
                    </div>
                  </div>

                </>
              )}

              {/* Progress States */}
              {(isUploading || isDone) && (
                <div className="border border-white/5 bg-white/[0.02] rounded-xl p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyber-indigo/15 text-cyber-indigo">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{file?.name}</h4>
                      <p className="text-[10px] text-zinc-500">{file?.size}</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    {isUploading && (
                      <div>
                        <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-400 mb-1.5">
                          <span>Uploading file...</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-cyber-indigo to-cyber-purple transition-all duration-100" style={{ width: `${progress}%` }} />
                        </div>
                      </div>
                    )}

                    {isDone && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2 text-xs font-bold text-cyber-emerald"
                      >
                        <Check className="h-4 w-4 bg-cyber-emerald/10 rounded border border-cyber-emerald/20 p-0.5" />
                        Uploaded to Vault successfully!
                      </motion.div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-white/5 flex justify-end gap-3">
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={handleClose}
                  className="rounded-lg border border-white/10 bg-white/5 py-2 px-4 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                {isDone && (
                  <button
                    type="submit"
                    className="rounded-lg bg-gradient-to-r from-cyber-indigo to-cyber-purple py-2 px-4 text-xs font-bold text-white shadow-md shadow-cyber-indigo/15 hover:scale-[1.01] transition-all cursor-pointer active:scale-98"
                  >
                    Add to Vault
                  </button>
                )}
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
