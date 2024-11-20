import React from 'react';
import AssistanceForm from '../AssistanceForm/assistance-form';
import Profile from '../Profile/profile';
import Status from '../Status/status';
import './container.css';

interface ContainerProps {
  showForm: boolean;
  showProfile: boolean;
  showStatus: boolean; // Novo estado para a tela de status
  onCloseForm: () => void;
  onCloseProfile: () => void;
  onCloseStatus: () => void; // Novo handler para fechar a tela de status
}

const Container: React.FC<ContainerProps> = ({ showForm, showProfile, showStatus, onCloseForm, onCloseProfile, onCloseStatus }) => {
  return (
    <div className={`container ${showProfile ? 'no-background' : ''}`}>
      {showForm && (
        <div className="form-wrapper">
          <button className="close-button" onClick={onCloseForm}>✖</button>
          <AssistanceForm />
        </div>
      )}
      {showProfile && (
        <div className="profile-wrapper">
          <Profile onClose={onCloseProfile} />
        </div>
      )}
      {showStatus && (
        <div className="status-wrapper"> {/* Exclusivo para STATUS */}
          <Status />
          <button className="close-status-button" onClick={onCloseStatus}>✖</button> {/* Botão dentro da tela */}
        </div>
      )}
      {!showForm && !showProfile && !showStatus && (
        <div className="central-placeholder">
          <img src="src/assets/LogoEJOV-unsaturated.png" alt="LogoUnsaturated" />
        </div>
      )}
    </div>
  );
};

export default Container;
