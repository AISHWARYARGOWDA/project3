import React from 'react';
export default function PrimaryButton({ children, ...props }) {
  return <button className="btn btn-primary" {...props}>{children}</button>;
}