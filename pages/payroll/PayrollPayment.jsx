import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
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

  // Instruction state
  const [instruction, setInstruction] = useState({
    paymentCurrency: "",
    debitAccount: "",
    date: "",
  });

  // Default empty payment row
  const emptyPayment = {
    payeeDetails: "",
    payeeName: "",
    accountNumber: "",
    reference: `REF-${Date.now()}`,
    amount: "",
  };

  const [payments, setPayments] = useState([emptyPayment]);

  // Load existing batch for editing
  useEffect(() => {
    if (location.state?.batchId) {
      const batch = getBatchById(location.state.batchId);
      if (batch) {
        setEditBatchId(batch.id);
        setInstruction(batch.instruction);
        setPayments(batch.payments);
      }
    }
  }, [location.state]);

  // Handle instruction input
  const onInstruction = (e) => {
    const { name, value } = e.target;
    setInstruction((prev) => ({ ...prev, [name]: value }));
  };

  // Handle payment row input
  const onPayment = (row, e) => {
    const { name, value } = e.target;
    setPayments((prev) => {
      const next = [...prev];
      next[row][name] = value;
      return next;
    });
  };

  // Add new row
  const addRow = () =>
    setPayments((prev) => [
      ...prev,
      { ...emptyPayment, reference: `REF-${Date.now()}` },
    ]);

  // Remove row
  const removeRow = (index) =>
    setPayments((prev) => prev.filter((_, i) => i !== index));

  // Persist batch (draft / submitted)
  const persist = (status) => {
    const batch = {
      id: editBatchId || Date.now(),
      instruction,
      payments,
      status,
      createdAt: editBatchId ? undefined : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    upsertBatch(batch);
  };

  // Save as draft
  const saveDraft = () => {
    persist("Draft");
    navigate("/manage-payroll");
  };

  // Submit batch
  const submit = (e) => {
    e.preventDefault();
    persist("Submitted");
    navigate("/manage-payroll");
  };

  // Handle Excel Upload
  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);

      const newPayments = data.map((row) => ({
        payeeDetails: row["Payee Role"] || "",
        payeeName: row["Payee Name"] || "",
        accountNumber: row["Account Number"] || "",
        amount: row["Amount"] || "",
        reference: `REF-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      }));

      setPayments((prev) => [...prev, ...newPayments]);
    };
    reader.readAsBinaryString(file);
  };

  // Calculate total
  const totalAmount = payments.reduce(
    (sum, p) => sum + (parseFloat(p.amount) || 0),
    0
  );

  return (
    <div className="container-fluid p-2" style={{ marginTop: "0px" }}>
      <div className="card card-shadow p-3">
        {/* Heading */}
        <h2 className="mb-3 text-center p-2 rounded">
          {editBatchId ? "Edit Payroll Batch" : "Create Payroll Payments"}
        </h2>

        <form onSubmit={submit}>
          {/* Instruction Details */}
          <h4 className="mb-3">Instruction Details</h4>
          <div className="row g-3 align-items-end mb-4">
            {/* Debit Account */}
            <div className="col-12 col-md-4">
              <label className="form-label fw-semibold">
                Select Debit Account <span className="text-danger">*</span>
              </label>
              <select
                className="form-select form-select-sm"
                name="debitAccount"
                value={instruction.debitAccount}
                onChange={onInstruction}
                required
              >
                <option value="">Select Debit Account</option>
                {accounts.map((a) => (
                  <option key={a.id} value={a.number}>
                    {a.number} — {a.name} (Bal: {a.balance.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            {/* Currency */}
            <div className="col-12 col-md-4">
              <label className="form-label fw-semibold">
                Select Currency <span className="text-danger">*</span>
              </label>
              <select
                className="form-select form-select-sm"
                name="paymentCurrency"
                value={instruction.paymentCurrency}
                onChange={onInstruction}
                required
              >
                <option value="">Select Currency</option>
                {currencies.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div className="col-12 col-md-4">
              <label className="form-label fw-semibold">
                Date <span className="text-danger">*</span>
              </label>
              <input
                className="form-control form-control-sm"
                type="date"
                name="date"
                value={instruction.date}
                onChange={onInstruction}
                required
              />
            </div>
          </div>

          {/* Payment Details */}
          <h4 className="mt-4 mb-3 d-flex justify-content-between align-items-center">
            <span>Payment Details</span>
            <div className="d-flex gap-2">
              <a
                href="/templates/sample_payroll_upload.xlsx"
                download="payroll_template.xlsx"
                className="btn btn-sm btn-outline-primary"
              >
                ⬇️ Download Template
              </a>
              <label className="btn btn-sm btn-outline-success mb-0">
                📂 Upload Excel
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  hidden
                  onChange={handleExcelUpload}
                />
              </label>
            </div>
          </h4>

          {/* ✅ Scrollable Table */}
          <div
            style={{
              maxHeight: "250px",
              overflowY: "auto",
              overflowX: "auto",
              border: "1px solid #dee2e6",
              borderRadius: "6px",
            }}
          >
            <table className="table table-bordered align-middle text-center mb-0">
              <thead
                className="table-light"
                style={{ position: "sticky", top: 0, zIndex: 2 }}
              >
                <tr>
                  <th>S. No.</th>
                  <th>Reference</th>
                  <th>Payee Role</th>
                  <th>Payee Name</th>
                  <th>Account Number</th>
                  <th>Amount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>
                      <input
                        className="form-control form-control-sm"
                        name="reference"
                        value={p.reference}
                        readOnly
                      />
                    </td>
                    <td>
                      <input
                        className="form-control form-control-sm"
                        name="payeeDetails"
                        value={p.payeeDetails}
                        onChange={(e) => onPayment(i, e)}
                        required
                      />
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
                        name="accountNumber"
                        value={p.accountNumber}
                        onChange={(e) => onPayment(i, e)}
                        required
                      />
                    </td>
                    <td>
                      <input
                        className="form-control form-control-sm text-end"
                        type="text"
                        name="amount"
                        value={
                          p.amount
                            ? Number(p.amount).toLocaleString(
                                instruction.paymentCurrency === "INR"
                                  ? "en-IN"
                                  : "en-US"
                              )
                            : ""
                        }
                        onChange={(e) => {
                          const rawValue = e.target.value.replace(/,/g, "");
                          onPayment(i, {
                            target: { name: "amount", value: rawValue },
                          });
                        }}
                        required
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={() => removeRow(i)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="5" className="text-end fw-bold">
                    Total Amount
                  </td>
                  <td className="fw-bold text-end">
                    {totalAmount
                      ? Number(totalAmount).toLocaleString(
                          instruction.paymentCurrency === "INR"
                            ? "en-IN"
                            : "en-US"
                        )
                      : 0}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Add Row */}
          <button
            type="button"
            className="btn btn-outline-secondary my-3"
            onClick={addRow}
          >
            + Add Payment Row
          </button>

          {/* Actions */}
          <div className="d-flex justify-content-between align-items-center">
            <BackToDashboard />
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={saveDraft}
              >
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

