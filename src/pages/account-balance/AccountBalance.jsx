import React, { useState } from 'react';
import { accounts } from '../../common/mockData';
import BackToDashboard from '../../common/components/BackToDashboard'

export default function AccountBalance() {
  const [selected, setSelected] = useState(accounts[0].id);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const acc = accounts.find(a=>a.id===selected);

  return (
    <div className="d-grid gap-3">
      <div className="row g-3">
        {accounts.map(a=>(
          <div className="col-md-4" key={a.id}>
            <div className="card card-shadow p-3">
              <div className="d-flex justify-content-between">
                <strong>{a.name}</strong>
                <span className="badge bg-secondary">{a.currency}</span>
              </div>
              <div className="display-6">{a.currency} {a.balance.toLocaleString()}</div>
              <button
                className="btn btn-sm btn-outline-primary mt-2"
                onClick={()=>setSelected(a.id)}
              >
                View Statement
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="card card-shadow p-3">
        <h2 className="h6 mb-3">Statement (mock) — {acc.name}</h2>
        <div className="row g-2">
          <div className="col-auto">
            <input type="date" className="form-control" value={from} onChange={e=>setFrom(e.target.value)} />
          </div>
          <div className="col-auto">
            <input type="date" className="form-control" value={to} onChange={e=>setTo(e.target.value)} />
          </div>
          <div className="col-auto">
            <button className="btn btn-outline-secondary" onClick={()=>alert('Fetch mock statement')}>Fetch</button>
          </div>
          <div className="col-auto">
            <button className="btn btn-primary" onClick={()=>alert('Download mock PDF')}>Download</button>
          </div>
        </div>
      </div>
      <BackToDashboard />
    </div>
  );
}