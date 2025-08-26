import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BackToDashboard from "../../common/components/BackToDashboard";
import { getAllBatches, saveAllBatches, setStatus, deleteBatch, downloadText } from "../../common/storage/payrollStore";

export default function ManagePayroll() {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setBatches(getAllBatches());
  }, []);

  const refresh = () => setBatches(getAllBatches());

  const editBatch = (batchId) => navigate("/payroll", { state: { batchId } });

  const submitDraft = (batchId) => {
    setStatus(batchId, "Submitted", { updatedAt: new Date().toISOString() });
    refresh();
  };

  const remove = (batchId) => {
    deleteBatch(batchId);
    refresh();
  };

  const viewDetails = (batch) => setSelectedBatch(batch);
  const closeModal = () => setSelectedBatch(null);

  const printBatch = () => {
    const html = document.getElementById("batch-print-section").innerHTML;
    const w = window.open("", "_blank");
    w.document.write(`
      <html>
        <head>
          <title>Payroll Batch ${selectedBatch.id}</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .brand-header { display: flex; align-items: center; gap: 10px; border-bottom: 3px solid #0072CE; padding-bottom: 10px; margin-bottom: 20px; }
            .brand-header img { height: 50px; }
            .brand-title { font-size: 24px; font-weight: bold; background: linear-gradient(90deg, #0072CE, #00A859); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
            h6 { background: linear-gradient(90deg, #0072CE, #00A859); color: white; padding: 5px; border-radius: 4px; margin-top: 20px; }
            table { border: 1px solid #ddd !important; }
            th { background-color: #f1f1f1; }
            td, th { padding: 6px !important; border: 1px solid #ccc !important; }
          </style>
        </head>
        <body>
          <div class="brand-header">
            <img src="../../assets/sc-logo.png" alt="Standard Chartered Logo" />
            <span class="brand-title">Payroll Batch Summary</span>
          </div>
          ${html}
        </body>
      </html>
    `);
    w.document.close();
    w.print();
  };

  const downloadSummary = (batch) => {
    const lines = [
      `Payroll Batch Summary — ${batch.id}`,
      `Status: ${batch.status}`,
      `Created: ${batch.createdAt ? new Date(batch.createdAt).toLocaleString() : "-"}`,
      `Updated: ${batch.updatedAt ? new Date(batch.updatedAt).toLocaleString() : "-"}`,
      `Payment Type: ${batch.instruction.paymentType}`,
      `Currency: ${batch.instruction.paymentCurrency}`,
      `Debit Account: ${batch.instruction.debitAccount}`,
      `Date: ${batch.instruction.date}`,
      "",
      "Payments:",
      ...batch.payments.map((p, i) => `${i + 1}. ${p.payeeName} | ${p.amount} ${batch.instruction.paymentCurrency} | ${p.bankDetails} | Ref: ${p.paymentReference || "-"}`)
    ];
    downloadText(`Payroll_${batch.id}_Summary.txt`, lines.join("\n"));
  };

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Manage Payroll Batches</h2>
        <BackToDashboard />
      </div>

      <div className="table-responsive">
        <table className="table table-bordered text-center align-middle">
          <thead className="table-light">
            <tr>
              <th>Batch ID</th>
              <th>Status</th>
              <th>Date Created</th>
              <th>Payments Count</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {batches.length === 0 && (
              <tr><td colSpan="5">No payroll batches found.</td></tr>
            )}
            {batches.map((b) => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>
                  <span className={
                    "badge " + (b.status === "Approved" ? "bg-success"
                              : b.status === "Rejected" ? "bg-danger"
                              : b.status === "Submitted" ? "bg-warning text-dark"
                              : "bg-secondary")
                  }>
                    {b.status}
                  </span>
                </td>
                <td>{b.createdAt ? new Date(b.createdAt).toLocaleString() : "-"}</td>
                <td>{b.payments.length}</td>
                <td className="text-nowrap">
                  <button className="btn btn-sm btn-info me-2" onClick={() => viewDetails(b)}>View</button>
                  {b.status === "Draft" && (
                    <>
                      <button className="btn btn-sm btn-primary me-2" onClick={() => editBatch(b.id)}>Edit</button>
                      <button className="btn btn-sm btn-success me-2" onClick={() => submitDraft(b.id)}>Submit</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => remove(b.id)}>Delete</button>
                    </>
                  )}
                  {(b.status === "Approved" || b.status === "Rejected") && (
                    <button className="btn btn-sm btn-outline-primary" onClick={() => downloadSummary(b)}>
                      Download Summary
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      {selectedBatch && (
        <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Batch Details — {selectedBatch.id}</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body" id="batch-print-section">
                <h6>Instruction Details</h6>
                <ul>
                  <li><strong>Payment Type:</strong> {selectedBatch.instruction.paymentType}</li>
                  <li><strong>Currency:</strong> {selectedBatch.instruction.paymentCurrency}</li>
                  <li><strong>Debit Account:</strong> {selectedBatch.instruction.debitAccount}</li>
                  <li><strong>Date:</strong> {selectedBatch.instruction.date}</li>
                </ul>

                <h6>Payments</h6>
                <div className="table-responsive">
                  <table className="table table-sm table-bordered">
                    <thead>
                      <tr>
                        <th>Method</th>
                        <th>Payee Details</th>
                        <th>Payee Name</th>
                        <th>Bank Details</th>
                        <th>Your Ref</th>
                        <th>Payment Ref</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedBatch.payments.map((p, idx) => (
                        <tr key={idx}>
                          <td>{p.paymentMethod}</td>
                          <td>{p.payeeDetails}</td>
                          <td>{p.payeeName}</td>
                          <td>{p.bankDetails}</td>
                          <td>{p.yourReference}</td>
                          <td>{p.paymentReference}</td>
                          <td>{p.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {(selectedBatch.status === "Approved" || selectedBatch.status === "Rejected") && selectedBatch.approvedAt && (
                  <>
                    <h6>Approval</h6>
                    <ul>
                      <li><strong>Decision:</strong> {selectedBatch.status}</li>
                      <li><strong>By:</strong> {selectedBatch.approvedBy || "-"}</li>
                      <li><strong>At:</strong> {new Date(selectedBatch.approvedAt).toLocaleString()}</li>
                      {selectedBatch.remarks && <li><strong>Remarks:</strong> {selectedBatch.remarks}</li>}
                    </ul>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline-primary" onClick={printBatch}>Print</button>
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}