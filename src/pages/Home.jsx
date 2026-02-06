import React, { useRef, useState } from 'react';
import Header from '@/components/landing/Header';
import HeroSection from '@/components/landing/HeroSection';
import TrustSection from '@/components/landing/TrustSection';
import GamesSection from '@/components/landing/GamesSection';
import RequestForm from '@/components/landing/RequestForm';
import Footer from '@/components/landing/Footer';

export default function Home() {
  const formRef = useRef(null);
  const [selectedGame, setSelectedGame] = useState('');
  const [hasRequested, setHasRequested] = useState(false);

  React.useEffect(() => {
    const requested = localStorage.getItem('hasRequestedServer') === 'true';
    setHasRequested(requested);
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
      <Header />
      <HeroSection onCTAClick={scrollToForm} />
      <TrustSection />
      <GamesSection onGameSelect={handleGameSelect} hasRequested={hasRequested} />
      <RequestForm ref={formRef} selectedGame={selectedGame} hasRequested={hasRequested} onSubmitSuccess={() => setHasRequested(true)} />
      <Footer />
    </div>
  );
}