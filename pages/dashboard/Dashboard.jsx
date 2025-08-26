import React, { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAllBatches,getAllTransactions } from "../../common/storage/payrollStore";
import { getAccounts } from "../../common/storage/accountBalanceStore";
import { Card, Row, Col } from "react-bootstrap";

export default function Dashboard(){
  const [accounts, setAccounts] = useState([]);
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser")||"null");
  const allowedPages = JSON.parse(localStorage.getItem("allowedPages")||"[]");
  const [batches, setBatches] = useState([]);
  const [accts, setAccts]   = useState([]);
  const [txns, setTxns]     = useState([]);

  // fetch data
  useEffect(()=>{
    setBatches(getAllBatches());
    setAccts(getAccounts());
    setTxns(getAllTransactions());
  },[]);

  useEffect(() => {
    setAccounts(getAccounts());
  }, []);

  const totalBalance = accounts.reduce((sum, acc) => sum + Number(acc.balance), 0);
  const recentTxns = accounts.flatMap(acc =>
    (acc.transactions || []).map(t => ({ ...t, acc: acc.number }))
  )
  .sort((a, b) => new Date(b.date) - new Date(a.date))
  .slice(0, 5);


  // KPIs
  const kpi = useMemo(()=>{
    const submitted = batches.filter(b=>b.status==="Submitted").length;
    const approved  = batches.filter(b=>b.status==="Approved").length;
    const rejected  = batches.filter(b=>b.status==="Rejected").length;
    const totalPay  = batches.reduce((s,b)=> s + (b.payments||[]).reduce((x,p)=>x+Number(p.amount||0),0),0);
    return {submitted, approved, rejected, totalPay};
  },[batches]);

  // Tiny chart (no deps)
  const canvasRef = useRef(null);
  /* useEffect(()=>{
    if(!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    const byMonth = Array(6).fill(0);
    txns.forEach(t=>{
      const d = new Date(t.createdAt);
      const idx = (new Date().getMonth() - d.getMonth() + 12) % 12; // rough last months
      if(idx<6) byMonth[5-idx] += Number(t.amount||0);
    });
    const W = canvasRef.current.width = canvasRef.current.offsetWidth;
    const H = canvasRef.current.height = 160;
    ctx.clearRect(0,0,W,H);
    const max = Math.max(1, ...byMonth);
    const bw = W / (byMonth.length*1.6);
    byMonth.forEach((v,i)=>{
      const x = (i+1)* (W/(byMonth.length+1));
      const h = (v/max)*(H-30);
      ctx.fillStyle = "#8fd0ff";
      ctx.fillRect(x-bw/2, H-h-10, bw, h);
      ctx.fillStyle = "#d8ecff";
      ctx.font = "12px Segoe UI";
      ctx.fillText(v.toFixed(0), x-12, H-h-16);
    });
  },[txns]); */

  const quickActions = allowedPages; // uses same list
  const go = (p)=> navigate(p.path);

  return (
    <div className="container">
      <div className="dashboard-heading">
        <div><strong>Welcome, {currentUser?.username}</strong> — {currentUser?.role}</div>
      </div>

      <div className="mt-3 tiles">
        {quickActions.map(p=>(
          <div className="tile" key={p.path} onClick={()=>go(p)}>
            <h5>{p.name}</h5>
            <div className="muted">Go to {p.name}</div>
          </div>
        ))}
      </div>
      {/* Recent Transactions */}
      <Card className="card-shadow p-3">
        <h5 className="mb-3">Recent Transactions</h5>
        {recentTxns.length === 0 ? (
          <p>No transactions yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-sm table-bordered text-center">
              <thead className="table-light">
                <tr>
                  <th>Date</th>
                  <th>Account</th>
                  <th>Type</th>
                  <th>Batch ID</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTxns.map((t, i) => (
                  <tr key={i}>
                    <td>{new Date(t.date).toLocaleString()}</td>
                    <td>{t.acc}</td>
                    <td>{t.type}</td>
                    <td>{t.batchId}</td>
                    <td>{t.amount}</td>
                    <td>
                      <span
                        className={
                          "badge " +
                          (t.status === "Approved"
                            ? "bg-success"
                            : t.status === "Rejected"
                            ? "bg-danger"
                            : "bg-secondary")
                        }
                      >
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <div className="grid grid-3">
        <div className="card">
          <div className="card-header">Quick Stats</div>
          <div className="card-body">
            <div>Submitted: <span className="badge">{kpi.submitted}</span></div>
            <div>Approved: <span className="badge">{kpi.approved}</span></div>
            <div>Rejected: <span className="badge">{kpi.rejected}</span></div>
            <div>Total Payroll Value: <span className="badge">{kpi.totalPay}</span></div>
          </div>
        </div>

        {/* <div className="card" style={{gridColumn:"span 2"}}>
          <div className="card-header">Payments (Last 6 periods)</div>
          <div className="card-body">
            <canvas ref={canvasRef} style={{width:"100%", height:160}} />
          </div>
        </div> */}
      </div>

      {/* Quick Stats */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="card-shadow text-center p-3">
            <h5>Total Balance</h5>
            <h3 className="text-success">{totalBalance.toLocaleString()} USD</h3>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="card-shadow text-center p-3">
            <h5>Accounts</h5>
            <h3>{accounts.length}</h3>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="card-shadow text-center p-3">
            <h5>Transactions</h5>
            <h3>{recentTxns.length}</h3>
          </Card>
        </Col>
      </Row>                
    </div>
  );
}