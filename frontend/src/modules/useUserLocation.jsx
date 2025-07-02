import { useState } from 'react';

export default function useUserLocation() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState('');
  const [manualAddress, setManualAddress] = useState('');

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setError('');
      },
      (err) => {
        setError('Unable to retrieve your location. You can enter it manually.');
      }
    );
  };

  return {
    location,
    error,
    manualAddress,
    setManualAddress,
    requestLocation,
  };
}
