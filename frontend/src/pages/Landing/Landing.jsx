import { Link } from 'react-router-dom';
import Hero from './components/Hero.jsx';
import Features from './components/Features.jsx';
import HowItWorks from './components/HowItWorks.jsx';
import GamePreview from './components/GamePreview.jsx';
import CTA from './components/CTA.jsx';
import Footer from './components/Footer.jsx';
import heroBg from '../../assets/images/hero-bg.jpg';

export default function Landing() {
  return (
    <div className="relative min-h-screen text-ink overflow-x-hidden">
      {/* Full screen fixed background so hero-bg is completely visible */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        {/* Subtle translucent tint so background art shines through brilliantly */}
        <div className="absolute inset-0 bg-black/25" />
      </div>

      <div className="relative z-10">
        <header className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
          <span className="font-display text-white text-xl font-bold tracking-wider drop-shadow-md">Life RPG</span>
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/login" className="text-white hover:text-purple font-medium transition-colors drop-shadow-sm">
              Log in
            </Link>
            <Link 
              to="/signup" 
              className="text-white bg-purple/80 hover:bg-purple border border-white/20 backdrop-blur-md rounded-lg px-4 py-1.5 transition-all shadow-md font-medium"
            >
              Sign up
            </Link>
          </nav>
        </header>
        <Hero />
        <Features />
        <HowItWorks />
        <GamePreview />
        <CTA />
        <Footer />
      </div>
    </div>
  );
}
