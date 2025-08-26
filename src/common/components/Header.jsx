import React from 'react';
import { useLocation } from 'react-router-dom';
import logo from '../../assets/sc-logo.png';

export default function Header({ children }) {
  const location = useLocation();
  const isLoginPage = location.pathname === '/';

  return (
    <header className="brand-gradient d-flex align-items-center px-3 py-2 shadow-sm">
      <img src={logo} alt="Standard Chartered" className="header-logo" />
      <h1 className="h5 mb-0 text-white">Payment Initiations</h1>
      {/* Render extra content like Logout button */}
      {!isLoginPage && <div className="ms-auto">{children}</div>}
    </header>
  );
}