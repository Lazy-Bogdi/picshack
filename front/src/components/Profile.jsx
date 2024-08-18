import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DeleteConfirmationModal from './DeleteConfirmationModal'; // Import your confirmation modal
import NotificationModal from './NotificationModal'; // Import notification modal
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Profile() {
    const { logout } = useAuth();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [notification, setNotification] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get('/api/user-profile');
                setUserData(response.data);
            } catch (error) {
                setError('Failed to load profile data');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const openDeleteModal = () => {
        setIsDeleteModalOpen(true);
    };

    const handleDeleteAccount = async () => {
        try {
            await axios.delete('/api/delete-user');
            setNotification({
                message: 'Account and all associated images deleted successfully!',
                type: 'success',
            });
            logout();
            // Redirect after 5 seconds
            // setTimeout(() => {
            //     navigate('/');
            // }, 8000);

        } catch (error) {
            setNotification({
                message: 'Failed to delete account.',
                type: 'error',
            });
        } finally {
            setIsDeleteModalOpen(false);
        }
    };

    const cancelDelete = () => {
        setIsDeleteModalOpen(false);
    };

    const handleNotificationClose = () => {
        setNotification(null);
        navigate('/'); // Redirect immediately when the notification is manually closed
    };

    if (loading) {
        return <div><span className="loading loading-ring loading-lg"></span></div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mt-8 mb-4">My Profile</h2>
            {userData && (
                <div className="card shadow-lg rounded-lg p-4">
                    <p><strong>Name:</strong> {userData.name}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <button className="btn btn-error mt-4" onClick={openDeleteModal}>
                        Delete My Account
                    </button>
                </div>
            )}

            {isDeleteModalOpen && (
                <DeleteConfirmationModal
                    title="Delete Account"
                    message="Are you sure you want to delete your account? This action cannot be undone, and all your images will be deleted."
                    confirmText="Delete Account"
                    onDelete={handleDeleteAccount}
                    onCancel={cancelDelete}
                />
            )}

            {notification && (
                <NotificationModal
                message={notification.message}
                type={notification.type}
                onClose={handleNotificationClose}
                redirect={true}   // Enable redirection
                redirectTo="/"     // Redirect to the homepage
            />
            )}
        </div>
    );
}

export default Profile;
