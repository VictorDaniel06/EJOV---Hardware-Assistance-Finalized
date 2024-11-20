import React, { useEffect, useState } from 'react';
import './profile.css';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { db } from '../../../../Firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

interface ProfileProps {
  onClose: () => void;
}

const Profile: React.FC<ProfileProps> = ({ onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [uid, setUid] = useState(''); // Estado para armazenar o UID do usuário
  const navigate = useNavigate();

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        setUid(user.uid); // Define o UID do usuário no estado
        const docRef = doc(db, "usuários", user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setName(userData.name || '');
          setEmail(userData.email || '');
          setPhone(userData.phone || '');
        } else {
          console.log("Documento do usuário não encontrado!");
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <div className="profile-container">
      <button className="close-button" onClick={onClose}>✖</button>
      <div className="profile-header">
        <div className="profile-image">
          <span>100 x 100</span>
        </div>
        <h2>{name || "Nome do Usuário"}</h2>
        <p>{uid}</p> {/* Exibe o UID abaixo do nome do usuário */}
      </div>
      <div className="profile-info">
        <div className="profile-item">
          <label>Nome Completo</label>
          <div className="profile-value">{name}</div>
        </div>
        <div className="profile-item">
          <label>Email</label>
          <div className="profile-value">{email}</div>
        </div>
        <div className="profile-item">
          <label>Telefone</label>
          <div className="profile-value">{phone}</div>
        </div>
      </div>
      <div className="profile-actions">
        <button className="logout-button" onClick={handleLogout}>Sair da Conta</button>
      </div>
    </div>
  );
};

export default Profile;