import React, { createContext, useContext, useState } from 'react';

export type AlertType = 'warning' | 'danger' | 'info' | 'success';

export interface Alert {
  id: string;
  type: AlertType;
  title: string;
  description: string;
  time: string;
  isRead: boolean;
}

const initialAlerts: Alert[] = [
  {
    id: '1',
    type: 'warning',
    title: 'Route Diversion — Bus 507',
    description: '507 is diverted via Linking Road due to waterlogging near Turner Road. Expect +8 min delay.',
    time: '2 min ago',
    isRead: false,
  },
  {
    id: '2',
    type: 'danger',
    title: 'Bus 310 Delayed — 22 min',
    description: 'Breakdown reported at Santacruz. Service will resume at 10:45 AM.',
    time: '15 min ago',
    isRead: false,
  },
  {
    id: '3',
    type: 'info',
    title: 'Heavy Rain Alert',
    description: 'IMD predicts heavy rainfall in Mumbai for the next 4 hours. Plan travel accordingly.',
    time: '30 min ago',
    isRead: false,
  },
  {
    id: '4',
    type: 'success',
    title: 'AC71 Now Running on Time',
    description: 'Earlier delay resolved. AC71 to BKC is back on schedule.',
    time: '1 hr ago',
    isRead: false,
  },
  {
    id: '5',
    type: 'info',
    title: 'Platform Maintenance — Bandra Stn',
    description: 'Platform 2 under maintenance until 6 PM. Use Platform 1 or 3 for boarding.',
    time: '2 hr ago',
    isRead: false,
  },
];

interface AlertsContextType {
  alerts: Alert[];
  unreadCount: number;
  markAllAsRead: () => void;
  markAsRead: (id: string) => void;
}

const AlertsContext = createContext<AlertsContextType | undefined>(undefined);

export function AlertsProvider({ children }: { children: React.ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);

  const unreadCount = alerts.filter(a => !a.isRead).length;

  const markAllAsRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, isRead: true })));
  };

  const markAsRead = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, isRead: true } : a));
  };

  return (
    <AlertsContext.Provider value={{ alerts, unreadCount, markAllAsRead, markAsRead }}>
      {children}
    </AlertsContext.Provider>
  );
}

export function useAlerts() {
  const context = useContext(AlertsContext);
  if (context === undefined) {
    throw new Error('useAlerts must be used within an AlertsProvider');
  }
  return context;
}
