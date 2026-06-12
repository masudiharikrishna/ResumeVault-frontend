"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown } from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import VaultShowcase from "@/components/sections/VaultShowcase";
import FeaturesGrid from "@/components/sections/FeaturesGrid";
import Footer from "@/components/sections/Footer";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Is ResumeVault really free to use?",
    answer: "Yes, absolutely! ResumeVault is 100% free for students and job seekers. You can upload and download your resumes an unlimited number of times without any limits or hidden fees.",
  },
  {
    question: "How secure is my personal information?",
    answer: "Security is our top priority. All uploaded documents are stored in secure cloud buckets and encrypted using AES-256 protocols. Your files are private and only accessible by you.",
  },
  {
    question: "Can I upload multiple resumes and CVs?",
    answer: "Yes, you can upload as many files and drafts as you need to stay organized and prepare for different job applications.",
  },
  {
    question: "What file formats are supported?",
    answer: "We support PDF, DOCX, and DOC document formats up to 10MB per file.",
  },
];

export default function Home() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#030307] text-[#f8fafc] overflow-x-hidden font-sans">
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <HeroSection />

        {/* Interactive Showcase Section */}
        <VaultShowcase />

        {/* Features Grid Section */}
        <FeaturesGrid />

        {/* FAQ Section */}
        <section id="faq" className="py-24 md:py-32 bg-[#04040a] relative border-t border-white/5">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            {/* FAQ Header */}
            <div className="text-center mb-16 flex flex-col items-center">
              <HelpCircle className="h-8 w-8 text-cyber-cyan mb-3" />
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Frequently Asked <span className="text-gradient-cyan-indigo">Questions</span>
              </h2>
              <p className="mt-4 text-sm text-zinc-400">
                Everything you need to know about ResumeVault security, downloads, and version features.
              </p>
            </div>

            {/* Accordion List */}
            <div className="space-y-4">
              {FAQ_ITEMS.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={faq.question}
                    className="glass-panel rounded-2xl border border-white/5 overflow-hidden transition-all duration-300"
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full flex items-center justify-between p-5 text-left font-semibold text-white hover:bg-white/[0.02] transition-colors cursor-pointer"
                    >
                      <span className="text-sm md:text-base">{faq.question}</span>
                      <ChevronDown
                        className={`h-5 w-5 text-zinc-400 transition-transform duration-300 ${
                          isOpen ? "rotate-180 text-cyber-cyan" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="p-5 pt-0 text-xs md:text-sm text-zinc-400 leading-relaxed border-t border-white/5 bg-black/10">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
