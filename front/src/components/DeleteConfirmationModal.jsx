import React from 'react';

function DeleteConfirmationModal({ title, message, confirmText, onDelete, onCancel }) {
    return (
        <div className="modal modal-open">
            <div className="modal-box">
                <h3 className="font-bold text-lg">{title}</h3>
                <p className="py-4">{message}</p>
                <div className="modal-action">
                    <button className="btn" onClick={onCancel}>Cancel</button>
                    <button className="btn btn-error" onClick={onDelete}>{confirmText}</button>
                </div>
            </div>
        </div>
    );
}

export default DeleteConfirmationModal;
