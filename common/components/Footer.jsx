import React from "react";

export default function Footer(){
  const currentUser = JSON.parse(localStorage.getItem("currentUser")||"null");
  return (
    <footer className="app-footer">
      <div className="d-flex justify-content-center align-items-center">
        <span>Welcome, {currentUser?.username ?? "Guest"} — Standard Chartered Bank</span>
        <span>© {new Date().getFullYear()} Standard Chartered</span>
      </div>
    </footer>
  );
}