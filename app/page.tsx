"use client";

import { useRef } from "react";
import MainLeft from "@/components/MainLeft";
import Link from "next/link";

import { MapPin, Mail, Building2 } from "lucide-react"; 

export default function Page() {
  const aboutRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const scrollToAbout = () => {
    aboutRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      <div className="flex border-b justify-between mt-3 px-4 items-center bg-white sticky top-0 z-50">
        <img src="/logo.png" alt="logo" className="h-12 w-auto" />
        <div className="pt-1.5 flex gap-4">
          <button 
            onClick={scrollToAbout} 
            className="font-semibold hover:text-blue-600 transition-colors"
          >
            About
          </button>
          
          <button 
            onClick={scrollToContact} 
            className="font-semibold hover:text-blue-600 transition-colors"
          >
            Contact us
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        <div className="flex justify-center px-12 lg:px-25 pt-25 bg-gradient-to-br from-slate-250 to-white">
          <MainLeft />
        </div>
        <div className="hidden lg:flex items-center justify-center">
          <video autoPlay loop muted playsInline className="max-w-xl w-full">
            <source src="/frontpage.mp4" type="video/mp4" />
          </video>
        </div>
      </div>

      <div ref={aboutRef} className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center bg-amber-200 border-0 rounded-xl p-3">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">About BlinkChat</h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            Connect Locally, Chat Anonymously. BlinkChat lets you create 
            location-based chat rooms. Set a radius, invite anyone nearby, and chat freely 
            without revealing your identity. No history, no footprints. chats of every room's 
            vanishes after 2 hours.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 text-left mt-12">
            <div className="p-6 bg-slate-50 rounded-lg">
              <h3 className="font-bold text-xl mb-2">Fast</h3>
              <p className="text-gray-600">Real-time delivery using advanced WebSocket technology.</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-lg">
              <h3 className="font-bold text-xl mb-2">Secure</h3>
              <p className="text-gray-600">Your conversations are private and protected.</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-lg">
              <h3 className="font-bold text-xl mb-2">Simple</h3>
              <p className="text-gray-600">A clean interface that focuses on your chats.</p>
            </div>
          </div>
        </div>
      </div>

      <footer 
        ref={contactRef} 
        className="bg-[#3c3744] text-white py-16"
      >
        <div className="max-w-4xl mx-auto px-5 flex flex-col items-center text-center space-y-8">
          
          <h3 className="text-2xl font-semibold tracking-wide">Contact Us</h3>
          
          <div className="flex flex-col md:flex-row gap-12 items-center justify-center text-left">
            
            {/* Organization Name */}
            <div className="flex flex-col items-center md:items-start gap-2">
              <div className="flex items-center gap-2 text-indigo-300">
                <Building2 className="w-5 h-5" />
                <span className="font-bold text-lg">Organization</span>
              </div>
              <p className="text-gray-300">BlinkChat Inc.</p>
            </div>

            {/* Address */}
            <div className="flex flex-col items-center md:items-start gap-2">
              <div className="flex items-center gap-2 text-indigo-300">
                <MapPin className="w-5 h-5" />
                <span className="font-bold text-lg">Headquarters</span>
              </div>
              <p className="text-gray-300 max-w-xs text-center md:text-left">
                123 Tech Park Avenue,<br />
                Bangalore, Karnataka 560100<br />
                India
              </p>
            </div>

            <div className="flex flex-col items-center md:items-start gap-2">
              <div className="flex items-center gap-2 text-indigo-300">
                <Mail className="w-5 h-5" />
                <span className="font-bold text-lg">Email</span>
              </div>
              <div className="text-gray-300 flex flex-col">
                <a href="mailto:support@blinkchat.org" className="hover:text-white hover:underline transition">
                  tufail1526@gmail.com
                </a>
                <a href="mailto:contact@blinkchat.org" className="hover:text-white hover:underline transition">
                  ashisduttaatwork@gmail.com
                </a>
              </div>
            </div>

          </div>

          <div className="pt-8 mt-4 border-t border-gray-600 w-full text-center">
            <p className="text-xs text-gray-400">© 2026 BlinkChat Inc. All rights reserved.</p>
          </div>

        </div>
      </footer>
    </div>
  );
}