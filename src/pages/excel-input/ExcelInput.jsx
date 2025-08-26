import React, { useState } from 'react';
import BackToDashboard from '../../common/components/BackToDashboard'

export default function ExcelInput() {
  const [rows, setRows] = useState([{ employeeId:'', amount:'', currency:'INR' }]);

  const addRow = ()=> setRows(r => [...r, { employeeId:'', amount:'', currency:'INR' }]);
  const removeRow = (i)=> setRows(r => r.filter((_,idx)=>idx!==i));
  const update = (i,k,v)=> setRows(r => r.map((row,idx)=> idx===i? {...row,[k]:v}:row));

  const pasteMock = ()=>{
    setRows([
      { employeeId:'E101', amount:'55000', currency:'INR' },
      { employeeId:'E102', amount:'61000', currency:'INR' }
    ]);
  };

  return (
    <div className="card card-shadow p-3">
      <h2 className="h5">Excel-style Transaction Entry</h2>
      <div className="table-responsive">
        <table className="table table-bordered table-sm align-middle">
          <thead className="table-light">
            <tr><th>Employee ID</th><th>Amount</th><th>Currency</th><th style={{width:100}}>Action</th></tr>
          </thead>
          <tbody>
            {rows.map((r,i)=>(
              <tr key={i}>
                <td><input className="form-control form-control-sm" value={r.employeeId} onChange={e=>update(i,'employeeId',e.target.value)}/></td>
                <td><input className="form-control form-control-sm" type="number" value={r.amount} onChange={e=>update(i,'amount',e.target.value)}/></td>
                <td>
                  <select className="form-select form-select-sm" value={r.currency} onChange={e=>update(i,'currency',e.target.value)}>
                    <option>INR</option><option>USD</option><option>EUR</option>
                  </select>
                </td>
                <td><button className="btn btn-outline-danger btn-sm" onClick={()=>removeRow(i)}>Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="d-flex gap-2">
        <button className="btn btn-outline-secondary" onClick={addRow}>Add row</button>
        <button className="btn btn-outline-secondary" onClick={pasteMock}>Paste mock</button>
        <button className="btn btn-primary" onClick={()=>alert('Saved draft (mock)')}>Save as Draft</button>
      </div>
      <BackToDashboard />
    </div>
  );
}