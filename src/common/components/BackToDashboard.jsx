import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function BackToDashboard() {
  const navigate = useNavigate();
  return (
    <button
      className="btn btn-secondary mt-4"
      onClick={() => navigate('/dashboard')}
    >
      ← Back to Dashboard
    </button>
  );
}