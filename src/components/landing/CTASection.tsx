import { Button } from '@/components/ui/button';
import { Download, ArrowRight } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="glass-strong rounded-3xl p-12 md:p-16 text-center relative overflow-hidden shadow-3d-lg">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-600 to-pink-600 opacity-10 animate-gradient"></div>
          
          <div className="relative z-10 space-y-8">
            <h2 className="text-5xl md:text-6xl font-black">
              <span className="block text-white mb-2">Ready to Start</span>
              <span className="block gradient-text">Your Journey?</span>
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join millions of users worldwide. Download now and connect with communities that matter to you.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 px-8 py-6 text-lg rounded-full shadow-3d-md hover:shadow-3d-lg hover:scale-105 transition-all duration-300 group font-bold"
              >
                <Download className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                Download for Free
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="glass border-2 border-white/30 hover:border-white text-white px-8 py-6 text-lg rounded-full hover:scale-105 transition-all duration-300 group"
              >
                Learn More
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <div className="pt-8">
              <p className="text-sm text-muted-foreground">
                Available on Windows, macOS, Linux, iOS, Android, and Web
              </p>
            </div>
          </div>

          {/* Floating orbs */}
          <div className="absolute -top-12 -left-12 w-24 h-24 bg-primary rounded-full blur-2xl opacity-50 animate-float-slow"></div>
          <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-purple-600 rounded-full blur-2xl opacity-50 animate-float" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
