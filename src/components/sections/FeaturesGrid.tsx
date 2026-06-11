"use client";

import { motion, Variants } from "framer-motion";
import { Layers, Cpu, Infinity as InfinityIcon, ShieldAlert, Share2, FileSpreadsheet } from "lucide-react";

export default function FeaturesGrid() {
  const features = [
    {
      title: "Centralized Vault Storage",
      description: "Keep all your CVs and resumes in one secure cloud location. Easily upload, sort, and manage your files on any device.",
      icon: Layers,
      color: "from-blue-500/10 to-indigo-500/10 border-indigo-500/20 text-indigo-400",
    },
    {
      title: "Fast Cloud Retrieval",
      description: "Scaffolded with high-speed download tunnels. Sync your files instantly and fetch your PDF or Word documents in milliseconds.",
      icon: Cpu,
      color: "from-cyan-500/10 to-blue-500/10 border-cyan-500/20 text-cyber-cyan",
    },
    {
      title: "Infinite Storage Quotas",
      description: "No limitations on file updates, backup counts, or download numbers. Free forever for students and job seekers.",
      icon: InfinityIcon,
      color: "from-purple-500/10 to-pink-500/10 border-purple-500/20 text-cyber-purple",
    },
    {
      title: "AES-256 Vault Encryption",
      description: "Your document metadata, personal details, and work histories are secured via military-grade cloud encryption.",
      icon: ShieldAlert,
      color: "from-red-500/10 to-orange-500/10 border-red-500/20 text-rose-400",
    },
    {
      title: "Quick Share Links",
      description: "Generate time-restricted, public read-only links to securely share specific resumes with recruiters or hiring managers.",
      icon: Share2,
      color: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20 text-cyber-emerald",
    },
    {
      title: "Resume Templates (Soon)",
      description: "Get access to premium, ATS-compliant layouts to bootstrap your professional portfolio within seconds.",
      icon: FileSpreadsheet,
      color: "from-amber-500/10 to-yellow-500/10 border-amber-500/20 text-amber-400",
    },
  ];

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <section id="features" className="py-24 md:py-32 relative overflow-hidden bg-[#030307]">
      {/* Background glow highlights */}
      <div className="absolute top-1/2 left-1/3 -z-10 h-72 w-72 rounded-full bg-cyber-indigo/5 blur-[100px]" />
      <div className="absolute bottom-10 right-1/4 -z-10 h-80 w-80 rounded-full bg-cyber-purple/5 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="mx-auto max-w-3xl text-center mb-20">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Engineered for <span className="text-gradient-cyan-indigo">Secure File Management</span>
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            A clean, high-security cloud repository for your career credentials, tailored to modern job searches.
          </p>
        </div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {features.map((feature) => (
            <motion.div
              variants={cardVariants}
              key={feature.title}
              className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between border border-white/5 bg-slate-900/10"
            >
              <div>
                {/* Icon wrapper */}
                <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br border mb-5 ${feature.color.split(" ").slice(0, 3).join(" ")}`}>
                  <feature.icon className={`h-5 w-5 ${feature.color.split(" ").slice(-1)[0]}`} />
                </div>

                <h3 className="text-base font-bold text-white tracking-tight">{feature.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">{feature.description}</p>
              </div>

              {/* Decorative line highlight */}
              <div className="mt-6 h-0.5 w-12 rounded bg-zinc-800 transition-all duration-300 group-hover:w-full group-hover:bg-gradient-to-r group-hover:from-cyber-indigo group-hover:to-cyber-cyan" />
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
