import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function NotificationModal({ message, onClose, type = 'info', redirect = false, redirectTo = '/' }) {
    const navigate = useNavigate();

    const getClassForType = () => {
        switch (type) {
            case 'success':
                return 'text-green-500';
            case 'error':
                return 'text-red-500';
            case 'info':
            default:
                return 'text-blue-500';
        }
    };

    useEffect(() => {
        let timeout;
        if (redirect) {
            timeout = setTimeout(() => {
                navigate(redirectTo);
            }, 5000); // Redirect after 5 seconds
        }
        return () => clearTimeout(timeout); // Clear timeout on cleanup
    }, [redirect, navigate, redirectTo]);

    const handleClose = () => {
        onClose();
        if (redirect) {
            navigate(redirectTo); // Redirect immediately when close is clicked
        }
    };

    return (
        <div className="modal modal-open">
            <div className="modal-box">
                <h3 className={`font-bold text-lg ${getClassForType()}`}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                </h3>
                <p className="py-4">{message}</p>
                <div className="modal-action">
                    <button className="btn" onClick={handleClose}>Close</button>
                </div>
            </div>
        </div>
    );
}

export default NotificationModal;
