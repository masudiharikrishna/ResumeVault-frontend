"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { ShieldCheck, FileSpreadsheet, ArrowRight, Download, Layers, Users2 } from "lucide-react";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Motion values for the 3D tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Map mouse positions to rotation degrees
  const rotateX = useTransform(y, [-300, 300], [15, -15]);
  const rotateY = useTransform(x, [-300, 300], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const stats = [
    { label: "Resumes Vaulted", value: "240K+", icon: FileSpreadsheet },
    { label: "Happy Job Seekers", value: "85K+", icon: Users2 },
    { label: "Storage Limit", value: "100 MB", icon: Layers },
  ];

  return (
    <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32 bg-cyber-dots bg-cyber-grid">
      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/2 -z-10 h-125 w-125 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyber-indigo/10 blur-[120px] animate-pulse-slow" />
      <div className="absolute top-1/3 left-1/4 -z-10 h-75 w-75 rounded-full bg-cyber-cyan/10 blur-[100px] animate-pulse-slow" />
      <div className="absolute bottom-10 right-10 -z-10 h-87.5 w-87.5 rounded-full bg-cyber-purple/10 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          
          {/* Left Column: Heading & CTA */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col text-center lg:text-left"
          >
            {/* Pill Banner */}
            <div className="inline-flex items-center self-center lg:self-start gap-2 rounded-full border border-cyber-indigo/30 bg-cyber-indigo/5 px-3.5 py-1 text-xs font-semibold text-cyber-indigo shadow-md shadow-cyber-indigo/5 mb-6">
              <ShieldCheck className="h-4 w-4 text-cyber-cyan animate-pulse" />
              Secure cloud vault for students & job seekers
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl leading-[1.1]">
              Your Resumes. <br />
              <span className="text-gradient-cyan-indigo">Structured. Secured.</span> <br />
              Always Accessible.
            </h1>

            <p className="mt-6 text-lg text-zinc-400 max-w-xl mx-auto lg:mx-0">
              Stop losing track of your application files. Securely upload, download, and share your resumes and CVs anytime. Free forever for students and job seekers.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/signup"
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-cyber-indigo to-cyber-purple py-3.5 px-8 text-sm font-bold text-white shadow-lg shadow-cyber-indigo/25 hover:scale-[1.02] transition-all cursor-pointer active:scale-98"
              >
                Create Free Vault
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#showcase"
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 py-3.5 px-8 text-sm font-semibold text-white hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer active:scale-98"
              >
                Try Vault Simulator
              </a>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-4 border-t border-white/10 pt-8 max-w-lg mx-auto lg:mx-0">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col items-center lg:items-start">
                  <span className="text-2xl font-bold text-white md:text-3xl tracking-tight">
                    {stat.value}
                  </span>
                  <span className="text-[10px] uppercase font-semibold tracking-wider text-zinc-500 text-center lg:text-left mt-1">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: 3D Interactive Card Stack */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center items-center perspective-1000"
          >
            <motion.div
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{ rotateX, rotateY }}
              className="relative preserve-3d w-full max-w-105 aspect-4/5 cursor-grab active:cursor-grabbing flex items-center justify-center"
            >
              {/* Back card */}
              <div className="absolute w-[85%] aspect-[1/1.4] rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-md p-5 shadow-2xl -rotate-6 -translate-x-4 sm:-translate-x-8 -translate-y-2 sm:-translate-y-4 opacity-50 transition-transform duration-300 hover:rotate-0 hover:translate-x-0" />

              {/* Middle card */}
              <div className="absolute w-[88%] aspect-[1/1.4] rounded-2xl border border-white/5 bg-zinc-900/60 backdrop-blur-md p-5 shadow-2xl rotate-3 translate-x-3 sm:translate-x-6 translate-y-1 sm:translate-y-2 opacity-75 transition-transform duration-300 hover:rotate-0 hover:translate-x-0" />

              {/* Main front card */}
              <motion.div
                whileHover={{ translateZ: 40 }}
                className="glass-panel preserve-3d absolute w-[90%] aspect-[1/1.4] rounded-2xl border border-white/15 p-6 shadow-2xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-linear-to-tr from-cyber-cyan to-cyber-indigo flex items-center justify-center text-[10px] font-bold text-white">
                        JD
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white leading-none">John Doe</h4>
                        <span className="text-[9px] text-cyber-cyan leading-none font-semibold">Software Developer</span>
                      </div>
                    </div>
                    <span className="rounded-full bg-cyber-indigo/10 border border-cyber-indigo/20 px-2 py-0.5 text-[8px] font-semibold text-cyber-indigo">
                      Vault CV File
                    </span>
                  </div>

                  {/* Mock content blocks */}
                  <div className="mt-6 space-y-3">
                    <div className="h-1.5 w-1/3 rounded-full bg-white/20" />
                    <div className="h-1.5 w-full rounded-full bg-white/10" />
                    <div className="h-1.5 w-[90%] rounded-full bg-white/10" />
                    <div className="h-1.5 w-[95%] rounded-full bg-white/10" />
                  </div>

                  <div className="mt-5">
                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">Key Competencies</span>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {["React", "Next.js", "TypeScript", "Node.js"].map((tag) => (
                        <span key={tag} className="rounded bg-white/5 border border-white/5 px-2 py-0.5 text-[8px] text-zinc-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom status of card */}
                <div className="border-t border-white/10 pt-4 flex items-center justify-between">
                  <div>
                    <span className="text-[8px] text-zinc-500 uppercase leading-none font-semibold block">File Size</span>
                    <span className="text-[10px] font-bold text-white leading-none">2.4 MB</span>
                  </div>
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
                    <Download className="h-3.5 w-3.5" />
                  </div>
                </div>
              </motion.div>

              {/* Floating Badge 1: Instant Sync */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 -left-2 sm:-left-6 lg:-left-10 glass-panel rounded-xl border border-white/10 py-2 px-3 flex items-center gap-2 shadow-lg z-10"
              >
                <div className="h-5 w-5 rounded-full bg-cyber-cyan/10 flex items-center justify-center">
                  <ShieldCheck className="h-3 w-3 text-cyber-cyan" />
                </div>
                <div>
                  <span className="text-[9px] text-zinc-400 leading-none block font-medium">Backup Status</span>
                  <span className="text-[10px] font-bold text-white leading-none">100% Encrypted</span>
                </div>
              </motion.div>

              {/* Floating Badge 2: Downloads count */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-10 -right-2 sm:-right-6 lg:-right-10 glass-panel rounded-xl border border-white/10 py-2 px-3 flex items-center gap-2 shadow-lg z-10"
              >
                <div className="h-5 w-5 rounded-full bg-cyber-purple/10 flex items-center justify-center">
                  <Download className="h-3 w-3 text-cyber-purple" />
                </div>
                <div>
                  <span className="text-[9px] text-zinc-400 leading-none block font-medium">Monthly Downloads</span>
                  <span className="text-[10px] font-bold text-white leading-none">Unlimited</span>
                </div>
              </motion.div>

            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
