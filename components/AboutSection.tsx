"use client";

import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { Camera, Zap, Shield, Globe } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function CountUp({ value }: { value: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  // Parse number from string (e.g. "12K+" -> 12)
  const numericValue = parseInt(value) || 0;
  const suffix = value.replace(/[0-9]/g, '');

  const spring = useSpring(0, {
    mass: 1,
    stiffness: 80,
    damping: 30,
  });

  const display = useTransform(spring, (current) => 
    Math.floor(current).toLocaleString() + suffix
  );

  useEffect(() => {
    if (isInView) {
      spring.set(numericValue);
    }
  }, [isInView, spring, numericValue]);

  return <motion.span ref={ref}>{display}</motion.span>;
}

const features = [
  {
    name: "Ultra High Resolution",
    description: "Experience photography in its purest form with support for 4K and 8K resolutions, optimized for every screen.",
    icon: Camera,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
  },
  {
    name: "Lightning Fast",
    description: "Our global CDN ensures that your high-res downloads are available instantly, no matter where you are.",
    icon: Zap,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    name: "Secure & Reliable",
    description: "Every image is verified and processed through our secure pipeline to ensure the highest quality standards.",
    icon: Shield,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    name: "Global Curation",
    description: "We work with top-tier photographers worldwide to bring you a truly diverse and premium collection.",
    icon: Globe,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="relative overflow-hidden bg-white py-32 dark:bg-zinc-950 transition-colors duration-300">
      <div className="relative mx-auto max-w-[1600px] px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row gap-20 items-center">
          <div className="lg:w-1/2">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-sm font-semibold text-zinc-400 uppercase tracking-[0.3em] mb-6"
            >
              The Studio
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl font-semibold tracking-tight text-zinc-900 dark:text-white leading-[1.1] italic font-serif"
            >
              Crafting clarity in every <span className="text-zinc-400">pixel</span>.
            </motion.p>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-8 text-xl leading-relaxed text-zinc-500 dark:text-zinc-400 font-light"
            >
              Pixlume is a high-fidelity photography platform designed for creators who demand absolute quality. We bridge the gap between artistic vision and production-ready assets.
            </motion.p>
          </div>

          <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-12">
            {features.map((feature, idx) => (
              <motion.div 
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col group"
              >
                <div className="mb-6 h-10 w-10 border border-zinc-200 dark:border-white/10 rounded-xl flex items-center justify-center text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">{feature.name}</h3>
                <p className="text-zinc-500 dark:text-zinc-400 font-light leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Minimal Stats */}
        <div className="mt-40 border-t border-zinc-100 dark:border-white/5 pt-20">
             <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center lg:text-left">
                 {[
                     { label: 'High-Res Assets', value: '12K+' },
                     { label: 'Active Creators', value: '50K+' },
                     { label: 'Monthly Traffic', value: '1M+' },
                     { label: 'Featured Artists', value: '500+' },
                 ].map((stat, idx) => (
                     <motion.div 
                        key={stat.label}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 * idx }}
                        className="flex flex-col gap-y-2"
                     >
                         <div className="text-4xl font-semibold tracking-tighter text-zinc-900 dark:text-white font-serif italic">
                            <CountUp value={stat.value} />
                         </div>
                         <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{stat.label}</div>
                     </motion.div>
                 ))}
             </div>
        </div>
      </div>
    </section>

  );
}
