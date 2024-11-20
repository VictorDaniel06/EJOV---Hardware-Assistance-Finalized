import React from 'react';
import './layout-login.css';

interface LayoutLoginProps {
  children: React.ReactNode;
}

const LayoutLogin: React.FC<LayoutLoginProps> = ({ children }) => {
  return (
    <div className="layout-container">
      <section className="form-section">
        {children}
      </section>
      <section className="image-section">
        <div className="image-placeholder">
          <img src="src/assets/LogoEJOV-unsaturated.png" alt="LOGO-UNSATURED"></img>
        </div>
      </section>
    </div>
  );
};

export default LayoutLogin;
