import React from "react";
import { NavLink } from "react-router-dom";
import BackToDashboard from "../../common/components/BackToDashboard";

export default function Sidebar(){
  const allowedPages = JSON.parse(localStorage.getItem("allowedPages")||"[]");
  const currentUser = JSON.parse(localStorage.getItem("currentUser")||"null");

  const ALL = [
    {name:"Dashboard", path:"/dashboard", icon:"🏠"},
    {name:"Create Payroll", path:"/payroll", icon:"💸"},
    {name:"Manage Payroll", path:"/manage-payroll", icon:"📂"},
    {name:"Approve Payroll", path:"/approvals", icon:"✅"},
    {name:"Account Balance", path:"/balances", icon:"💰"},
    {name:"Transactions", path:"/txns", icon:"📊"},
    {name:"Print Preview", path:"/print", icon:"🖨️"},
  ];

  const allowed = new Set(allowedPages.map(p=>p.path));
  const filtered = ALL.filter(p=>allowed.has(p.path));

  return (
    <aside className="sidebar">
      <div className="welcome">
        <div className="fw-bold">Welcome, {currentUser?.username}</div>
        <div className="text-white-50" style={{fontSize:13}}>{currentUser?.role}</div>
      </div>
      <ul className="nav">
        {filtered.map(item=>(
          <li key={item.path}>
            <NavLink to={item.path} className={({isActive}) => `nav-link ${isActive?'active':''}`}>
              <span style={{fontSize:18}}>{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
}