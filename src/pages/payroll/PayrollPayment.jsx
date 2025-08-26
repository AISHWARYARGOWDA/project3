import React, { useState, useEffect } from "react";
import { accounts } from "../../common/mockData";
import { currencies } from "../../common/constants";
import PrimaryButton from "../../common/components/PrimaryButton";
import BackToDashboard from "../../common/components/BackToDashboard";
import { useNavigate, useLocation } from "react-router-dom";
import { getBatchById, upsertBatch } from "../../common/storage/payrollStore";

export default function PayrollPayment() {
  const navigate = useNavigate();
  const location = useLocation();
  const [editBatchId, setEditBatchId] = useState(null);

  const [instruction, setInstruction] = useState({
    paymentType: "Domestic",
    paymentCurrency: "",
    debitAccount: "",
    date: "",
  });

  const emptyPayment = {
    paymentMethod: "",
    payeeDetails: "",
    payeeName: "",
    bankDetails: "",
    yourReference: "",
    paymentReference: "",
    amount: "",
  };

  const [payments, setPayments] = useState([emptyPayment]);

  // If coming from ManagePayroll for editing
  useEffect(() => {
    if (location.state && location.state.batchId) {
      const batch = getBatchById(location.state.batchId);
      if (batch) {
        setEditBatchId(batch.id);
        setInstruction(batch.instruction);
        setPayments(batch.payments);
      }
    }
  }, [location.state]);

  const onInstruction = (e) => {
    const { name, value } = e.target;
    setInstruction((p) => ({ ...p, [name]: value }));
  };

  const onPayment = (row, e) => {
    const { name, value } = e.target;
    setPayments((prev) => {
      const next = [...prev];
      next[row][name] = value;
      return next;
    });
  };

  const addRow = () => setPayments((prev) => [...prev, { ...emptyPayment }]);

  const persist = (status) => {
    const batch = {
      id: editBatchId || Date.now(),
      instruction,
      payments,
      status, // "Draft" | "Submitted" | "Approved" | "Rejected"
      createdAt: editBatchId ? undefined : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    upsertBatch(batch);
  };

  const saveDraft = () => {
    persist("Draft");
    navigate("/manage-payroll");
  };

  const submit = (e) => {
    e.preventDefault();
    persist("Submitted");
    navigate("/manage-payroll");
  };

  return (
    <div className="container my-4">
      <div className="card card-shadow p-4">
        <h2 className="mb-4 text-center brand-gradient p-2 rounded">
          {editBatchId ? "Edit Payroll Batch" : "Create Payroll Payments"}
        </h2>

        <form onSubmit={submit}>
          {/* Instruction Details */}
          <h4 className="mb-3">Instruction Details</h4>
          <div className="row g-3" style={{ alignItems: "end" }}>
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold">Payment Type</label>
              <input
                className="form-control"
                name="paymentType"
                value={instruction.paymentType}
                onChange={onInstruction}
                placeholder="Payment Type"
              />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold">
                Select Currency <span className="text-danger">*</span>
              </label>
              <select
                className="form-select"
                name="paymentCurrency"
                value={instruction.paymentCurrency}
                onChange={onInstruction}
                required
              >
                <option value="">Select Currency</option>
                {currencies.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold">Select Debit Account</label>
              <select
                className="form-select"
                name="debitAccount"
                value={instruction.debitAccount}
                onChange={onInstruction}
                required
              >
                <option value="">Select Debit Account</option>
                {accounts.map((a) => (
                  <option key={a.id} value={a.number}>
                    {a.number} — {a.name}                  
                  </option>
                ))}
              </select>
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold">
                Date <span className="text-danger">*</span>
              </label>
              <input
                className="form-control"
                type="date"
                name="date"
                value={instruction.date}
                onChange={onInstruction}
                required
              />
            </div>
          </div>

          {/* Payment Details */}
          <h4 className="mt-4 mb-3">Payment Details</h4>
          <div className="table-responsive">
            <table className="table table-bordered align-middle text-center mb-2">
              <thead className="table-light">
                <tr>
                  <th>Payment Method</th>
                  <th>Payee Details</th>
                  <th>Payee Name</th>
                  <th>Bank Details</th>
                  <th>Your Reference</th>
                  <th>Payment Reference</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p, i) => (
                  <tr key={i}>
                    <td>
                      <select
                        className="form-select form-select-sm"
                        name="paymentMethod"
                        value={p.paymentMethod}
                        onChange={(e) => onPayment(i, e)}
                        required
                      >
                        <option value="">Select Method</option>
                        <option value="Account Number">Account Number</option>
                      </select>
                    </td>
                    <td>
                      <select
                        className="form-control form-control-sm"
                        name="payeeDetails"
                        value={p.payeeDetails}
                        onChange={(e) => onPayment(i, e)}
                        required
                      >
                        <option value="">Select Details</option>
                        <option value="Permanent employees">Permanent Employee</option>
                        <option value="Temporary employees">Temporary Employee</option>
                        <option value="Consultant">Consultant</option>
                        <option value="Apprentices/Interns/Trainees">Apprentices/Interns/Trainees</option>
                        <option value="Foreign Employees">Foreign Employees</option>
                      </select>
                    </td>
                    <td>
                      <input
                        className="form-control form-control-sm"
                        name="payeeName"
                        value={p.payeeName}
                        onChange={(e) => onPayment(i, e)}
                        required
                      />
                    </td>
                    <td>
                      <input
                        className="form-control form-control-sm"
                        name="bankDetails"
                        value={p.bankDetails}
                        onChange={(e) => onPayment(i, e)}
                        required
                      />
                    </td>
                    <td>
                      <input
                        className="form-control form-control-sm"
                        name="yourReference"
                        value={p.yourReference}
                        onChange={(e) => onPayment(i, e)}
                      />
                    </td>
                    <td>
                      <input
                        className="form-control form-control-sm"
                        name="paymentReference"
                        value={p.paymentReference}
                        onChange={(e) => onPayment(i, e)}
                      />
                    </td>
                    <td>
                      <input
                        className="form-control form-control-sm"
                        type="number"
                        name="amount"
                        value={p.amount}
                        onChange={(e) => onPayment(i, e)}
                        required
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button type="button" className="btn btn-outline-secondary mb-4" onClick={addRow}>
            + Add Payment Row
          </button>

          {/* Actions */}
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex gap-2">
              <BackToDashboard />
              <button type="button" className="btn btn-info" onClick={() => navigate("/manage-payroll")}>
                Go to Manage Payroll
              </button>
            </div>
            <div className="d-flex gap-2">
              <button type="button" className="btn btn-outline-secondary" onClick={saveDraft}>
                Save as Draft
              </button>
              <PrimaryButton type="submit">Submit</PrimaryButton>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}