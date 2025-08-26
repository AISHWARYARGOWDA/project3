import React, { useEffect, useMemo, useState } from "react";
import { getAllTransactions } from "../../common/storage/payrollStore";
import { openPrintWindow } from "../../common/utils/pdf";
import BackToDashboard from "../../common/components/BackToDashboard";

export default function TransactionList(){
  const [txns, setTxns] = useState([]);
  const [q, setQ] = useState("");

  useEffect(()=>{ setTxns(getAllTransactions()); },[]);

  const filtered = useMemo(()=> {
    const s = q.trim().toLowerCase();
    if(!s) return txns;
    return txns.filter(t => Object.values(t).join(" ").toLowerCase().includes(s));
  }, [q, txns]);

  const pdf = () => {
    const rows = filtered.map((t,i)=>`
      <tr>
        <td>${i+1}</td><td>${t.id}</td><td>${t.account}</td><td>${t.direction}</td><td>${t.amount} ${t.currency}</td><td>${new Date(t.createdAt).toLocaleString()}</td>
      </tr>`).join("");
    openPrintWindow({
      title:"Transactions",
      html: `
        <div class="brand-head">
          <img src="./assets/sc-logo.png" />
          <div><div class="brand-title">Standard Chartered — Transactions</div></div>
        </div>
        <table class="table table-sm"><thead><tr><th>#</th><th>Txn</th><th>Account</th><th>Direction</th><th>Amount</th><th>Date</th></tr></thead><tbody>${rows}</tbody></table>
      `
    });
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center dashboard-heading">
        <strong>Transactions</strong>
        <div className="d-flex gap-2">
          <input className="form-control" placeholder="Search…" value={q} onChange={e=>setQ(e.target.value)} />
          <button className="btn btn-sm" onClick={pdf}>Download PDF</button>
        </div>
      </div>

      <div className="card">
        <div className="card-body" style={{overflow: "auto"}}>
          <table className="table">
            <thead><tr><th>#</th><th>Txn</th><th>Account</th><th>Direction</th><th>Amount</th><th>Date</th></tr></thead>
            <tbody>
              {filtered.length===0 && <tr><td colSpan="6">No transactions.</td></tr>}
              {filtered.map((t,i)=>(
                <tr key={t.id}>
                  <td>{i+1}</td><td>{t.id}</td><td>{t.account}</td><td>{t.direction}</td><td>{t.amount} {t.currency}</td><td>{new Date(t.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <BackToDashboard/>        
        </div>
      </div>
    </div>
  );
}