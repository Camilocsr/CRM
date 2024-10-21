import { GoogleLogin, CredentialResponse, googleLogout } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { DecodedCredential, GoogleAuthProps } from './types';

const GoogleAuth: React.FC<GoogleAuthProps> = ({ setEmail }) => {
  const handleLoginSuccess = (response: CredentialResponse) => {
    console.log('Login exitoso:', response);
    
    if (response.credential) {
      const decodedCredential: DecodedCredential = jwtDecode(response.credential);
      console.log('Correo electrónico del usuario:', decodedCredential.email);
      setEmail(decodedCredential.email);
    }
  };

  const handleLoginError = () => {
    console.error('Error al iniciar sesión con Google');
  };

  const handleLogout = () => {
    googleLogout();
    setEmail(''); // Limpiar el email al cerrar sesión
    console.log('Sesión de Google cerrada');
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <GoogleLogin onSuccess={handleLoginSuccess} onError={handleLoginError} />
      <button onClick={handleLogout} style={{ marginLeft: '10px' }}>
        Cerrar Sesión
      </button>
    </div>
  );
};

export default GoogleAuth;