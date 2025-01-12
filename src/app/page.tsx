"use client";

import Head from 'next/head';
import Link from 'next/link';
import { useEffect } from 'react';
import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  useEffect(() => {
    gsap.from(".fade-in", {
      opacity: 0,
      y: 50,
      duration: 1,
      stagger: 0.2,
      scrollTrigger: {
        trigger: ".fade-in",
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none none",
      },
    });
  }, []);

  return (
    <div>
      <Head>
        <title>Jowin John Chemban - Portfolio</title>
        <meta name="description" content="Portfolio of Jowin John Chemban" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header Section */}
      <header className="bg-gray-900 text-white py-6 px-10 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Jowin John Chemban</h1>
        <nav>
          <ul className="flex space-x-6">
            <li><Link href="/">Home</Link></li>
            <li><a href="https://blog.jowinjc.in" target="_blank" rel="noopener noreferrer">Blog</a></li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="h-screen bg-gradient-to-b from-gray-900 to-gray-700 text-white flex flex-col justify-center items-center text-center">
        <h2 className="text-5xl font-extrabold fade-in">Hi, I’m Jowin!</h2>
        <p className="text-xl mt-4 fade-in">Cybersecurity Enthusiast | IT Infrastructure Engineer | Tech Visionary</p>
        <a
          href="#about"
          className="mt-8 px-6 py-3 bg-blue-600 rounded-full text-lg font-semibold fade-in"
        >
          Learn More
        </a>
      </section>

      {/* Main Portfolio Section */}
      <main className="py-16 px-10 bg-gray-100">
        <section id="about" className="text-center mb-16 fade-in">
          <h2 className="text-5xl font-bold mb-4">About Me</h2>
          <p className="text-lg text-gray-700">I’m a passionate IT Infrastructure Engineer with expertise in server management, cloud environments, and cybersecurity.</p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 fade-in">
          <div className="bg-white shadow-md p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-2">Skills</h3>
            <ul className="list-disc pl-5 text-gray-700">
              <li>Linux & Windows Server Management</li>
              <li>Cloud Environments (AWS, Azure)</li>
              <li>Infrastructure Monitoring</li>
              <li>Cybersecurity Practices</li>
            </ul>
          </div>

          <div className="bg-white shadow-md p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-2">Projects</h3>
            <ul className="list-disc pl-5 text-gray-700">
              <li><strong>Zendir:</strong> A secure TCP communication app in Rust</li>
              <li><strong>ElectroMartGlobal:</strong> E-commerce platform</li>
              <li>Portfolio hosted at <a href="https://jowin.vercel.app" target="_blank" className="text-blue-500">jowin.vercel.app</a></li>
            </ul>
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <footer className="bg-gray-900 text-white py-4 text-center">
        <p>&copy; 2025 Jowin John Chemban. All rights reserved.</p>
      </footer>
    </div>
  );
}
