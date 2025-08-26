import React from 'react';
import { Routes, Route, NavLink, useLocation, useNavigate } from 'react-router-dom';
import Header from './common/components/Header';
import Footer from './common/components/Footer';
import Login from './pages/login/Login';
import Dashboard from './pages/dashboard/Dashboard';
import PayrollPayment from './pages/payroll/PayrollPayment';
import ManagePayroll from './pages/manage-payroll/ManagePayroll';
import ExcelInput from './pages/excel-input/ExcelInput';
import TransactionList from './pages/transaction-list/TransactionList';
import Approval from './pages/approval/ApprovePayroll';
import AccountBalance from './pages/account-balance/AccountBalance';
import PrintPreview from './pages/print-preview/PrintPreview';
import ApprovePayroll from './pages/approval/ApprovePayroll';

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const allowedPages = JSON.parse(localStorage.getItem('allowedPages') || '[]');

  const logout = () => {
    localStorage.removeItem('allowedPages');
    navigate('/');
  };

  const isLoginPage = location.pathname === '/';

  return (
    <div className="app d-flex flex-column min-vh-100">
      {!isLoginPage && (
        <Header>
          <button
            className="btn btn-light btn-sm"
            style={{
              backgroundColor: '#0072CE',
              color: '#fff',
              border: 'none',
              padding: '5px 12px',
              borderRadius: '4px'
            }}
            onClick={logout}
          >
            Logout
          </button>
        </Header>
      )}

      <div className="container-fluid py-3 flex-grow-1">
        <div className="row">
          {!isLoginPage && (
            <aside className="col-12 col-md-2 mb-3 mb-md-0">
              <nav className="list-group shadow-sm">
                {allowedPages.map(({ name, path }) => (
                  <NavLink
                    key={path}
                    to={path}
                    end
                    className={({ isActive }) =>
                      'list-group-item list-group-item-action' +
                      (isActive ? ' active' : '')
                    }
                  >
                    {name}
                  </NavLink>
                ))}
              </nav>
            </aside>
          )}

          <main className={isLoginPage ? 'col-12' : 'col-12 col-md-10'}>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />

              <Route path="/payroll" element={<PayrollPayment />} />
              <Route path="/manage-payroll" element={<ManagePayroll />} />

          
              <Route path="/approvals" element={<ApprovePayroll />} />
                
              <Route path="/excel" element={<ExcelInput />} />
              <Route path="/txns" element={<TransactionList />} />
              <Route path="/balances" element={<AccountBalance />} />
              <Route path="/print" element={<PrintPreview />} />
            </Routes>
          </main>
        </div>
      </div>

      {!isLoginPage && <Footer />}
    </div>
  );
}