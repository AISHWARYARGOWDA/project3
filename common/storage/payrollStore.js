// Simple localStorage-based store for payroll + accounts + transactions
const KEY_BATCHES = "pi_batches";
const KEY_TXNS    = "pi_transactions";
const KEY_ACCTS   = "pi_accounts";

// Initialize if missing
function init(){
  if(!localStorage.getItem(KEY_BATCHES)) localStorage.setItem(KEY_BATCHES,"[]");
  if(!localStorage.getItem(KEY_TXNS))    localStorage.setItem(KEY_TXNS,"[]");
  if(!localStorage.getItem(KEY_ACCTS)){
    // seed from mock if provided globally
    const seed = [
      { id:"1", number:"001-123456-01", name:"Main Ops", currency:"USD", balance: 150000 },
      { id:"2", number:"001-987654-02", name:"Payroll Pool", currency:"USD", balance: 250000 },
      { id:"3", number:"044-555999-03", name:"AP Account", currency:"INR", balance: 9000000 },
    ];
    localStorage.setItem(KEY_ACCTS, JSON.stringify(seed));
  }
}
init();

// ---------- Helper IO ----------
const read = k => JSON.parse(localStorage.getItem(k)||"[]");
const write = (k,v) => localStorage.setItem(k, JSON.stringify(v));

// ---------- Batches ----------
export function getAllBatches(){ return read(KEY_BATCHES); }
export function getBatchById(id){ return getAllBatches().find(b=>String(b.id)===String(id)); }
export function upsertBatch(batch){
  const all = getAllBatches();
  const idx = all.findIndex(b=>String(b.id)===String(batch.id));
  if(idx>=0) all[idx] = batch; else all.unshift(batch);
  write(KEY_BATCHES, all);
}
export function deleteBatch(id){
  write(KEY_BATCHES, getAllBatches().filter(b=>String(b.id)!==String(id)));
}
export function setStatus(id, status, meta = {}){
  const all = getAllBatches();
  const idx = all.findIndex(b=>String(b.id)===String(id));
  if(idx<0) return;
  const batch = all[idx];
  batch.status = status;
  Object.assign(batch, meta);
  batch.updatedAt = new Date().toISOString();

  // When Approved → deduct and create transactions
  if(status === "Approved"){
    const debitAcc = batch.instruction?.debitAccount;
    const ccy = batch.instruction?.paymentCurrency;
    const total = (batch.payments||[]).reduce((s,p)=> s + Number(p.amount||0), 0);
    if(debitAcc){
      adjustAccount(debitAcc, -total);
      const txns = getAllTransactions();
      txns.unshift({
        id: `TX-${Date.now()}`,
        type: "PAYROLL",
        batchId: batch.id,
        account: debitAcc,
        currency: ccy,
        amount: total,
        direction: "DEBIT",
        createdAt: new Date().toISOString(),
        items: batch.payments
      });
      write(KEY_TXNS, txns);
    }
  }
  write(KEY_BATCHES, all);
}

// ---------- Accounts ----------
export function getAccounts(){ return read(KEY_ACCTS); }
export function getAccountByNumber(num){ return getAccounts().find(a=>a.number===num); }
export function adjustAccount(number, delta){
  const accts = getAccounts();
  const idx = accts.findIndex(a=>a.number===number);
  if(idx<0) return;
  accts[idx].balance = Number(accts[idx].balance||0) + Number(delta||0);
  write(KEY_ACCTS, accts);
}

// ---------- Transactions ----------
export function getAllTransactions(){ return read(KEY_TXNS); }
export function getTransactionsForAccount(number){
  return getAllTransactions().filter(t=>t.account===number);
}

// ---------- Generic download text (legacy) ----------
export function downloadText(filename, content){
  const blob = new Blob([content], {type: "text/plain"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href=url; a.download=filename; a.click();
  URL.revokeObjectURL(url);
}