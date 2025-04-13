"use client";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { motion } from "framer-motion";
import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";
import Image from "next/image";
import { assets } from "./assets";

// Hero Section
const HeroSection = () => {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center text-center bg-white text-black px-4">
      <h1 className="text-5xl font-bold">Jowin John Chemban</h1>
      <p className="text-xl mt-2">
        <strong>IT Infrastructure Engineer</strong>
      </p>
      <p className="text-lg mt-2">
        Systems | Network | Cloud | Security | DevOps
      </p>
      <div className="flex space-x-4 mt-4">
        <a href="https://linkedin.com/in/jowinjohnchemban" target="_blank">
          <FaLinkedin size={30} />
        </a>
        <a href="https://github.com/jowinjohnchemban" target="_blank">
          <FaGithub size={30} />
        </a>
        <a href="mailto:mail@jowinjc.in">
          <FaEnvelope size={30} />
        </a>
      </div>
    </section>
  );
};

// Certifications Section
const Certifications = () => {
  return (
    <section className="py-16 bg-white">
      <h2 className="text-3xl text-center font-bold mb-8">Certifications</h2>
      <div className="flex justify-center space-x-10">
        {assets.map((cert) => (
          <div key={cert.id} className="text-center">
            <Image src={cert.image} alt={cert.alt} width={100} height={100} />
          </div>
        ))}
      </div>
    </section>
  );
};

// Experience Section
const Experience = () => {
  return (
    <section className="py-16 bg-white">
      <h2 className="text-3xl text-center font-bold mb-8">Experience</h2>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h3 className="text-xl font-semibold">
            Security Quotient - Associate IT Infrastructure Engineer
          </h3>
          <p className="text-gray-700">
            Managed IT infrastructure, Linux/Windows servers, cloud
            environments, troubleshooting, security compliance, and collaborated
            with cybersecurity teams.
          </p>
        </div>
        <div className="mb-6">
          <h3 className="text-xl font-semibold">
            Kerala Fibre Optic Network (KFON) - Engineer
          </h3>
          <p className="text-gray-700">
            Managed IT infrastructure, Linux/Windows servers, cloud
            environments, troubleshooting, security compliance, and collaborated
            with cybersecurity teams.
          </p>
        </div>
        <div className="mb-6">
          <h3 className="text-xl font-semibold">
            HashRoot - L1 Server Engineer
          </h3>
          <p className="text-gray-700">
            Provided server support, monitored IT infrastructure, automated
            routine tasks, and optimized system performance.
          </p>
        </div>
      </div>
    </section>
  );
};

// Projects Section
const Projects = () => {
  return (
    <section className="py-16 bg-white">
      <h2 className="text-3xl text-center font-bold mb-8">Projects</h2>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h3 className="text-xl font-semibold">Messenger Project in C++</h3>
          <p className="text-gray-700">
            Developed a LAN messenger using C++ with TCP/IP and file handling.
          </p>
        </div>
        <div className="mb-6">
          <h3 className="text-xl font-semibold">
            Smart Online Shopping System
          </h3>
          <p className="text-gray-700">
            Designed a system to compare product prices across websites.
          </p>
        </div>
      </div>
    </section>
  );
};

// Education Section
const Education = () => {
  return (
    <section className="py-16 bg-white">
      <h2 className="text-3xl text-center font-bold mb-8">Education</h2>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h3 className="text-xl font-semibold">
            B.Tech in Computer Science & Engineering
          </h3>
          <p className="text-gray-700">Completed from XYZ University.</p>
        </div>
      </div>
    </section>
  );
};

// Contact Section
const Contact = () => {
  return (
    <section className="py-16 bg-white">
      <h2 className="text-3xl text-center font-bold mb-8">Contact Me</h2>
      <form className="max-w-md mx-auto">
        <input
          type="text"
          placeholder="Your Name"
          className="w-full p-2 mb-4 border"
        />
        <input
          type="email"
          placeholder="Your Email"
          className="w-full p-2 mb-4 border"
        />
        <textarea
          placeholder="Your Message"
          className="w-full p-2 mb-4 border"
        ></textarea>
        <button className="w-full bg-gray-600 text-white py-2">
          Send Message
        </button>
      </form>
    </section>
  );
};

// Main Page Component
export default function Home() {
  return (
    <main>
      <Analytics />
      <SpeedInsights />
      <HeroSection />
      <Certifications />
      <Experience />
      <Projects />
      <Education />
      <Contact />
    </main>
  );
}
