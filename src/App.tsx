import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login/login/login';
import Register from './pages/Login/register/register';
import ResetPassword from './pages/Login/reset-password/reset-password';
import ResetPasswordConfirmation from './pages/Login/rpConfirmation/reset-password-confirmation';
import Home from './pages/AssistanceScreens/Home/home';
import Status from './pages/AssistanceScreens/components/Status/status'
import { auth } from './Firebase/firebaseConfig';


const App: React.FC = () => {
  const [user, setUser] = useState<unknown>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return unsubscribe;
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/rp" element={<ResetPassword />} />
        <Route path="/rpconfirm" element={<ResetPasswordConfirmation/>} />
        <Route path="/home" element={user ? <Home /> : <Navigate to="/login" replace />} />
        <Route path="/status" element={<Status/>} />
      </Routes>
    </Router>
  );
};

export default App;
