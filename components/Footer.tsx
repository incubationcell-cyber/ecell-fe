'use client';

import Image from 'next/image';
import { Mail, Phone, MapPin, Linkedin, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-sidebar text-sidebar-foreground py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/logo.jpeg"
                alt="E-Cell logo"
                width={36}
                height={36}
                className="w-9 h-9 rounded-md object-cover"
              />
              <span className="font-bold text-xl">E-Cell JEC</span>
            </div>
            <p className="text-sidebar-foreground/80">
              Fostering innovation and entrepreneurial spirit at Jaipur Engineering College.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <div className="space-y-0">
              <a href="#home" className="hover:text-primary transition-colors">
                Home
              </a>
              <a href="#about" className="hover:text-primary transition-colors block">
                About
              </a>
              <a href="#events" className="hover:text-primary transition-colors block">
                Events
              </a>
              <a href="#team" className="hover:text-primary transition-colors block">
                Team
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
            <div className="space-y-3">
              <a href="tel:+917765945408" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Phone className="w-4 h-4" />
                <span>+91 77659 45408</span>
              </a>
              <a href="mailto:incubationcell@jeckukas.org.in" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Mail className="w-4 h-4" />
                <span>incubationcell@jeckukas.org.in</span>
              </a>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Jaipur Engineering College, Jaipur, Rajasthan</span>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="border-t border-sidebar-border pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sidebar-foreground/80 mb-4 md:mb-0">
            © 2026 E-Cell JEC. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="https://www.linkedin.com/company/e-cell-jec-kukas/posts/?feedView=all"
              className="text-sidebar-foreground hover:text-primary transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            {/* <a
              href="#"
              className="text-sidebar-foreground hover:text-primary transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a> */}
            <a
              href="https://www.instagram.com/ecell_jeckukas/"
              className="text-sidebar-foreground hover:text-primary transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
