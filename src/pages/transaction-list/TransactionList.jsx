import React, { useEffect, useState } from "react";
import { getAllBatches, downloadText } from "../../common/storage/payrollStore";

export default function TransactionList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const all = getAllBatches();
    setItems(all.filter(b => b.status === "Approved" || b.status === "Rejected"));
  }, []);

  const downloadSummary = (batch) => {
    const lines = [
      `Payroll Batch Summary — ${batch.id}`,
      `Status: ${batch.status}`,
      `Created: ${batch.createdAt ? new Date(batch.createdAt).toLocaleString() : "-"}`,
      `Decision At: ${batch.approvedAt ? new Date(batch.approvedAt).toLocaleString() : "-"}`,
      `Decision By: ${batch.approvedBy || "-"}`,
      `Remarks: ${batch.remarks || "-"}`,
      "",
      `Payment Type: ${batch.instruction.paymentType}`,
      `Currency: ${batch.instruction.paymentCurrency}`,
      `Debit Account: ${batch.instruction.debitAccount}`,
      `Date: ${batch.instruction.date}`,
      "",
      "Payments:",
      ...batch.payments.map((p, i) =>
        `${i + 1}. ${p.payeeName} | ${p.amount} ${batch.instruction.paymentCurrency} | ${p.bankDetails}`
      )
    ];
    downloadText(`Payroll_${batch.id}_Summary.txt`, lines.join("\n"));
  };

  return (
    <div className="container my-4">
      <h2>Transactions</h2>

      <div className="table-responsive mt-3">
        <table className="table table-bordered align-middle text-center">
          <thead className="table-light">
            <tr>
              <th>Batch ID</th>
              <th>Status</th>
              <th>Created</th>
              <th>Decision</th>
              <th>Payments</th>
              <th>Download</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan="6">No transactions yet.</td></tr>
            ) : (
              items.map((b) => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>
                    <span className={
                      "badge " + (b.status === "Approved" ? "bg-success" : "bg-danger")
                    }>{b.status}</span>
                  </td>
                  <td>{b.createdAt ? new Date(b.createdAt).toLocaleString() : "-"}</td>
                  <td>
                    {b.approvedAt ? new Date(b.approvedAt).toLocaleString() : "-"}
                    {b.approvedBy ? ` by ${b.approvedBy}` : ""}
                    {b.remarks ? <div className="small text-muted">“{b.remarks}”</div> : null}
                  </td>
                  <td>{b.payments.length}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary" onClick={() => downloadSummary(b)}>
                      Download Summary
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* NOTE: everything here is read-only; no edit/delete buttons */}
    </div>
  );
}