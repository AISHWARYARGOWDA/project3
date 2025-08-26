import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PrimaryButton from '../../common/components/PrimaryButton';
import FormInput from '../../common/components/FormInput';
import './login.css';
 
const userAccess = {
  maker: {
    password: 'maker123',
    pages: [
      { name: 'Payroll Payment', path: '/payroll' },
      { name: 'Excel Input', path: '/excel' },
      { name: 'Account Balance', path: '/balances' },
      { name: 'Transactions', path: '/txns' }
    ]
  },
  checker: {
    password: 'checker123',
    pages: [
      { name: 'Approvals', path: '/approvals' },
      { name: 'Account Balance', path: '/balances' },
      { name: 'Transactions', path: '/txns' }
    ]
  },
  auditor: {
    password: 'audit123',
    pages: [
      { name: 'Print Preview', path: '/print' },
      { name: 'Account Balance', path: '/balances' },
      { name: 'Transactions', path: '/txns' }
    ]
  }
};
 
export default function Login() {
  const [username, setUsername] = useState('');
  const [pwd, setPwd] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
 
  const submit = (e) => {
    e.preventDefault();
    const user = userAccess[username];
    if (user && user.password === pwd) {
      localStorage.setItem('allowedPages', JSON.stringify(user.pages));
      navigate('/dashboard');
    } else {
      setError('Invalid username or password');
    }
  };
 
  return (
  <div className="login-page">
    <div className="login-card">
      <h2 className="mb-4">Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={submit}>
        <FormInput label="Username" value={username} onChange={setUsername} required />
        <FormInput label="Password" type="password" value={pwd} onChange={setPwd} required />
        <PrimaryButton type="submit">Sign in</PrimaryButton>
      </form>
    </div>
  </div>
);
}