import React, { useRef, useState } from 'react';
import HeroSection from '@/components/landing/HeroSection';
import TrustSection from '@/components/landing/TrustSection';
import GamesSection from '@/components/landing/GamesSection';
import RequestForm from '@/components/landing/RequestForm';
import Footer from '@/components/landing/Footer';

export default function Home() {
  const formRef = useRef(null);
  const [selectedGame, setSelectedGame] = useState('');

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
      <HeroSection onCTAClick={scrollToForm} />
      <TrustSection />
      <GamesSection onGameSelect={handleGameSelect} />
      <RequestForm ref={formRef} selectedGame={selectedGame} />
      <Footer />
    </div>
  );
}