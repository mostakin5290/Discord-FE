import AnimatedBackground from '../../components/backgrounds/AnimatedBackground';
import Navbar from '../../components/layout/Navbar';
import Hero from '../../components/home/Hero';
import FeatureSection from '../../components/home/FeatureSection';
import CommunityShowcase from '../../components/home/CommunityShowcase';
import FAQSection from '../../components/home/FAQSection';
import CTASection from '../../components/home/CTASection';
import Footer from '../../components/home/Footer';

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
