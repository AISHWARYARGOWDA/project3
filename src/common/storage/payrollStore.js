// Centralized helpers for payroll batches stored in localStorage
const KEY = "payrollBatches";

export function getAllBatches() {
  return JSON.parse(localStorage.getItem(KEY) || "[]");
}

export function saveAllBatches(batches) {
  localStorage.setItem(KEY, JSON.stringify(batches));
}

export function upsertBatch(batch) {
  const all = getAllBatches();
  const idx = all.findIndex(b => b.id === batch.id);
  if (idx >= 0) all[idx] = batch; else all.push(batch);
  saveAllBatches(all);
  return batch;
}

export function getBatchById(id) {
  return getAllBatches().find(b => b.id === id);
}

export function deleteBatch(id) {
  const remaining = getAllBatches().filter(b => b.id !== id);
  saveAllBatches(remaining);
}

export function setStatus(id, status, meta = {}) {
  const all = getAllBatches();
  const updated = all.map(b => b.id === id ? { ...b, status, ...meta } : b);
  saveAllBatches(updated);
}

export function downloadText(filename, text) {
  const blob = new Blob([text], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}