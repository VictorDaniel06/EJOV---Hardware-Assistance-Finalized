import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { confirmPasswordReset } from "firebase/auth";
import { auth } from '../../../Firebase/firebaseConfig';
import LayoutLogin from '../default-login-layout/layout-login';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './reset-password-confirmation.css';
import Alert from '../../AssistanceScreens/components/Alert/alert';

const ResetPasswordConfirmation: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning'>('success');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const oobCode = searchParams.get('oobCode');

  const handlePasswordReset = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setAlertType('error');
      setAlertMessage('As senhas não coincidem.');
      return;
    }

    try {
      if (oobCode) {
        await confirmPasswordReset(auth, oobCode, password);
        setAlertType('success');
        setAlertMessage('Senha redefinida com sucesso! Redirecionando para login...');
        setTimeout(() => navigate('/login'), 3000); // Redireciona após 3 segundos
      } else {
        setAlertType('error');
        setAlertMessage('Código de redefinição inválido. Solicite uma nova redefinição de senha.');
      }
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      setAlertType('error');
      setAlertMessage('Erro ao redefinir senha. Tente novamente.');
    }
  };

  return (
    <LayoutLogin>
      {alertMessage && <Alert message={alertMessage} type={alertType} />}
      <form className="reset-password-confirmation-form" onSubmit={handlePasswordReset}>
        <h2>DEFINIR NOVA SENHA</h2>
        <label htmlFor="password">NOVA SENHA:</label>
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
        <label htmlFor="confirm-password">CONFIRMAR NOVA SENHA:</label>
        <div className="password-input-container">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button 
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="toggle-password-button"
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <button type="submit" className="reset-password-button">REDEFINIR SENHA</button>
      </form>
    </LayoutLogin>
  );
};

export default ResetPasswordConfirmation;
