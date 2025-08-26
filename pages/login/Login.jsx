import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PrimaryButton from '../../common/components/PrimaryButton'; // if you use it; else replace with <button>
import './login.css';
import logo from '../../assets/sc-logowhite.png';

const roleMap = { maker:"Creator", checker:"Approver", auditor:"Viewer" };

const userAccess = {
  maker: {
    password: 'maker123',
    pages: [
      { name: 'Create Payroll', path: '/payroll' },
      { name: 'Manage Payroll', path: '/manage-payroll' },
      { name: 'Transactions', path: '/txns' },
    ],
  },
  checker: {
    password: 'checker123',
    pages: [
      { name: 'Approve Payroll', path: '/approvals' },
      { name: 'Account Balance', path: '/balances' },
      { name: 'Transactions', path: '/txns' },
    ],
  },
  auditor: {
    password: 'audit123',
    pages: [
      { name: 'Print Preview', path: '/print' },
      { name: 'Transactions', path: '/txns' },
    ],
  },
};

export default function Login(){
  const [username,setUsername] = useState('');
  const [pwd,setPwd] = useState('');
  const [error,setError] = useState('');
  const [overlay,setOverlay] = useState('');
  const navigate = useNavigate();

  const submit = (e)=>{
    e.preventDefault();
    const key = username.trim().toLowerCase();
    const user = userAccess[key];
    if(user && user.password===pwd){
      const userObj = { username:key, role:roleMap[key] };
      localStorage.setItem("currentUser", JSON.stringify(userObj));
      localStorage.setItem("allowedPages", JSON.stringify(user.pages));
      localStorage.setItem("lastLogin", new Date().toISOString());
      setOverlay(`Welcome, ${userObj.role} (${userObj.username})`);
      setTimeout(()=> navigate("/dashboard"), 900);
    }else{
      setError("Invalid username or password");
    }
  };

  return (
    <>
      {overlay && <div className="login-welcome">{overlay}</div>}
      <div className="container" style={{maxWidth:980, marginTop:60}}>
        <div className="d-flex align-items-center justify-content-center login-hero" style={{gap:18}}>
          <img src={logo} alt="SCB" style={{height:100}}/>
          <h2>Payment Initiations</h2>
        </div>

        <div className="card mt-3" style={{maxWidth:520, margin:"0 auto"}}>
          <div className="card-body">
            <h4 className="mb-2">Sign in</h4>
            <p className="text-white-50" style={{marginTop:-6}}>maker / checker / auditor</p>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={submit}>
              <div className="mb-2">
                <label className="form-label">User ID</label>
                <input className="form-control" value={username} onChange={e=>setUsername(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input type="password" className="form-control" value={pwd} onChange={e=>setPwd(e.target.value)} />
              </div>
              <button className="btn w-100">Sign In</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}