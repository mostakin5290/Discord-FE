import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Menu, Download, Shield, Sparkles, Smile } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? "glass-strong py-4 border-b border-white/5"
        : "bg-transparent py-6"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group z-50">
            <span className="text-white font-[900] text-2xl font-logo tracking-tight drop-shadow-md">
              Discord
            </span>
          </a>

          {/* Desktop Navigation - Shadcn Navigation Menu */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white data-[active]:bg-white/10 data-[state=open]:bg-white/10 font-bold">
                    Download
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] bg-[#020617] border border-white/10 backdrop-blur-xl">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <a
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-br from-primary/20 to-primary/5 p-6 no-underline outline-none focus:shadow-md border border-white/5 hover:border-primary/30 transition-colors"
                            href="/"
                          >
                            <Download className="h-6 w-6 text-primary" />
                            <div className="mb-2 mt-4 text-lg font-bold text-white">
                              Desktop App
                            </div>
                            <p className="text-sm leading-tight text-gray-400">
                              Get the best experience with our desktop app for
                              Mac, Windows, and Linux.
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <a href="#" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/5 hover:text-white focus:bg-white/5 focus:text-white">
                            <div className="text-sm font-medium leading-none text-white">
                              Mobile App
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-gray-400">
                              Take Discord with you on iOS and Android.
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <a href="#" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/5 hover:text-white focus:bg-white/5 focus:text-white">
                            <div className="text-sm font-medium leading-none text-white">
                              Web Browser
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-gray-400">
                              Use directly in Chrome, Firefox, or Edge.
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white data-[active]:bg-white/10 data-[state=open]:bg-white/10 font-bold">
                    Safety
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-[#020617] border border-white/10 backdrop-blur-xl">
                      {[
                        {
                          title: "Safety Center",
                          desc: "Learn about how we keep you safe.",
                          icon: Shield,
                          color: "text-green-400"
                        },
                        {
                          title: "Parent's Guide",
                          desc: "Everything parents need to know.",
                          icon: Smile,
                          color: "text-yellow-400"
                        },
                        {
                          title: "Teen's Charter",
                          desc: "Our commitment to teen safety.",
                          icon: Sparkles,
                          color: "text-pink-400"
                        },
                        {
                          title: "Transparency",
                          desc: "Read our latest transparency report.",
                          icon: Shield,
                          color: "text-blue-400"
                        },
                      ].map((item, i) => (
                        <li key={i}>
                          <NavigationMenuLink asChild>
                            <a href="#" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/5 focus:bg-white/5 group">
                              <div className="flex items-center gap-2 text-sm font-bold leading-none text-white group-hover:text-primary transition-colors">
                                <item.icon className={`w-4 h-4 ${item.color}`} /> {item.title}
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-gray-400 pl-6 mt-1">
                                {item.desc}
                              </p>
                            </a>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="#support"
                    className={cn(navigationMenuTriggerStyle(), "bg-transparent text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white font-bold")}
                  >
                    Support
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="#blog"
                    className={cn(navigationMenuTriggerStyle(), "bg-transparent text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white font-bold")}
                  >
                    Blog
                  </NavigationMenuLink>
                </NavigationMenuItem>

              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Button
              onClick={() => navigate("/login")}
              size="sm"
              className="bg-white text-black hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/25 rounded-full px-6 font-bold transition-all text-sm"
            >
              Login
            </Button>
          </div>

          {/* Mobile Menu - Shadcn Sheet */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-[#020617] border-l-white/10 text-white w-[300px]">
                <div className="flex flex-col gap-6 mt-8">
                  <a href="#" className="text-lg font-bold hover:text-primary flex items-center gap-2 transition-colors">
                    <Download className="w-5 h-5" /> Download
                  </a>
                  <a href="#" className="text-lg font-bold hover:text-primary flex items-center gap-2 transition-colors">
                    <Shield className="w-5 h-5" /> Safety
                  </a>
                  <a href="#" className="text-lg font-bold hover:text-primary transition-colors">Support</a>
                  <a href="#" className="text-lg font-bold hover:text-primary transition-colors">Blog</a>
                  <a href="#" className="text-lg font-bold hover:text-primary transition-colors">Careers</a>

                  <div className="h-px bg-white/10 my-2" />

                  <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-full shadow-lg shadow-primary/20">
                    Download for Mac
                  </Button>
                  <Button variant="secondary" className="w-full bg-white/5 text-white hover:bg-white/10 rounded-full border border-white/5">
                    Login
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
