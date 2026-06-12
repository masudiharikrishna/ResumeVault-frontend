"use client";

import { useState } from "react";
import { 
  FileText, Download, Share2, Trash2, Eye, Check, Mail 
} from "lucide-react";
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

interface ResumeCardProps {
  resume: ResumeData;
  onPreview: (resume: ResumeData) => void;
  onDelete: (id: string) => void;
}

export default function ResumeCard({ resume, onPreview, onDelete }: ResumeCardProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  const authState = useSelector((state: RootState) => state.AuthReducer);
  const token = authState.userData?.token;

  const handleDownload = () => {
    if (!resume.s3Key && !resume.fileUrl) {
      alert("Download not available for demo items");
      return;
    }

    setDownloading(true);

    if (resume.fileUrl) {
      const link = document.createElement("a");
      link.href = resume.fileUrl;
      link.download = resume.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloading(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2000);
      return;
    }

    if (!token) {
      alert("Session expired. Please log in again.");
      setDownloading(false);
      return;
    }

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
        
        setDownloading(false);
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to download document", err);
        alert("Failed to download secure document. Please try again.");
        setDownloading(false);
      });
  };

  const handleShare = () => {
    try {
      navigator.clipboard.writeText(`https://resumevault.com/s/${resume.id}`);
      setSharing(true);
      setTimeout(() => {
        setSharing(false);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2500);
      }, 1200);
    } catch (err) {
      console.error("Failed to copy link to clipboard", err);
    }
  };

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl border border-white/5 bg-slate-900/10 p-5 flex flex-col justify-between relative overflow-hidden group">
      
      {/* Top reflection line */}
      <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-white/5 to-transparent" />

      <div>
        {/* Title & File Icon */}
        <div className="flex items-center gap-2.5">
          <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${
            resume.type === "cover-letter"
              ? "bg-cyber-purple/10 border border-cyber-purple/20 text-cyber-purple"
              : "bg-cyber-indigo/10 border border-cyber-indigo/20 text-cyber-indigo"
          }`}>
            {resume.type === "cover-letter" ? (
              <Mail className="h-4.5 w-4.5" />
            ) : (
              <FileText className="h-4.5 w-4.5" />
            )}
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-white tracking-tight truncate max-w-47.5">
              {resume.title}
            </h4>
            <span className="text-[9px] text-zinc-500 font-semibold block uppercase tracking-wider">
              {resume.type === "cover-letter" ? "Cover Letter File" : "Document Vault CV"}
            </span>
          </div>
        </div>


        {/* File Meta */}
        <div className="mt-5 space-y-1.5 text-[10px] text-zinc-500">
          <div className="flex justify-between">
            <span>File Name:</span>
            <span className="text-zinc-400 truncate max-w-37.5 font-mono">{resume.fileName}</span>
          </div>
          <div className="flex justify-between">
            <span>File Size:</span>
            <span className="text-zinc-400">{resume.size}</span>
          </div>
          <div className="flex justify-between">
            <span>Uploaded:</span>
            <span className="text-cyber-cyan font-medium">{resume.updatedAt}</span>
          </div>
        </div>
      </div>

      {/* Action panel */}
      <div className="mt-6 pt-4 border-t border-white/5 grid grid-cols-3 gap-2 items-center text-center">
        {/* Preview */}
        <button
          onClick={() => onPreview(resume)}
          title="Preview Document Details"
          className="flex h-8 items-center justify-center rounded-lg border border-white/5 hover:border-white/15 hover:bg-white/5 text-zinc-400 hover:text-white transition-all cursor-pointer"
        >
          <Eye className="h-4 w-4" />
        </button>

        {/* Download */}
        <button
          onClick={handleDownload}
          disabled={downloading}
          title="Download PDF"
          className="flex h-8 items-center justify-center rounded-lg border border-white/5 hover:border-white/15 hover:bg-white/5 text-zinc-400 hover:text-white transition-all cursor-pointer disabled:opacity-50"
        >
          {downloading ? (
            <div className="h-3.5 w-3.5 border-t border-r border-cyber-cyan animate-spin rounded-full" />
          ) : downloadSuccess ? (
            <Check className="h-4 w-4 text-cyber-emerald" />
          ) : (
            <Download className="h-4 w-4" />
          )}
        </button>


        {/* Delete */}
        <button
          onClick={() => onDelete(resume.id)}
          title="Delete Permanent"
          className="flex h-8 items-center justify-center rounded-lg border border-white/5 hover:border-rose-500/30 hover:bg-rose-500/5 text-zinc-500 hover:text-rose-400 transition-all cursor-pointer"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Share Toast Popup */}
      {shareSuccess && (
        <div className="absolute top-2 inset-x-2 bg-cyber-emerald/90 text-white text-[9px] font-bold text-center py-1 rounded border border-cyber-emerald shadow-lg backdrop-blur z-20">
          Link copied to clipboard!
        </div>
      )}
    </div>
  );
}
