"use client";

/**
 * Contact Section Component
 * Displays contact form on home page
 * @module components/home/ContactSection
 */

import { ContactForm } from "@/components/ContactForm";

export function ContactSection() {
  return (
    <section
      id="connect"
      className="w-full py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto">
        <ContactForm 
          title="Get In Touch"
          description=""
          showCard={true}
        />
      </div>
    </section>
  );
}
