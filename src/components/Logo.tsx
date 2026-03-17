"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import { variants } from "@/lib/motion";
import { useTheme } from "@/context/ThemeContext";

export default function Logo() {
  const { theme } = useTheme();
  const [hasVisited, setHasVisited] = useState(false);
  const [triggerQuiver, setTriggerQuiver] = useState(false);

  useEffect(() => {
    const visited = localStorage.getItem("farishta-visited");
    setHasVisited(!!visited);
    if (!visited) {
      localStorage.setItem("farishta-visited", "true");
    }

    const handleScroll = () => {
      if (window.scrollY === 0 && window.scrollY !== undefined) {
        setTriggerQuiver(true);
        setTimeout(() => setTriggerQuiver(false), 360);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getLogoSrc = () => {
    switch (theme) {
      case "noor":
        return "/assets/logos/Farista-AI-LOGO-black.png";
      case "adn":
        return "/assets/logos/Farista-AI-LOGO-main.png";
      case "layl":
      default:
        return "/assets/logos/Farista-AI-LOGO-white.png";
    }
  };

  return (
    <motion.div
      variants={variants.logoBloom}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center gap-4 mb-12"
    >
      <motion.div className="relative w-32 h-32 flex items-center justify-center">
        <motion.div
          variants={variants.haloExpand}
          initial="hidden"
          animate="visible"
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)",
            filter: "blur(30px)",
            transform: "scale(1.5)",
          }}
        />
        <motion.div
          className="relative z-10 w-24 h-24"
          whileHover={{ scale: 1.05 }}
          animate={triggerQuiver ? { rotate: [0, 2, -2, 0] } : {}}
          transition={{
            duration: hasVisited ? 0.6 : 1.2,
            ease: [0.2, 0.9, 0.28, 1],
          }}
        >
          <Image
            src={getLogoSrc()}
            alt="Farishta AI Logo"
            fill
            className="object-contain drop-shadow-2xl"
            priority
          />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-center"
      >
        <h1
          className="display-1 font-bold tracking-tight"
          style={{ color: "var(--gold-primary)" }}
        >
          Farishta AI
        </h1>
        <p className="text-sm mt-2" style={{ color: "var(--muted-text)" }}>
          Digital Sukoon — Calm, Sacred, Guided
        </p>
      </motion.div>
    </motion.div>
  );
}
