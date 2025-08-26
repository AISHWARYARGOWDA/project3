import React from "react";
import {Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "./common/components/Header";
import Footer from "./common/components/Footer";
import Sidebar from "./common/components/Sidebar";
import BackToDashboard from "./common/components/BackToDashboard";
import Login from "./pages/login/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import PayrollPayment from "./pages/payroll/PayrollPayment";
import ManagePayroll from "./pages/manage-payroll/ManagePayroll";
import ApprovePayroll from "./pages/approval/ApprovePayroll";
import TransactionList from "./pages/transaction-list/TransactionList";
import AccountBalance from "./pages/account-balance/AccountBalance";
import PrintPreview from "./pages/print-preview/PrintPreview";
import { initAccounts } from "./common/storage/accountBalanceStore";
import { accounts } from "./common/mockData";

initAccounts(accounts);
function ProtectedRoute({ children, allowedRoles }){
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if(!currentUser) return <Navigate to="/login" replace />;
  if(allowedRoles && !allowedRoles.map(r=>r.toLowerCase()).includes(currentUser.role.toLowerCase()))
    return <Navigate to="/dashboard" replace />;
  return children;
}

function Layout({ children }){
  const { pathname } = useLocation();
  const hideSidebar = pathname==="/login" || pathname==="/dashboard";
  return (
    <div className="app-shell">
      <Header />
      <div className="app-main">
        {!hideSidebar && <Sidebar />}
        <main className="app-content">{children}</main>
      </div>
      <Footer />
    </div>
  );
}

export default function App(){
  return (
    
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={
          <><Login/></>
        } />
        <Route path="/dashboard" element={
          <Layout><Dashboard/></Layout>
        } />

        {/* Creator (maker) */}
        <Route path="/payroll" element={
          <Layout>
            <ProtectedRoute allowedRoles={["Creator"]}><PayrollPayment/></ProtectedRoute>
          </Layout>
        } />
        <Route path="/manage-payroll" element={
          <Layout>
            <ProtectedRoute allowedRoles={["Creator"]}><ManagePayroll/></ProtectedRoute>
          </Layout>
        } />

        {/* Approver (checker) */}
        <Route path="/approvals" element={
          <Layout>
            <ProtectedRoute allowedRoles={["Approver"]}><ApprovePayroll/></ProtectedRoute>
          </Layout>
        } />
        <Route path="/balances" element={
          <Layout>
            <ProtectedRoute allowedRoles={["Approver"]}><AccountBalance/></ProtectedRoute>
          </Layout>
        } />

        {/* Viewer (auditor) */}
        <Route path="/print" element={
          <Layout>
            <ProtectedRoute allowedRoles={["Viewer"]}><PrintPreview/></ProtectedRoute>
          </Layout>
        } />

        {/* Shared */}
        <Route path="/txns" element={<Layout><TransactionList/></Layout>} />
      </Routes>
    
  );
}