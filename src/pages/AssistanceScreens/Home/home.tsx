import React, { useState } from 'react';
import NavBar from '../components/nav-bar/nav-bar';
import Container from '../components/container/container';
import Footer from '../components/footer/footer';
import Chatbot from '../components/ChatBot/chatbot';
import './home.css';

const Home: React.FC = () => {
  const [showAssistanceForm, setShowAssistanceForm] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showStatus, setShowStatus] = useState(false); // Estado para o STATUS

  const handleShowForm = () => {
    setShowAssistanceForm(true);
    setShowProfile(false);
    setShowStatus(false);
  };

  const handleCloseForm = () => {
    setShowAssistanceForm(false);
  };

  const handleShowProfile = () => {
    setShowProfile(true);
    setShowAssistanceForm(false);
    setShowStatus(false);
  };

  const handleCloseProfile = () => {
    setShowProfile(false);
  };

  const handleShowStatus = () => {
    setShowStatus(true); // Exibe a tela de STATUS
    setShowAssistanceForm(false);
    setShowProfile(false);
  };

  const handleCloseStatus = () => {
    setShowStatus(false); // Fecha a tela de STATUS
  };

  return (
    <div className="home-layout">
      <NavBar
        onAssistClick={handleShowForm}
        onProfileClick={handleShowProfile}
        onStatusClick={handleShowStatus} // Adiciona o evento para STATUS
      />
      <Container
        showForm={showAssistanceForm}
        showProfile={showProfile}
        showStatus={showStatus} // Passa o estado do STATUS
        onCloseForm={handleCloseForm}
        onCloseProfile={handleCloseProfile}
        onCloseStatus={handleCloseStatus} // Passa o handler de fechar STATUS
      />
      <Chatbot />
      <Footer />
    </div>
  );
};

export default Home;
