import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from '../../../Firebase/firebaseConfig'; 
import LayoutLogin from '../default-login-layout/layout-login';
import './reset-password.css';
import Alert from '../../AssistanceScreens/components/Alert/alert';

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning'>('success');
  const navigate = useNavigate();

  const handleResetPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email) {
      setAlertType('warning');
      setAlertMessage('Por favor, insira seu e-mail.');
      return;
    }

    const actionCodeSettings = {
      url: 'http://localhost:5173/rpconfirm',
      handleCodeInApp: true,
    };

    try {
      await sendPasswordResetEmail(auth, email, actionCodeSettings);
      setAlertType('success');
      setAlertMessage('E-mail de redefinição de senha enviado! Verifique sua caixa de entrada.');
      setTimeout(() => navigate('/login'), 2000); // Redireciona após 3 segundos
    } catch (error) {
      console.error('Erro ao enviar e-mail de redefinição:', error);
      setAlertType('error');
      setAlertMessage('Erro ao enviar o e-mail de redefinição. Tente novamente.');
    }
  };

  return (
    <LayoutLogin>
      {alertMessage && <Alert message={alertMessage} type={alertType} />}
      <form className="reset-password-form" onSubmit={handleResetPassword}>
        <div className='logo-ejov-notext'>
          <img src="src/assets/LogoEJOV-notext.png" alt="Logo EJOV" />
        </div>
        <h2>REDEFINIR SENHA</h2>
        <label htmlFor="email">E-MAIL:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="reset-button">ENVIAR</button>
        <div className="back-to-login-container">
          <span className="or-text">ou</span>
          <Link to="/login" className="back-to-login-link">Voltar para o login</Link>
        </div>
      </form>
    </LayoutLogin>
  );
};

export default ResetPassword;
