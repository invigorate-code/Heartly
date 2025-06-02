"use client";

import React from "react";
import { Button } from "@heroui/react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

export const HeroSection: React.FC = () => {
  return (
    <section
      className="h-[calc(100vh-4rem)] flex items-center py-8 md:py-12"
      style={{
        background: `linear-gradient(135deg, rgba(240, 249, 255, 0.9) 0%, rgba(255, 255, 255, 0.9) 50%, rgba(230, 247, 255, 0.9) 100%)`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center">
          <motion.div
            className="md:w-1/2 mb-10 md:mb-0"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6 leading-tight"
              style={{ color: "#171717" }}
            >
              Elevate Your <span style={{ color: "#005591" }}>Care</span>{" "}
              Management
            </h1>
            <p className="text-xl mb-8" style={{ color: "#696969" }}>
              Streamline operations, enhance resident care, and ensure
              compliance with Heartly's innovative ARF/ARTF management platform.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                color="primary"
                size="lg"
                endContent={<ArrowRight className="ml-2" />}
                as={Link}
                href="/sign-up"
                className="font-semibold text-lg px-8 py-6 text-white"
              >
                Start Your Journey
              </Button>
            </motion.div>
          </motion.div>
          <motion.div
            className="md:w-1/2 md:pl-12"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#66cfcf] to-[#005591] rounded-3xl transform rotate-3"></div>
              <Image
                src="/images/mock.png"
                alt="Heartly App Dashboard"
                width={700}
                height={500}
                className="rounded-3xl shadow-2xl relative z-10 w-auto h-auto"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
