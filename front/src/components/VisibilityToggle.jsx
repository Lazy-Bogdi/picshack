import React, { useState } from 'react';
import axios from 'axios';

function VisibilityToggle({ uniqueId, isPublic, onStatusChange }) {
    const [loading, setLoading] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(isPublic);

    const toggleVisibility = async () => {
        setLoading(true);

        try {
            const response = await axios.put('/api/update-image-status', {
                uniqueId: uniqueId,
                isPublic: !currentStatus,
            });

            if (response.status === 200) {
                setCurrentStatus(!currentStatus);
                onStatusChange(!currentStatus);  // Notify parent component
            }
        } catch (error) {
            console.error('Failed to update image visibility', error);
            alert('An error occurred while updating the image status.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center">
            <label className="cursor-pointer flex items-center">
                <span className="mr-2 text-sm text-gray-500">
                    {currentStatus ? 'Public' : 'Private'}
                </span>
                <input
                    type="checkbox"
                    className={`toggle toggle-primary ${loading ? 'toggle-disabled' : ''}`}
                    checked={loading ? currentStatus : !currentStatus}
                    onChange={toggleVisibility}
                    disabled={loading}
                />
            </label>
            {loading && <span className="ml-2 text-sm text-gray-500">Updating...</span>}
        </div>
    );
}

export default VisibilityToggle;
