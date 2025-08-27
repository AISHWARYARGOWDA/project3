import React, { useState } from "react";
import PrimaryButton from "../../common/components/PrimaryButton";
import BackToDashboard from "../../common/components/BackToDashboard";
import { upsertBatch } from "../../common/storage/payrollStore";

export default function PayrollPayment() {
  const [instruction, setInstruction] = useState({
    paymentCurrency: "",
    debitAccount: "",
    date: "",
  });
  const [payments, setPayments] = useState([
    { payeeDetails: "", payeeName: "", accountNumber: "", reference: `REF-${Date.now()}`, amount: 0 },
  ]);
  const handleInstructionChange = (e) => {
    const { name, value } = e.target;
    setInstruction((prev) => ({ ...prev, [name]: value }));
  };
const handlePaymentChange = (index, e) => {
  const { name, value } = e.target;
  setPayments((prev) => {
    const updated = [...prev];

    if (name === "amount") {
      // Remove all non-digits first
      const rawValue = value.replace(/[^\d]/g, "");
      updated[index][name] = rawValue; // store plain number in state
    } else {
      updated[index][name] = value; // for other fields
    }
    return updated;
  });
};
  const addPaymentRow = () => {
    setPayments((prev) => [...prev, { payeeDetails: "", payeeName: "", accountNumber: "", reference: `REF-${Date.now()}`, amount: 0 }]);
  };
  const removePaymentRow = (index) => {
    setPayments((prev) => prev.filter((_, i) => i !== index));
  };
  const saveBatch = (status) => {
    upsertBatch({
      id: Date.now(),
      instruction,
      payments,
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    window.location.href = "/manage-payroll";
  };

  const totalAmount = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const formatAmount = (amount) => instruction.paymentCurrency ? `${amount.toLocaleString()} ${instruction.paymentCurrency}` : amount.toLocaleString();
  return (
    
    <div className="container p-2">
      <div className="card p-3">
        <h2 className="text-center mb-3">Create Payroll Payments</h2>

        <form onSubmit={(e) => { e.preventDefault(); saveBatch("Submitted"); }}>
          {/* Instruction Details */}
          <h4>Instruction Details</h4>
          <div className="row mb-3">
            <div className="col">
              <label>Debit Account *</label>
              <select name="debitAccount" value={instruction.debitAccount} onChange={handleInstructionChange} className="form-select" required>
                <option value="">Select Debit Account</option>
                <option value="Corporate INR">Corporate INR</option>
                <option value="Corporate USD">Corporate USD</option>
              </select>
            </div>

            <div className="col">
              <label>Currency *</label>
              <select name="paymentCurrency" value={instruction.paymentCurrency} onChange={handleInstructionChange} className="form-select" required>
                <option value="">Select Currency</option>
                 <option value="INR">Corporate INR</option>
                <option value="USD">Corporate USD</option>
              </select>
            </div>

            <div className="col">
              <label>Date *</label>
              <input type="date" name="date" value={instruction.date} onChange={handleInstructionChange} className="form-control" required />
            </div>
          </div>
           <h4 className="d-flex justify-content-between">
  <span>Payment Details</span>
</h4>
          <div style={{ maxHeight: "250px", overflow: "auto", border: "1px solid #ccc", borderRadius: "5px" }}>
            <table className="table table-bordered text-center mb-0">
              <thead className="table-light" style={{ position: "sticky", top: 0 }}>
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
                    <td><input className="form-control form-control-sm" name="reference" value={p.reference} readOnly /></td>
                    <td><input className="form-control form-control-sm" name="payeeDetails" value={p.payeeDetails} onChange={(e) => handlePaymentChange(i, e)} required /></td>
                    <td><input className="form-control form-control-sm" name="payeeName" value={p.payeeName} onChange={(e) => handlePaymentChange(i, e)} required /></td>
                    <td><input className="form-control form-control-sm" name="accountNumber" value={p.accountNumber} onChange={(e) => handlePaymentChange(i, e)} required /></td>
                    <td><input className="form-control form-control-sm text-end" type="text" name="amount" value={formatAmount(Number(p.amount || 0))} onChange={(e) => handlePaymentChange(i, e)} required /></td>
                    <td><button type="button" className="btn btn-sm btn-danger" onClick={() => removePaymentRow(i)}>Remove</button></td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="5" className="text-end fw-bold">Total Amount</td>
                  <td className="fw-bold text-end">{totalAmount.toLocaleString()}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>

          <button type="button" className="btn btn-outline-secondary my-2" onClick={addPaymentRow}>+ Add Payment Row</button>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <BackToDashboard />
            <div className="d-flex gap-2">
              <button type="button" className="btn btn-outline-secondary" onClick={() => saveBatch("Draft")}>Save as Draft</button>
              <PrimaryButton type="submit">Submit</PrimaryButton>
            </div>
          </div>
        </form>
      </div>
    </div> 
  );
}
