"use client";

import Hero from "@/components/Home/Hero";
import Path from "@/components/Home/PathCare";
import WorkWithUs from "@/components/Home/Workwithus";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#a9b9d3]">
      <Hero />
      <Path/>
      <WorkWithUs/>
    </main>
  );
}