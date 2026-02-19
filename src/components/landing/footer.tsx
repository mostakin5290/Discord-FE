import { Twitter, Instagram, Facebook, Youtube, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FooterProps } from "@/types";

const Footer = (_props: FooterProps = {}) => {
  return (
    <footer className="bg-black py-20 px-6 border-t border-white/5 relative overflow-hidden">
      {/* Background glow for footer */}
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-4xl font-[900] font-logo text-primary uppercase tracking-tighter">
              Imagine a <br /> Place
            </h2>

            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-white hover:text-primary transition-transform hover:scale-110"
              >
                <Twitter className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-white hover:text-primary transition-transform hover:scale-110"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-white hover:text-primary transition-transform hover:scale-110"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-white hover:text-primary transition-transform hover:scale-110"
              >
                <Youtube className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-white hover:text-primary transition-transform hover:scale-110"
              >
                <Github className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div className="space-y-4">
            <h4 className="text-primary font-bold">Product</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Download
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Nitro
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Status
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  App Directory
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-primary font-bold">Company</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Jobs
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Branding
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Newsroom
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-primary font-bold">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  College
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Support
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Safety
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Feedback
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <a href="#" className="flex items-center gap-2 group">
            <span className="text-white font-[900] text-xl font-logo tracking-tight">
              Discord
            </span>
          </a>

          <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 font-bold shadow-lg shadow-primary/20">
            Open Discord
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
