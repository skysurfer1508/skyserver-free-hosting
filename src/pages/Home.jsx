import React, { useRef, useState, useEffect } from 'react';
import Header from '@/components/landing/Header';
import HeroSection from '@/components/landing/HeroSection';
import TrustSection from '@/components/landing/TrustSection';
import GamesSection from '@/components/landing/GamesSection';
import RequestForm from '@/components/landing/RequestForm';
import FAQSection from '@/components/landing/FAQSection';
import TechStack from '@/components/landing/TechStack';
import Footer from '@/components/landing/Footer';
import MaintenanceBanner from '@/components/landing/MaintenanceBanner';

export default function Home() {
  const formRef = useRef(null);
  const [selectedGame, setSelectedGame] = useState('');
  const [hasRequested, setHasRequested] = useState(false);
  const [showMaintenanceBanner, setShowMaintenanceBanner] = useState(false);

  useEffect(() => {
    const requested = localStorage.getItem('hasRequestedServer') === 'true';
    setHasRequested(requested);
  }, []);

  // Check maintenance status
  useEffect(() => {
    const updateMaintenanceStatus = () => {
      const status = localStorage.getItem('systemStatus') || 'operational';
      setShowMaintenanceBanner(status === 'maintenance');
    };

    updateMaintenanceStatus();
    window.addEventListener('systemStatusChanged', updateMaintenanceStatus);
    return () => window.removeEventListener('systemStatusChanged', updateMaintenanceStatus);
  }, []);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleGameSelect = (game) => {
    setSelectedGame(game);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {showMaintenanceBanner && <MaintenanceBanner />}
      <Header />
      <HeroSection onCTAClick={scrollToForm} />
      <TrustSection />
      <GamesSection onGameSelect={handleGameSelect} hasRequested={hasRequested} />
      <RequestForm ref={formRef} selectedGame={selectedGame} hasRequested={hasRequested} onSubmitSuccess={() => setHasRequested(true)} />
      <FAQSection />
      <TechStack />
      <Footer />
    </div>
  );
}