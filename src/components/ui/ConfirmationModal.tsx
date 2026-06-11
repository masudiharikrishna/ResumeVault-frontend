"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, AlertTriangle, Info, X } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: "danger" | "warning" | "info";
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  type = "info",
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  
  // Icon and button color configurations based on modal type
  const typeConfigs = {
    danger: {
      icon: AlertCircle,
      iconColor: "text-rose-400 bg-rose-500/10 border-rose-500/20",
      confirmBtn: "bg-gradient-to-r from-rose-500 to-red-600 shadow-rose-500/15 hover:shadow-rose-500/25 text-white",
    },
    warning: {
      icon: AlertTriangle,
      iconColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      confirmBtn: "bg-gradient-to-r from-amber-500 to-orange-600 shadow-amber-500/15 hover:shadow-amber-500/25 text-white",
    },
    info: {
      icon: Info,
      iconColor: "text-cyber-cyan bg-cyber-cyan/10 border-cyber-cyan/20",
      confirmBtn: "bg-gradient-to-r from-cyber-indigo to-cyber-cyan shadow-cyber-indigo/15 hover:shadow-cyber-indigo/25 text-white",
    },
  };

  const config = typeConfigs[type] || typeConfigs.info;
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="glass-panel w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 p-5 shadow-2xl relative"
          >
            {/* Top close button */}
            <button
              onClick={onCancel}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            {/* Content Row */}
            <div className="flex gap-4 items-start">
              {/* Type Icon */}
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${config.iconColor}`}>
                <Icon className="h-5 w-5" />
              </div>

              {/* Text */}
              <div className="space-y-1.5 flex-1 min-w-0 pr-4">
                <h3 className="text-sm font-bold text-white tracking-tight leading-none">
                  {title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {message}
                </p>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="mt-6 pt-4 border-t border-white/5 flex justify-end gap-2.5">
              <button
                onClick={onCancel}
                className="rounded-lg border border-white/10 bg-white/5 py-1.5 px-3.5 text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                className={`rounded-lg py-1.5 px-4 text-xs font-bold shadow-md transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer ${config.confirmBtn}`}
              >
                {confirmLabel}
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
