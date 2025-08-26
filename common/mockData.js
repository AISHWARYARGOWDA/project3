export const accounts = [
  { id: 'ACC001', name: 'Corporate INR A/C', currency: 'INR', balance: 12455000.55 },
  { id: 'ACC002', name: 'Corporate USD A/C', currency: 'USD', balance: 24500000.10 },
];

export const transactions = [
  { id: 'TX1001', date: '2025-08-01', type: 'PAY', employeeId: 'E102', currency: 'INR', amount: 45000, status: 'Draft' },
  { id: 'TX1002', date: '2025-08-02', type: 'PAY', employeeId: 'E103', currency: 'USD', amount: 800, status: 'Pending Approval' },
  { id: 'TX1003', date: '2025-08-05', type: 'PAY', employeeId: 'E104', currency: 'INR', amount: 61000, status: 'Approved' },
];

export const approvals = transactions.filter(t => t.status === 'Pending Approval');
