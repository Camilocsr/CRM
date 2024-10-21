import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { DecodedCredential, GoogleAuthProps } from './types';

const GoogleAuth: React.FC<GoogleAuthProps> = ({ setEmail, email }) => {
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

  if (email) {
    return null;
  }

  // Si el usuario no está autenticado, mostramos el botón de Google Login
  return (
    <div style={{ marginTop: '20px' }}>
      <GoogleLogin onSuccess={handleLoginSuccess} onError={handleLoginError} />
    </div>
  );
};

export default GoogleAuth;