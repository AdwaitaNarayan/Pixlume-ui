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
    <section id="about" className="relative overflow-hidden bg-white py-24 dark:bg-zinc-950 sm:py-32 transition-colors duration-300">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 blur-3xl opacity-20 dark:opacity-10 pointer-events-none">
        <div className="h-[40rem] w-[40rem] rounded-full bg-cyan-500" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-base font-semibold leading-7 text-cyan-600 dark:text-cyan-400 uppercase tracking-widest"
          >
            About Pixlume
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 30, scale: 0.98, letterSpacing: "-0.01em" }}
            whileInView={{ opacity: 1, y: 0, scale: 1, letterSpacing: "0em" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="mt-2 text-3xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-5xl"
          >
            Crafting the Future of Digital Imagery
          </motion.p>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400"
          >
            Pixlume was founded on a simple principle: high-resolution photography should be accessible, manageable, and breathtakingly beautiful. We provide a state-of-the-art platform for photographers and digital artists to showcase their work in stunning 4K detail.
          </motion.p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            {features.map((feature, idx) => (
              <motion.div 
                key={feature.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col group"
              >
                <dt className="text-base font-semibold leading-7 text-zinc-900 dark:text-white">
                  <div className={`mb-6 flex h-12 w-12 items-center justify-center rounded-2xl ${feature.bg} ${feature.color} shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-zinc-600 dark:text-zinc-400">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>

        {/* Stats Section */}
        <div className="mt-32 rounded-[3rem] bg-zinc-900 dark:bg-zinc-900/50 p-8 sm:p-12 lg:p-16 relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent" />
             <div className="relative grid grid-cols-1 gap-y-12 gap-x-8 sm:grid-cols-2 lg:grid-cols-4 text-center">
                 {[
                     { label: 'High-Res Images', value: '12000+' },
                     { label: 'Happy Users', value: '50000+' },
                     { label: 'Total Downloads', value: '1000000+' },
                     { label: 'Top Photographers', value: '500+' },
                 ].map((stat, idx) => (
                     <motion.div 
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 * idx, duration: 0.6 }}
                        className="flex flex-col gap-y-2 group"
                     >
                         <div className="text-4xl font-extrabold tracking-tighter text-white group-hover:scale-110 transition-transform duration-500">
                            <CountUp value={stat.value} />
                         </div>
                         <div className="text-xs font-bold text-zinc-400 uppercase tracking-[0.2em]">{stat.label}</div>
                     </motion.div>
                 ))}
             </div>
        </div>
      </div>
    </section>
  );
}
