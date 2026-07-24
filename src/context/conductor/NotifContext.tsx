import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';

interface NotifContextType {
  commandCount: number;
  setCommandCount: (count: number) => void;
  alertCount: number;
  readAlert: () => void;
}

const NotifContext = createContext<NotifContextType | undefined>(undefined);

export function NotifProvider({ children }: { children: ReactNode }) {
  const [commandCount, setCommandCount] = useState(0);
  const [alertCount, setAlertCount] = useState(3); // Start with the 3 mock alerts

  const readAlert = useCallback(() => {
    setAlertCount(prev => Math.max(0, prev - 1));
  }, []);

  return (
    <NotifContext.Provider value={{ commandCount, setCommandCount, alertCount, readAlert }}>
      {children}
    </NotifContext.Provider>
  );
}

export function useNotif() {
  const context = useContext(NotifContext);
  if (context === undefined) {
    throw new Error('useNotif must be used within a NotifProvider');
  }
  return context;
}
