import React, { useRef, useState, useEffect } from 'react';
import Header from '@/components/landing/Header';
import HeroSection from '@/components/landing/HeroSection';
import TrustSection from '@/components/landing/TrustSection';
import GamesSection from '@/components/landing/GamesSection';
import RequestForm from '@/components/landing/RequestForm';
import RoadmapSection from '@/components/landing/RoadmapSection';
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
    // Check if user has requested a server
    const checkRequests = async () => {
      try {
        const authenticated = await base44.auth.isAuthenticated();
        if (authenticated) {
          const user = await base44.auth.me();
          const requests = await base44.entities.ServerRequest.filter(
            { created_by: user.email },
            '-created_date',
            1
          );
          setHasRequested(requests && requests.length > 0);
        }
      } catch (error) {
        // User not authenticated or no requests yet
        setHasRequested(false);
      }
    };

    checkRequests();
  }, []);

  // Check maintenance status from backend
  useEffect(() => {
    const updateMaintenanceStatus = async () => {
      try {
        const configs = await base44.entities.SystemConfig.list();
        if (configs && configs.length > 0) {
          setShowMaintenanceBanner(configs[0].isMaintenanceMode);
        }
      } catch (error) {
        console.error('Failed to load maintenance status:', error);
      }
    };

    updateMaintenanceStatus();
    // Poll every 30 seconds for updates
    const interval = setInterval(updateMaintenanceStatus, 30000);
    return () => clearInterval(interval);
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
      <TechStack />
      <GamesSection onGameSelect={handleGameSelect} hasRequested={hasRequested} />
      <RequestForm ref={formRef} selectedGame={selectedGame} hasRequested={hasRequested} onSubmitSuccess={() => setHasRequested(true)} />
      <RoadmapSection />
      <FAQSection />
      <Footer />
    </div>
  );
}