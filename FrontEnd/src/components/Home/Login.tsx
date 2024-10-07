import '../../css/Login.css'

const Login: React.FC = () => {
    const handleLogin = () => {
        window.open('http://localhost:3000/api/auth/google', '_self');
    };

    return (
        <div className="login-container">
            <h2 className="login-title">Iniciar sesión</h2>
            <button className="login-button" onClick={handleLogin}>
                Iniciar sesión con Google
            </button>
        </div>
    );
};

export default Login;