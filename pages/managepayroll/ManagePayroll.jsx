import React from 'react';

import PrimaryButton from '../../common/components/PrimaryButton';

export default function ManagePayroll() {
  const data = {
    reference: 'PICHTE001A00438',
    reportCatalogue: 'C0000013',
    payFrom: {
      accountTitle: '501510398305 CNY bo name SCBLCNSXSHA CN',
      method: 'ACCOUNT',
      amount: 'CNY 100.00',
      scheduleDate: '19/06/2023'
    },
    payTo: {
      paymentRef: '00000416',
      uetr: '121dr3d0-4053-40fc-ad91-27c6id65e919',
      otherBank: '500876896871 Payee Other Bank PCBCSGSGXXX CHINA CONSTRUCTION BANK CORPORATION, SINGAPORE BRANCH CN',
      chargesBy: 'PAYER',
      paymentType: 'PAY (Payroll)'
    }
  };

  return (
    <div className="card card-shadow p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h5 mb-0">Manual Payroll Summary</h2>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary" onClick={() => window.history.back()}>Back</button>
          <PrimaryButton onClick={() => window.print()}>Print</PrimaryButton>
        </div>
      </div>

      <div className="mb-3 p-3 bg-light border rounded">
        <h5 className="mb-3">Summary</h5>
        <p><strong>Your Reference:</strong> {data.reference}</p>
        <p><strong>Report Catalogue:</strong> {data.reportCatalogue}</p>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="p-3 border rounded mb-3">
            <h6 className="mb-3">Pay From</h6>
            <p><strong>Account Title:</strong> {data.payFrom.accountTitle}</p>
            <p><strong>Payment Method:</strong> {data.payFrom.method}</p>
            <p><strong>Gross Amount:</strong> {data.payFrom.amount}</p>
            <p><strong>Payment Schedule:</strong> {data.payFrom.scheduleDate}</p>
          </div>
        </div>
        <div className="col-md-6">
          <div className="p-3 border rounded mb-3">
            <h6 className="mb-3">Pay To</h6>
            <p><strong>Payment Reference:</strong> {data.payTo.paymentRef}</p>
            <p><strong>UETR Number:</strong> {data.payTo.uetr}</p>
            <p><strong>Payee Bank:</strong> {data.payTo.otherBank}</p>
            <p><strong>Charges To Be Paid By:</strong> {data.payTo.chargesBy}</p>
            <p><strong>Payment Type:</strong> {data.payTo.paymentType}</p>
          </div>
        </div>
      </div>
    </div>
  );
}