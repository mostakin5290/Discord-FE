import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 overflow-hidden bg-background">
      {/* Background Glows */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] opacity-20 pointer-events-none rounded-full blur-[120px]"
        style={{
          background: 'bg-primary'
        }}
      />
      
      {/* Moving clouds/fog effect */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150 animate-pulse-slow pointer-events-none"></div>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10 w-full mt-12">
        {/* Left: Text Content */}
        <div className="text-center lg:text-left space-y-6 order-2 lg:order-1 animate-slide-in-up">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-[900] leading-[0.9] tracking-tighter uppercase font-logo text-white drop-shadow-lg">
            Imagine a <br />
            <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent text-glow">Place...</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 max-w-lg mx-auto lg:mx-0 font-body leading-relaxed">
            ...where you can belong to a school club, a gaming group, or a worldwide art community. A place that makes it easy to talk every day.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
            <Button 
              size="lg" 
              className="bg-white text-black hover:bg-gray-200 px-8 py-7 rounded-full text-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-primary/20"
            >
              <Download className="mr-2 h-5 w-5" />
              Download for Mac
            </Button>
            
            {/* Interactive Login Dialog */}
            <Dialog>
                <DialogTrigger asChild>
                    <Button 
                      size="lg" 
                      className="glass-card text-white hover:bg-white/10 px-8 py-7 rounded-full text-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-xl border border-white/10"
                    >
                      Open Discord in your browser
                    </Button>
                </DialogTrigger>
                <DialogContent className="glass-strong text-white sm:max-w-md border-white/10">
                    <DialogHeader>
                        <DialogTitle className="text-center text-2xl font-bold font-logo text-white mb-2">Welcome Back!</DialogTitle>
                        <DialogDescription className="text-center text-gray-400">
                            We're so excited to see you again!
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-400 text-xs font-bold uppercase">Email or Phone Number</Label>
                            <Input id="email" className="bg-black/50 border-white/10 text-white focus-visible:ring-primary" />
                        </div>
                        <div className="space-y-2">
                             <Label htmlFor="password" className="text-gray-400 text-xs font-bold uppercase">Password</Label>
                            <Input id="password" type="password" className="bg-black/50 border-white/10 text-white focus-visible:ring-primary" />
                             <a href="#" className="text-primary text-xs hover:underline block mt-1">Forgot your password?</a>
                        </div>
                        <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-6 mt-4 shadow-lg shadow-primary/25">
                            Log In
                        </Button>
                         <div className="text-sm text-gray-400 mt-2">
                            Need an account? <a href="#" className="text-primary hover:underline">Register</a>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Right: 3D Character */}
        <div className="relative order-1 lg:order-2 flex justify-center lg:justify-end animate-float-slow">
            <div className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px]">
                {/* Glow behind character */}
                <div className="absolute inset-0 bg-primary blur-[100px] opacity-20 rounded-full animate-pulse-slow"></div>
                
                <img 
                  src="/brain/12b62f88-f3cc-4c3f-a746-d49dac5c46ee/wumpus_3d_friendly.png"
                  alt="Friendly Wumpus"
                  className="relative z-10 w-full h-full object-contain drop-shadow-2xl hover:rotate-3 transition-transform duration-500 ease-out cursor-pointer"
                />

                {/* Floating Elements */}
                <div className="absolute top-10 right-10 p-4 glass-card rounded-2xl animate-float border border-white/10 hidden md:block">
                    <span className="text-2xl">👋</span>
                </div>
                <div className="absolute bottom-20 left-0 p-4 glass-card rounded-2xl animate-float-slow border border-white/10 hidden md:block" style={{animationDelay: '1s'}}>
                    <span className="text-2xl">🎮</span>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
