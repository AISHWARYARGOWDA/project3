import React from 'react';

export default function DataTable({ columns, rows, actions }) {
  return (
    <div className="table-responsive card card-shadow">
      <table className="table table-sm table-hover mb-0">
        <thead className="table-light">
          <tr>
            {columns.map(c => <th key={c.key}>{c.header}</th>)}
            {actions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => (
            <tr key={r.id || idx}>
              {columns.map(c => <td key={c.key}>{c.render ? c.render(r[c.key], r) : r[c.key]}</td>)}
              {actions && <td>{actions(r)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}