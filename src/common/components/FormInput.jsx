import React from 'react';
export default function FormInput({ label, type='text', value, onChange, required, ...rest }) {
  return (
    <div className="mb-3">
      <label className="form-label">{label}{required && ' *'}</label>
      <input className="form-control" type={type} value={value} onChange={e=>onChange(e.target.value)} required={required} {...rest}/>
    </div>
  );
}