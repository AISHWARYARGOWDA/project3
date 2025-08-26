import React from 'react';

export default function ConfirmModal({ id, title, body, onConfirm }) {
  return (
    <div className="modal fade" id={id} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header"><h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div className="modal-body">{body}</div>
          <div className="modal-footer">
            <button className="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
            <button className="btn btn-primary" data-bs-dismiss="modal" onClick={onConfirm}>Confirm</button>
          </div>
        </div>
      </div>
    </div>
  );
}