import React, { useState, useEffect } from "react";
import { getAccounts } from "../../common/storage/accountBalanceStore";
import { getAllBatches } from "../../common/storage/payrollStore";
import BackToDashboard from "../../common/components/BackToDashboard";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../../assets/sc-logo.png";
import scLogo from "../../assets/sc-logo.png"; // <-- ensure logo exists

export default function AccountBalance() {
  const [accounts, setAccounts] = useState([]);
  const [selectedAcc, setSelectedAcc] = useState("");
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    setAccounts(getAccounts());
  }, []);

  useEffect(() => {
    if (selectedAcc) {
      const batches = getAllBatches();
      const txns = [];

      batches.forEach((batch) => {
        if (batch.status === "Approved" && batch.instruction.debitAccount === selectedAcc) {
          batch.payments.forEach((p) => {
            txns.push({
              ref: p.reference,
              payee: p.payeeName,
              amount: p.amount,
              date: batch.approvedAt,
              type: "Debit",
            });
          });
        }
      });

      setTransactions(txns);
    }
  }, [selectedAcc]);

  const downloadStatement = (account) => {
    const doc = new jsPDF();
    doc.addImage(logo, "PNG", 10, 10, 30, 15);
    doc.setFontSize(16);
    doc.text("Account Statement", 50, 20);
    doc.setFontSize(12);
    doc.text(`Account: ${account.number} (${account.name})`, 10, 40);
    doc.text(`Balance: ${account.balance}`, 10, 50);

    autoTable(doc, {
      startY: 60,
      head: [["Date", "Type", "Batch ID", "Amount", "Status"]],
      body: (account.transactions || []).map(t => [
        new Date(t.date).toLocaleString(),
        t.type,
        t.batchId,
        t.amount,
        t.status,
      ]),
    });

    doc.save(`Account_${account.number}_Statement.pdf`);
  };

  const downloadReport = () => {
    if (!selectedAcc) return;
    const account = accounts.find((a) => a.number === selectedAcc);
    const doc = new jsPDF();

    // Logo
    doc.addImage(scLogo, "PNG", 15, 10, 30, 20);
    doc.setFontSize(16);
    doc.text("Standard Chartered Bank", 60, 20);
    doc.setFontSize(12);
    doc.text("Account Balance Report", 60, 30);

    // Account details
    doc.setFontSize(11);
    doc.text(`Account: ${account.number} - ${account.name}`, 15, 50);
    doc.text(`Balance: ${account.balance}`, 15, 60);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 15, 70);

    // Transactions
    let y = 90;
    doc.setFontSize(10);
    doc.text("Transactions:", 15, y);
    y += 10;

    if (transactions.length === 0) {
      doc.text("No transactions found.", 15, y);
    } else {
      transactions.forEach((t, i) => {
        doc.text(
          `${i + 1}. ${t.date ? new Date(t.date).toLocaleString() : "-"} | ${t.type} | ${t.payee} | ${t.amount}`,
          15,
          y
        );
        y += 8;
      });
    }

    doc.save(`Account_${account.number}_Report.pdf`);
  };

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Account Balances</h2>
        <BackToDashboard />
      </div>

      {/* Account Selector */}
      <div className="row mb-4">
        <div className="col-md-6">
          <label className="form-label fw-semibold">Select Account</label>
          <select
            className="form-select"
            value={selectedAcc}
            onChange={(e) => setSelectedAcc(e.target.value)}
          >
            <option value="">-- Choose an account --</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.number}>
                {a.number} — {a.name} (Balance: {a.balance.toLocaleString()})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Transactions */}
      {selectedAcc && (
        <>
          <h5>Transactions</h5>
          <div className="table-responsive">
            <table className="table table-bordered text-center">
              <thead className="table-light">
                <tr>
                  <th>Reference</th>
                  <th>Payee</th>
                  <th>Amount</th>
                  <th>Type</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan="5">No transactions found.</td>
                  </tr>
                ) : (
                  transactions.map((t, i) => (
                    <tr key={i}>
                      <td>{t.ref}</td>
                      <td>{t.payee}</td>
                      <td>{t.amount}</td>
                      <td>{t.type}</td>
                      <td>{t.date ? new Date(t.date).toLocaleString() : "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <button className="btn btn-primary mt-3" onClick={downloadReport}>
            Download PDF Report
          </button>
        </>
      )}
    </div>
  );
}