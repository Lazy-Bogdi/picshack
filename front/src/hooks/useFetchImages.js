import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Import the authentication context

export function useFetchImages() {
    const { isAuthenticated } = useAuth(); // Access authentication state
    const [userImages, setUserImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchImages = async () => {
            if (!isAuthenticated) {
                // Skip fetching images if the user is not authenticated
                setLoading(false);
                return;
            }

            try {
                // Fetch user-specific images if authenticated
                const userResponse = await axios.get('/api/user-images');
                setUserImages(userResponse.data);
                setLoading(false);
            } catch (error) {
                setError('Failed to load images');
                setLoading(false);
            }
        };

        fetchImages();
    }, [isAuthenticated]); // Re-fetch if the authentication state changes

    const addImage = (newImage) => {
        setUserImages((prevImages) => [newImage, ...prevImages]); // Add new image to the beginning of the array
    };

    return { userImages, loading, error, addImage };
}
