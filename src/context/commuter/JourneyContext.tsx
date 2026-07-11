import React, { createContext, useState, useContext, ReactNode } from 'react';

type Journey = {
  busId: string;
  destination: string;
  from: string;
} | null;

export type SavedPlace = {
  id: string;
  alias: string;
  address: string;
  icon: string;
  routes: string[];
};

export type Trip = {
  id: string;
  busId: string;
  from: string;
  destination: string;
  duration: string;
  dateStr: string;
  cost: string;
};

interface JourneyContextType {
  activeJourney: Journey;
  boardBus: (busId: string, destination: string, from: string) => void;
  completeJourney: () => void;
  savedPlaces: SavedPlace[];
  addSavedPlace: (alias: string, address: string) => void;
  recentTrips: Trip[];
}

const JourneyContext = createContext<JourneyContextType | undefined>(undefined);

const initialPlaces: SavedPlace[] = [
  { id: '1', alias: 'Home', address: '202 Turner Road, Bandra West', icon: '🏠', routes: ['507', '310'] },
  { id: '2', alias: 'Work', address: 'G Block, BKC, Mumbai', icon: '💼', routes: ['AC71', '221'] },
  { id: '3', alias: 'College', address: 'Vile Parle (W), Mumbai', icon: '🎓', routes: ['507'] }
];

const initialTrips: Trip[] = [
  { id: 't1', busId: '507', from: 'Bandra Stn', destination: 'BKC Office', duration: '32 min', dateStr: 'Yesterday, 9:40 AM', cost: '₹18' },
  { id: 't2', busId: 'AC71', from: 'BKC Office', destination: 'Bandra Stn', duration: '28 min', dateStr: 'Yesterday, 6:12 PM', cost: '₹35' }
];

export function JourneyProvider({ children }: { children: ReactNode }) {
  const [activeJourney, setActiveJourney] = useState<Journey>(null);
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>(initialPlaces);
  const [recentTrips, setRecentTrips] = useState<Trip[]>(initialTrips);

  const boardBus = (busId: string, destination: string, from: string) => {
    setActiveJourney({ busId, destination, from });
  };

  const completeJourney = () => {
    if (activeJourney) {
      const newTrip: Trip = {
        id: Date.now().toString(),
        busId: activeJourney.busId,
        from: activeJourney.from,
        destination: activeJourney.destination,
        duration: '42 min', // Mocked duration
        dateStr: 'Just now',
        cost: '₹22', // Mocked cost
      };
      setRecentTrips(prev => [newTrip, ...prev]);
    }
    setActiveJourney(null);
  };

  const addSavedPlace = (alias: string, address: string) => {
    const newPlace: SavedPlace = {
      id: Date.now().toString(),
      alias,
      address,
      icon: '📍', // default icon
      routes: ['New!']
    };
    setSavedPlaces(prev => [...prev, newPlace]);
  };

  return (
    <JourneyContext.Provider value={{ activeJourney, boardBus, completeJourney, savedPlaces, addSavedPlace, recentTrips }}>
      {children}
    </JourneyContext.Provider>
  );
}

export function useJourney() {
  const context = useContext(JourneyContext);
  if (context === undefined) {
    throw new Error('useJourney must be used within a JourneyProvider');
  }
  return context;
}
