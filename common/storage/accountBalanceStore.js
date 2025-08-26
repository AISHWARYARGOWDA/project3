// src/common/storage/accountBalanceStore.js
const BALANCE_KEY = "accounts_data";

// Initialize with mock accounts if not present
export function initAccounts(accounts) {
  if (!localStorage.getItem(BALANCE_KEY)) {
    localStorage.setItem(BALANCE_KEY, JSON.stringify(accounts));
  }
}

export function getAccounts() {
  return JSON.parse(localStorage.getItem(BALANCE_KEY)) || [];
}

export function updateAccountBalance(accountNumber, amount, txn) {
  const accounts = getAccounts();
  const accIndex = accounts.findIndex(a => a.number === accountNumber);
  if (accIndex !== -1) {
    accounts[accIndex].balance =
      Number(accounts[accIndex].balance) - Number(amount);

    // Push transaction
    if (!accounts[accIndex].transactions) accounts[accIndex].transactions = [];
    accounts[accIndex].transactions.push({
      ...txn,
      date: new Date().toISOString(),
    });

    localStorage.setItem(BALANCE_KEY, JSON.stringify(accounts));
  }
}
