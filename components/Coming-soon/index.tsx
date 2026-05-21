"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
// import { Input } from "@/components/ui/input";
import { Input } from "../ui/input";
import { Button } from "@/components/ui/button";
import { Instagram, Linkedin, Facebook } from "lucide-react";
import Link from "next/link";


interface SoonProps {
  title?: string;
  description?: string;
}

export default function Comingsoon({ title }:SoonProps) {
  return (
    <main className="relative min-h-screen bg-[#94B6FF] font-brand overflow-hidden text-white flex flex-col items-center">
      
      {/* 1. LOGO: Centered at the top */}
      <motion.div 
         initial={{ opacity: 0, y: -20 }} 
         animate={{ opacity: 1, y: 0 }}
         className="relative z-40 w-64 h-28 md:w-80 md:h-36 mt-12 mb-4 lg:mb-0"
      >
        <Image 
          src="/muveusa.svg" 
          alt="Muve Logo" 
          fill 
          className="object-contain" 
          priority
        />
      </motion.div>

      {/* Main Layout Grid */}
      <div className="relative z-10 w-full flex-grow grid grid-cols-1 lg:grid-cols-2 items-stretch">
        
        {/* LEFT SIDE: Pattern + Hero Image */}
        <div className="relative order-2 lg:order-1 flex items-end justify-start">
          
          {/* THE PATTERN: Anchored Top-Left */}
          <div className="absolute -left-10 -top-20 w-[110%] h-[110%] opacity-40 pointer-events-none z-0">
            <Image 
              src="/graphics.svg" 
              alt="" 
              fill 
              className="object-contain object-left-top scale-125" 
            />
          </div>

          {/* THE PERSON: Large and flush to bottom/left edges */}
          <motion.div 
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="relative z-30 pointer-events-none w-[100%] mx-[7.5%] sm:w-[110%] sm:mx-[5%] md:w-full md:mx-20  md:-mt-35 lg:w-fit lg:max-w-none mx-auto"
          >
            <Image 
              src={"/nurse.svg"}
              alt="Person"
              width={800}
              height={800}
              className="object-contain"
              priority
            />
          </motion.div>
        </div>

        {/* RIGHT SIDE: Content Column */}
        <div className="relative z-30 order-1 lg:order-2 flex flex-col justify-center px-8 lg:px-20 py-8 lg:py-0">
          <div className="max-w-xl w-full flex flex-col items-center lg:items-start space-y-10">
            
            {/* Headline Group */}
            <div className="space-y-6 text-center lg:text-left">
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-5xl justify-right md:text-[90px] font-lexendBold tracking-tighter leading-[0.85] lg:leading-[0.8]"
              >
                {title ? (
                    title
                  ) : (
                    <>
                New Look,
                </>
          )}
              </motion.h1>

              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-5xl md:text-[90px] text-[#07004C] font-lexendBold tracking-tighter leading-[0.85] lg:leading-[0.8]"
              >
                Same Heart.
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xl md:text-2xl font-lexend opacity-90 text-[#07004C]"
              >
                Transforming care for everyone, everywhere.
              </motion.p>
            </div>

            {/* Subscription Section */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="w-full space-y-8"
            >
              <h3 className="text-[#4C86FF] font-lexendBold text-2xl md:text-3xl text-center lg:text-left tracking-wide">
                New website launching soon!
              </h3>
              
              {/* Subscription Bar - Removed Shadow */}
              <div className="flex w-full max-w-[500px] items-center bg-white rounded-full">
                <Input 
                  type="email" 
                  placeholder="Email" 
                  className="border-none md:text-[20px] font-lexend bg-transparent text-[#A0AEC0] focus-visible:ring-0 placeholder:text-[#CBD5E0] h-10 px-6 text-sm grow" 
                />
                <Button 
                  className="bg-[#00D9DA] md:text-[20px] hover:bg-[#00C2C3] text-[#3A486E] font-lexendBold rounded-full h-[48px] px-0 shrink-0 text-xs tracking-tight shadow-none"
                >
                  Subscribe
                </Button>
              </div>
            </motion.div>

            {/* Footer / Contact Details */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="w-full pt-2 flex flex-col md:flex-row items-center justify-between gap-4"
            >
              <div className="flex flex-wrap justify-center lg:justify-start gap-12">
                <div className="text-center lg:text-left space-y-1">
                  <p className="text-[15px] font-lexendBold uppercase text-white">Email</p>
                  <p className="text-md font-medium">info@muvehealthcare.com</p>
                </div>
                <div className="text-center lg:text-left space-y-1">
                  <p className="text-[15px] font-black uppercase text-brand-aqua">Phone</p>
                  <p className="text-md font-medium">(346) 250-6655</p>
                </div>
              </div>

              {/* Social Icons - Removed Background and Shadow */}
              <div className="flex gap-4">
                {[Linkedin, Instagram, Facebook].map((Icon, idx) => (
                  <div key={idx} className="p-2 transition-all cursor-pointer hover:text-brand-aqua">
                    <Icon className="w-5 h-5" />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Apply for Role*/}
            <div className="flex w-full justify-end pb-10">
              <Link href="https://www.cognitoforms.com/ICare24Group1/MUVEHealthcareUSASHORTAPPLY" target="_blank" rel="noopener noreferrer">
                <Button 
                  className="bg-[#4C86FF] md:text-[16px] hover:bg-[#00C2C3] text-[#fff] font-lexendBold rounded-full h-[38px] w-[200px] px-2 shrink-0 text-xs tracking-tight shadow-none"
                >
                  Apply for a role
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
