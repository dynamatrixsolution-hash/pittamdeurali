import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    hotelName: 'New Pittam Deurali Guest House and Restaurant',
    address: 'Pittam Deurali, Lumle 33700, Kaski, Nepal',
    phone: '+977-9801234567',
    whatsappNumber: '9779866061995',
    email: 'stay@newpittamdeurali.com',
    facebookUrl: '#',
    instagramUrl: '#',
    tripAdvisorUrl: '#',
    showRoomPricesPublicly: true
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        if (res.success && res.data) {
          setSettings(res.data);
        }
      } catch (err) {
        console.error('Settings context loading error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};
