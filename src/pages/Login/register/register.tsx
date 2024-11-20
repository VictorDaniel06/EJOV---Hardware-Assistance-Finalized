import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from '../../../Firebase/firebaseConfig';
import LayoutLogin from '../default-login-layout/layout-login';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { collection, query, where, getDocs, doc, setDoc, Timestamp } from "firebase/firestore";
import './register.css';
import Alert from '../../AssistanceScreens/components/Alert/alert';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning'>('success');
  const navigate = useNavigate();

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name || !phone || !login || !password || !confirmPassword) {
      setAlertType('warning');
      setAlertMessage('Por favor, preencha todos os campos.');
      return;
    }

    if (password !== confirmPassword) {
      setAlertType('error');
      setAlertMessage('As senhas não coincidem.');
      return;
    }

    try {
      // Verificar se e-mail ou telefone já estão cadastrados
      const usersRef = collection(db, "usuários");

      // Query para verificar ambos os campos
      const qBoth = query(
        usersRef,
        where("email", "==", login),
        where("phone", "==", phone)
      );
      const qEmail = query(usersRef, where("email", "==", login));
      const qPhone = query(usersRef, where("phone", "==", phone));

      const bothSnapshot = await getDocs(qBoth);
      const emailSnapshot = await getDocs(qEmail);
      const phoneSnapshot = await getDocs(qPhone);

      // Verificar condições
      if (!bothSnapshot.empty) {
        setAlertType('error');
        setAlertMessage('O e-mail e o telefone já estão sendo usados. Tente usar outro telefone e e-mail!');
        return;
      }

      if (!emailSnapshot.empty) {
        setAlertType('error');
        setAlertMessage('Este e-mail já está já está sendo usado. Tente usar outro e-mail!');
        return;
      }

      if (!phoneSnapshot.empty) {
        setAlertType('error');
        setAlertMessage('Este telefone já está sendo usado. Tente usar outro telefone!');
        return;
      }

      // Criar o usuário
      const userCredential = await createUserWithEmailAndPassword(auth, login, password);
      const user = userCredential.user;

      await setDoc(doc(db, "usuários", user.uid), {
        uid: user.uid,
        name: name,
        phone: phone,
        email: login,
        userType: "user",
        createdAt: Timestamp.fromDate(new Date())
      });

      setAlertType('success');
      setAlertMessage('Cadastro realizado com sucesso! Bem-vindo!');

      // Exibir a mensagem de sucesso antes de redirecionar
      setTimeout(() => {
        navigate('/login');
      }, 3000); // Aguardar 3 segundos para o usuário ver o alerta
    } catch (error: unknown) {
      setAlertType('error');
      setAlertMessage('Erro no registro. Tente novamente.');
      if (error instanceof Error) {
        console.error('Error during registration:', error.message);
      } else {
        console.error('Unknown error during registration');
      }
    }
  };

  return (
    <LayoutLogin>
      {alertMessage && <Alert message={alertMessage} type={alertType} />} {/* Exibe o Alert */}
      <form className="register-form" onSubmit={handleRegister}>
        <div className='logo-ejov-notext'>
          <img src="src/assets/LogoEJOV-notext.png" alt="Logo EJOV" />
        </div>
        <h2>CADASTRAR CONTA</h2>

        <label htmlFor="name">NOME/SOBRENOME:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label htmlFor="phone">TELEFONE:</label>
        <input
          type="tel"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <label htmlFor="e-mail">E-MAIL:</label>
        <input
          type="text"
          id="login"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          required
        />

        <label htmlFor="password-rg">SENHA:</label>
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

        <label htmlFor="confirm-password-rg">CONFIRMAR SENHA:</label>
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

        <button type="submit" className="register-button">CADASTRAR</button>
      </form>
    </LayoutLogin>
  );
};

export default Register;
