import { useEffect, useState } from 'react';
import {
  INITIAL_CAMPAIGN,
  INITIAL_DOGS,
  INITIAL_DONATIONS,
  type CampaignSummary,
  type DogProfile,
  type DonationRecord,
} from './data/rescueData';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { HomePage } from './pages/HomePage';
import { AdoptPage } from './pages/AdoptPage';
import { DogDetailPage } from './pages/DogDetailPage';
import { VolunteerPage } from './pages/VolunteerPage';
import { AboutPage } from './pages/AboutPage';
import { DonatePage } from './pages/DonatePage';
import { ContactPage } from './pages/ContactPage';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() =>
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );
  const [dogs, setDogs] = useState<DogProfile[]>(INITIAL_DOGS);
  const [campaign, setCampaign] = useState<CampaignSummary>(INITIAL_CAMPAIGN);
  const [donations, setDonations] = useState<DonationRecord[]>(INITIAL_DONATIONS);
  const [volunteerCount, setVolunteerCount] = useState<number>(0);

  useEffect(() => {
    const onPopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    let active = true;
    fetch('/api/state')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active || !data) return;
        if (Array.isArray(data.dogs)) setDogs(data.dogs);
        if (data.campaign) setCampaign(data.campaign);
        if (Array.isArray(data.donations)) setDonations(data.donations);
        if (typeof data.volunteerCount === 'number') setVolunteerCount(data.volunteerCount);
      })
      .catch(() => {
        // Keep seeded state gracefully if API is unreachable
      });
    return () => {
      active = false;
    };
  }, []);

  const navigate = (path: string) => {
    if (path !== currentPath) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleInquirySubmitted = (updatedDog: DogProfile) => {
    setDogs((prev) => prev.map((d) => (d.id === updatedDog.id ? updatedDog : d)));
  };

  const handleDonationComplete = (
    _receipt: DonationRecord,
    updatedCampaign: CampaignSummary,
    updatedDonations: DonationRecord[]
  ) => {
    setCampaign(updatedCampaign);
    setDonations(updatedDonations);
  };

  const renderPage = () => {
    if (currentPath === '/' || currentPath === '') {
      return <HomePage dogs={dogs} campaign={campaign} onNavigate={navigate} />;
    }
    if (currentPath === '/adopt') {
      return <AdoptPage dogs={dogs} onNavigate={navigate} />;
    }
    if (currentPath.startsWith('/adopt/')) {
      const dogId = currentPath.replace('/adopt/', '').split('/')[0];
      const selectedDog = dogs.find((d) => d.id === dogId);
      return (
        <DogDetailPage
          dog={selectedDog}
          onNavigate={navigate}
          onInquirySubmitted={handleInquirySubmitted}
        />
      );
    }
    if (currentPath === '/volunteer') {
      return (
        <VolunteerPage
          volunteerCount={volunteerCount}
          onApplicationSubmitted={(count) => setVolunteerCount(count)}
        />
      );
    }
    if (currentPath === '/about') {
      return <AboutPage onNavigate={navigate} />;
    }
    if (currentPath === '/donate') {
      return (
        <DonatePage
          campaign={campaign}
          recentDonations={donations}
          onDonationComplete={handleDonationComplete}
        />
      );
    }
    if (currentPath === '/contact') {
      return <ContactPage onNavigate={navigate} />;
    }
    return <HomePage dogs={dogs} campaign={campaign} onNavigate={navigate} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-zinc-900">
      <Navbar currentPath={currentPath} onNavigate={navigate} />
      <main className="flex-1">{renderPage()}</main>
      <Footer onNavigate={navigate} />
      <WhatsAppFloatingButton />
    </div>
  );
}
