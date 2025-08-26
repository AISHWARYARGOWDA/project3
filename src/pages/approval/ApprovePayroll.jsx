import React, { useState, useEffect } from "react";
import BackToDashboard from "../../common/components/BackToDashboard";
import { getAllBatches, saveAllBatches, setStatus, downloadText } from "../../common/storage/payrollStore";

export default function ApprovePayroll() {
  const [submissions, setSubmissions] = useState([]);
  const [remarks, setRemarks] = useState({}); // track remarks per batch

  const refresh = () => {
    const all = getAllBatches();
    setSubmissions(all.filter(b => b.status === "Submitted"));
  };

  useEffect(() => { refresh(); }, []);

  const decide = (batchId, decision) => {
    const meta = {
      approvedBy: "Approver User",
      approvedAt: new Date().toISOString(),
      remarks: remarks[batchId] || ""
    };
    setStatus(batchId, decision, meta);
    refresh();
  };

  const onRemarkChange = (id, value) => {
    setRemarks(prev => ({ ...prev, [id]: value }));
  };

  const downloadSummary = (batch) => {
    const lines = [
      `Payroll Batch Summary — ${batch.id}`,
      `Status: ${batch.status}`,
      `Created: ${batch.createdAt ? new Date(batch.createdAt).toLocaleString() : "-"}`,
      `Payment Type: ${batch.instruction.paymentType}`,
      `Currency: ${batch.instruction.paymentCurrency}`,
      `Debit Account: ${batch.instruction.debitAccount}`,
      `Date: ${batch.instruction.date}`,
      "",
      "Payments:",
      ...batch.payments.map((p, i) => `${i + 1}. ${p.payeeName} | ${p.amount} ${batch.instruction.paymentCurrency}`)
    ];
    downloadText(`Payroll_${batch.id}_Summary.txt`, lines.join("\n"));
  };

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Approve Payroll</h2>
        <BackToDashboard />
      </div>

      {submissions.length === 0 ? (
        <p>No payrolls awaiting approval.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered align-middle text-center">
            <thead className="table-light">
              <tr>
                <th>Batch ID</th>
                <th>Created</th>
                <th>Payments</th>
                <th>Remarks</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((b) => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{b.createdAt ? new Date(b.createdAt).toLocaleString() : "-"}</td>
                  <td>{b.payments.length}</td>
                  <td style={{ minWidth: 220 }}>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Optional remarks"
                      value={remarks[b.id] || ""}
                      onChange={(e) => onRemarkChange(b.id, e.target.value)}
                    />
                  </td>
                  <td className="text-nowrap">
                    <button className="btn btn-success btn-sm me-2" onClick={() => decide(b.id, "Approved")}>
                      Approve
                    </button>
                    <button className="btn btn-danger btn-sm me-2" onClick={() => decide(b.id, "Rejected")}>
                      Reject
                    </button>
                    <button className="btn btn-outline-primary btn-sm" onClick={() => downloadSummary(b)}>
                      Download Summary
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}