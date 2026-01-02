import AnimatedBackground from './AnimatedBackground';
import Navbar from './Navbar';
import Hero from './Hero';
import FeatureSection from './FeatureSection';
import CommunityShowcase from './CommunityShowcase';
import FAQSection from './FAQSection';
import CTASection from './CTASection';
import Footer from './Footer';

const LandingPage = () => {
  return (
    <div className="relative min-h-screen">
      {/* Animated particle background */}
      <AnimatedBackground />
      
      {/* Navigation */}
      <Navbar />
      
      {/* Main content */}
      <main>
        <Hero />
        <FeatureSection />
        <CommunityShowcase />
        <FAQSection />
        <CTASection />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
