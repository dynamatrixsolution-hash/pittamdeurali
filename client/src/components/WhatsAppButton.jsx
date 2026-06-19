import React, { useState, useEffect } from 'react';
import api from '../services/api';

const WhatsAppButton = () => {
  const [whatsappNumber, setWhatsappNumber] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        if (res.success && res.data) {
          setWhatsappNumber(res.data.whatsappNumber);
        }
      } catch (err) {
        console.error('WhatsApp button settings loading error:', err);
      }
    };
    fetchSettings();
  }, []);

  if (!whatsappNumber) return null;

  // Clean the phone number (remove +, spaces, leading zeroes if any)
  const cleanedPhone = whatsappNumber.replace(/[+\s-]/g, '');

  // Pre-filled WhatsApp message template
  const rawMessage = `Hello New Pittam Deurali Guest House & Restaurant,

I would like to inquire about accommodation and restaurant services.

Name:
Guests:
Check-in Date:
Check-out Date:

Please provide further details.

Thank you.`;

  const encodedMessage = encodeURIComponent(rawMessage);
  const whatsappUrl = `https://wa.me/${cleanedPhone}?text=${encodedMessage}`;

  return (
    <a 
      href={whatsappUrl} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="whatsapp-float whatsapp-pulse"
      title="Inquire on WhatsApp"
      aria-label="Contact Hotel via WhatsApp"
    >
      <i className="bi bi-whatsapp"></i>
    </a>
  );
};

export default WhatsAppButton;
