import React from 'react';
import './Modal.css'; // Import your modal styles here

function Modal({ onClose, children }) {
  return (
    <div className="modal-background">
      <div className="modal-content">
        <button className="modal-close-button" onClick={onClose}>
          Close
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal;
