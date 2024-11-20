import React from 'react';
import './alert.css';

interface AlertProps {
    message: string;
    type: 'success' | 'error' | 'warning';
  }
  
  const Alert: React.FC<AlertProps> = ({ message, type }) => {
    if (!message) return null;  
  
    return (
      <div className={`alert ${type}`}>
        <span className="alert-message">{message}</span>
      </div>
    );
  };
  
  export default Alert;