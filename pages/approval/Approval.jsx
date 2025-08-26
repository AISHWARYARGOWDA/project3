import React, { useState } from 'react';
import { approvals } from '../../common/mockData';
import DataTable from '../../common/components/DataTable';
import ConfirmModal from '../../common/components/ConfirmModal';
import BackToDashboard from '../../common/components/BackToDashboard'

export default function Approval() {
  const [list, setList] = useState(approvals);

  const act = (id, action) => {
    setList(l => l.filter(x => x.id !== id));
    alert(`${action} ${id} (mock)`);
  };

  const columns = [
    { key:'id', header:'ID' },
    { key:'date', header:'Date' },
    { key:'employeeId', header:'Employee' },
    { key:'currency', header:'CCY' },
    { key:'amount', header:'Amount' }
  ];

  return (
    <div className="d-grid gap-3">
      <h2 className="h5">Pending Approvals</h2>
      <DataTable
        columns={columns}
        rows={list}
        actions={(r)=>(
          <>
            <button
              className="btn btn-sm btn-outline-success me-2"
              data-bs-toggle="modal"
              data-bs-target="#approve"
              onClick={()=>window.__approve_id=r.id}
            >Approve</button>
            <button
              className="btn btn-sm btn-outline-danger"
              data-bs-toggle="modal"
              data-bs-target="#reject"
              onClick={()=>window.__reject_id=r.id}
            >Reject</button>
          </>
        )}
      />
      <ConfirmModal id="approve" title="Approve payment"
        body="Are you sure you want to approve?"
        onConfirm={()=>act(window.__approve_id,'Approved')} />
      <ConfirmModal id="reject" title="Reject payment"
        body="Are you sure you want to reject?"
        onConfirm={()=>act(window.__reject_id,'Rejected')} />
        <BackToDashboard />
    </div>
  );
}