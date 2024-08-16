import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function ImageViewer() {
    const { uniqueId, imageName } = useParams();
    const [canView, setCanView] = useState(null);
    const [error, setError] = useState(null);
    const baseURL = 'https://127.0.0.1:8000';
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
// console.log(isAuthenticated)
    useEffect(() => {
        const checkImageAccess = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/check-image-access/${uniqueId}`);

                if (response.data.canView) {
                    setCanView(true);
                } else {
                    setCanView(false);
                    // setError(response.data.error || 'Image is private and not accessible.');
                    setError(response.data.error || 'This image is private. Please connect as owner or ask to make it public.');

                }
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    // If the user is not authenticated, redirect to login
                    setCanView(false);
                    setError('This image is private. Please connect as owner or ask to make it public.');
                } else {
                    setCanView(false);
                    setError('An error occurred while checking image access.');
                }
            }
        };

        checkImageAccess();
    }, [uniqueId, navigate, isAuthenticated]);

    if (canView === null) {
        return <div className="container mx-auto p-4"><h2>Checking access...</h2></div>;
    }

    if (!canView) {
        return <div className="container mx-auto p-4"><h2 className="text-xl text-red-500">{error}</h2></div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Image Viewer</h2>
            <img
                src={`${baseURL}/api/view-images/${uniqueId}`}
                alt="Viewable Image"
                className="max-w-full h-auto rounded-lg shadow-lg"
            />
            <h3 className="text-lg font-semibold mt-2 hover:underline">
                {imageName}
            </h3>
        </div>
    );
}

export default ImageViewer;
