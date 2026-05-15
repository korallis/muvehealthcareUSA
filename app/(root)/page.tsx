"use client";

import Hero from "@/components/Home/Hero";
import Path from "@/components/Home/PathCare";
import Professionals from "@/components/Home/Professionals";
import Specialities from "@/components/Home/Specialists";
import WorkWithUs from "@/components/Home/Workwithus";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#a9b9d3]">
      <Hero />
      <Path/>
      <WorkWithUs/>
      <Specialities/>
      <Professionals/>
    </main>
  );
}