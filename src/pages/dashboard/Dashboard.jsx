import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [pages, setPages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const allowed = JSON.parse(localStorage.getItem('allowedPages') || '[]');
    if (!allowed.length) {
      navigate('/');
    } else {
      setPages(allowed);
    }
  }, [navigate]);

  return (
    <div className="container">
      <h2 className="h4 mb-3">Dashboard</h2>
      <div className="row g-3">
        {pages.map((p) => (
          <div key={p.path} className="col-md-4">
            <div className="card card-shadow p-3 h-100">
              <h5 className="card-title">{p.name}</h5>
              <Link className="btn btn-primary mt-auto" to={p.path}>Go to {p.name}</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}