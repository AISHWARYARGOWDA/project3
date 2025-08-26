import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/sc-logowhite.png";


export default function Header(){
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const currentUser = JSON.parse(localStorage.getItem("currentUser")||"null");
  const lastLogin = localStorage.getItem("lastLogin");

  // Breadcrumb: "Payment Initiations / Page"
  const map = {
    "/dashboard":"Dashboard",
    "/payroll":"Create Payroll",
    "/manage-payroll":"Manage Payroll",
    "/approvals":"Approve Payroll",
    "/balances":"Account Balance",
    "/txns":"Transactions",
    "/print":"Print Preview",
    "/login":"Login"
  };
  const here = map[pathname] || "—";

  const logout = () => {
    localStorage.removeItem("allowedPages");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("lastLogin");
    navigate("/login");
  };

  return (
    <header className="app-header">
      <div className="d-flex align-items-center justify-content-between">
        <div className="brand">
          <img className="header-logo" src={logo} alt="SCB"/>
          <div>
            <div className="header-title">Payment Initiations</div>
            <div className="header-crumb">{here}</div>
          </div>
        </div>

        <div className="header-right">
          {currentUser && (
            <>

              
              <span className="header-pill">
                👤 {currentUser.role} ({currentUser.username})
              </span>
              {lastLogin && (
                <span className="header-pill">
                  Last login: {new Date(lastLogin).toLocaleString()}
                </span>
              )}
            </>
          )}
          <button className="btn-logout" onClick={logout}>Logout</button>
          
        </div>
      </div>
    </header>
  );
}