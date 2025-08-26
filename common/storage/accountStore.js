import { accounts } from "../mockData";

const ACCOUNT_KEY = "accounts";

export function getAccounts() {
  const stored = localStorage.getItem(ACCOUNT_KEY);
  return stored ? JSON.parse(stored) : accounts;
}

export function saveAccounts(updated) {
  localStorage.setItem(ACCOUNT_KEY, JSON.stringify(updated));
}

// Deduct balance after approval
export function deductFromAccount(accountNumber, amount) {
  const all = getAccounts();
  const idx = all.findIndex((a) => a.number === accountNumber);
  if (idx !== -1) {
    all[idx].balance -= amount;
    saveAccounts(all);
  }
}