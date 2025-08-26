import React from 'react';
import { transactions } from '../../common/mockData';
import BackToDashboard from '../../common/components/BackToDashboard'

export default function PrintPreview() {
  const t = transactions[0]; // mock first transaction
  return (
    <div className="card card-shadow p-4">
      <h2 className="h5">Transaction Print Preview</h2>
      <div className="border p-3 bg-white">
        <h3 className="h6">Transaction #{t.id}</h3>
        <hr/>
        <p><strong>Date:</strong> {t.date}</p>
        <p><strong>Employee:</strong> {t.employeeId}</p>
        <p><strong>Amount:</strong> {t.currency} {t.amount}</p>
        <p><strong>Status:</strong> {t.status}</p>
      </div>
      <button className="btn btn-outline-primary mt-3" onClick={()=>window.print()}>Print</button>
    <BackToDashboard />
    </div>
  );
}