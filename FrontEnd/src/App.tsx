import { gapi } from 'gapi-script';
import './App.css';
import WhatsAppClone from './components/Agentes/WhatsAppClone.';
import GoogleAuth from './components/Auth/GoogleAuth';
import { useEffect, useState, useCallback } from 'react';

const App: React.FC = () => {
  const clientIdGoogle = import.meta.env.VITE_CLIENT_ID_GOOGLE;
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        clientId: clientIdGoogle,
        scope: 'profile email',
      });
    };

    gapi.load('client:auth2', initClient);
  }, [clientIdGoogle]);

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const handleSetEmail = useCallback((newEmail: string | ((prevEmail: string) => string)) => {
    setEmail((prevEmail) => {
      const updatedEmail = typeof newEmail === 'function' ? newEmail(prevEmail) : newEmail;
      if (updatedEmail) {
        localStorage.setItem('userEmail', updatedEmail);
      } else {
        localStorage.removeItem('userEmail');
      }
      return updatedEmail;
    });
  }, []);

  return (
    <>
      {email ? (
        <WhatsAppClone email={email} setEmail={handleSetEmail} />
      ) : (
        <GoogleAuth setEmail={handleSetEmail} email={email} />
      )}
    </>
  );
};

export default App;