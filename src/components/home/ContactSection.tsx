"use client";

/**
 * Contact Section Component
 * Displays contact form on home page with scroll animation
 * @module components/home/ContactSection
 */

import { ContactForm } from "@/components/ContactForm";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".contact-form-animate", {
        scrollTrigger: {
          trigger: ".contact-form-animate",
          start: "top 80%",
          toggleActions: "play none none none",
        },
        opacity: 0.3,
        y: 20,
        duration: 0.4,
        ease: "power2.out",
      });
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="connect"
      className="w-full py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto contact-form-animate">
        <ContactForm 
          title="Let's Connect"
          description="Have a question or want to discuss something? Send me a message!"
          showCard={true}
        />
      </div>
    </section>
  );
}
