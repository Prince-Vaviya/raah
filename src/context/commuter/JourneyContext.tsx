import React, { createContext, useState, useContext, ReactNode } from 'react';

type Journey = {
  busId: string;
  destination: string;
  from: string;
  startTime: number;
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

const initialPlaces: SavedPlace[] = [];
const initialTrips: Trip[] = [];

export function JourneyProvider({ children }: { children: ReactNode }) {
  const [activeJourney, setActiveJourney] = useState<Journey>(null);
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>(initialPlaces);
  const [recentTrips, setRecentTrips] = useState<Trip[]>(initialTrips);

  const boardBus = (busId: string, destination: string, from: string) => {
    setActiveJourney({ busId, destination, from, startTime: Date.now() });
  };

  const completeJourney = () => {
    if (activeJourney) {
      const elapsedMs = Date.now() - activeJourney.startTime;
      const elapsedMins = Math.max(1, Math.round(elapsedMs / 60000));
      
      const newTrip: Trip = {
        id: Date.now().toString(),
        busId: activeJourney.busId,
        from: activeJourney.from,
        destination: activeJourney.destination,
        duration: `${elapsedMins} min`,
        dateStr: 'Just now',
        cost: `₹${Math.min(50, 10 + elapsedMins * 2)}`, // Base 10 + 2 per min
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
      icon: 'location', // default icon
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
