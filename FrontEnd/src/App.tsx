import { gapi } from 'gapi-script';
import './App.css';
import WhatsAppClone from './components/Agentes/WhatsAppClone.';
import GoogleAuth from './components/Auth/GoogleAuth';
import { useEffect, useState } from 'react';

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

  const handleSetEmail = (newEmail: string) => {
    setEmail(newEmail);
    if (newEmail) {
      localStorage.setItem('userEmail', newEmail);
    } else {
      localStorage.removeItem('userEmail');
    }
  };

  return (
    <>
      {email ? (
        <WhatsAppClone email={email} />
      ) : (
        <GoogleAuth setEmail={handleSetEmail} />
      )}
    </>
  );
};

export default App;