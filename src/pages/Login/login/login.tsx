import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from '../../../Firebase/firebaseConfig';
import LayoutLogin from '../default-login-layout/layout-login';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { doc, getDoc } from "firebase/firestore";
import './login.css';
import Alert from '../../AssistanceScreens/components/Alert/alert'; 

const Login: React.FC = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning'>('success');
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!login || !password) {
      setAlertType('warning');
      setAlertMessage('Por favor, preencha todos os campos.');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, login, password);
      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, "usuários", user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setAlertType('success');
        setAlertMessage(`Bem-vindo, ${userData.name}!`);

        setTimeout(() => {
          if (userData.userType === "admin") {
            navigate('/home');
          } else if (userData.userType === "técnico") {
            navigate('/home');
          } else {
            navigate('/home');
          }
        }, 2000);
      } else {
        setAlertType('error');
        setAlertMessage('Este usuário não está cadastrado. Verifique suas credenciais ou cadastre-se.');
      }
    } catch (error: unknown) {
      console.error('Authentication error:', error);
      setAlertType('error');
      setAlertMessage('Erro ao autenticar. Verifique seus dados ou tente novamente mais tarde.');
    }
  };

  return (
    <LayoutLogin>
      {alertMessage && <Alert message={alertMessage} type={alertType} />}  {/* Exibe o Alert */}
      <form className="login-form" onSubmit={handleLogin}>
        <div className='logo-ejov'>
          <img src="src/assets/LogoEJOV.png" alt="Logo EJOV" />
        </div>
        <label htmlFor="login">LOGIN:</label>
        <input
          type="text"
          id="login"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          required
        />
        <label htmlFor="password">SENHA:</label>
        <div className="password-input-container">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="toggle-password-button"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <div className="login-links">
          <a href="/rp">Esqueceu a senha?</a>
        </div>
        <button type="submit" className="login-button">ENTRAR</button>
        <p>
          Não possui uma conta? <a href="/register">Cadastrar conta</a>
        </p>
      </form>
    </LayoutLogin>
  );
};

export default Login;
