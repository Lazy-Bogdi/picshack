import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetchImages } from '../hooks/useFetchImages';
import { useAuth } from '../context/AuthContext';
import VisibilityToggle from './VisibilityToggle';
import UploadModal from './UploadModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';
import NotificationModal from './NotificationModal';

function ImageGallery() {
    const { userImages, loading, error, addImage, deleteImage } = useFetchImages();
    // const baseURL = 'https://127.0.0.1:8000';
    const baseURL = "http://vps-7cceaa46.vps.ovh.net:8437";
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [draggedImage, setDraggedImage] = useState(null);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [imageToDelete, setImageToDelete] = useState(null);
    const [notification, setNotification] = useState(null);
    const fileInputRef = useRef(null);

    const handleLoginClick = () => {
        navigate('/auth');
    };

    if (!isAuthenticated) {
        return (
            <div className="container mx-auto p-4">
                <h2 className="text-2xl font-bold mt-8 mb-4">You are not logged in</h2>
                <p>Please <span onClick={handleLoginClick} className="text-blue-500 cursor-pointer hover:underline">log in</span> to view your images.</p>
            </div>
        );
    }

    if (loading) {
        return <div><span className="loading loading-ring loading-lg"></span></div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const handleStatusChange = (imageId, newStatus) => {
        console.log(`Image ${imageId} visibility changed to: ${newStatus}`);
    };

    const handleImageClick = (uniqueId) => {
        navigate(`/image/${uniqueId}`);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            setDraggedImage(file);
            setIsUploadModalOpen(true);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setDraggedImage(file);
            setIsUploadModalOpen(true);
        }
    };

    const handleModalSubmit = async (isPublic) => {
        const formData = new FormData();
        formData.append('imageFile', draggedImage);
        formData.append('isPublic', isPublic ? 1 : 0);

        try {
            const response = await axios.post('/api/upload', formData);
            setNotification({
                message: 'Image uploaded successfully!',
                type: 'success',
            });
            const newImage = response.data.image;
            addImage(JSON.parse(newImage));
        } catch (error) {
            setNotification({
                message: 'Failed to upload image.',
                type: 'error',
            });
            console.error(error)
        } finally {
            setIsUploadModalOpen(false);
            setDraggedImage(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const cancelUpload = () => {
        setIsUploadModalOpen(false);
        setDraggedImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const openDeleteModal = (uniqueId) => {
        setImageToDelete(uniqueId);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!imageToDelete) return;

        try {
            await axios.delete(`/api/delete-image/${imageToDelete}`);
            setNotification({
                message: 'Image deleted successfully!',
                type: 'success',
            });
            deleteImage(imageToDelete);
        } catch (error) {
            setNotification({
                message: 'Failed to delete image.',
                type: 'error',
            });
            console.error(error);
        } finally {
            setIsDeleteModalOpen(false);
            setImageToDelete(null);
        }
    };

    const cancelDelete = () => {
        setIsDeleteModalOpen(false);
        setImageToDelete(null);
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mt-8 mb-4">Your Images</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div
                    className="card shadow-lg rounded-lg overflow-hidden border-dashed border-2 border-gray-300 flex justify-center items-center cursor-pointer"
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                >
                    <label htmlFor="upload-input" className="flex flex-col justify-center items-center p-4">
                        {draggedImage ? (
                            <div className="flex flex-col items-center">
                                <span className="text-lg font-semibold">{draggedImage.name}</span>
                                <span className="text-gray-500">{(draggedImage.size / 1024).toFixed(2)} KB</span>
                            </div>
                        ) : (
                            <>
                                <span className="text-lg font-semibold">Upload Image</span>
                                <span className="text-gray-400">Click or drag an image here</span>
                            </>
                        )}
                        <input
                            id="upload-input"
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                            ref={fileInputRef}
                        />
                    </label>
                </div>
                {userImages.map(image => (
                    <div key={image.id} className="card shadow-lg rounded-lg overflow-hidden">
                        <div
                            className="cursor-pointer"
                            onClick={() => handleImageClick(image.uniqueId)}
                        >
                            <img
                                src={`${baseURL}/api/view-images/${image.uniqueId}`}
                                alt={image.imageName}
                                className="w-full h-48 object-cover hover:opacity-80 transition-opacity duration-200"
                            />
                            <h3 className="text-lg font-semibold mt-2 hover:underline">
                                {image.imageName}
                            </h3>
                        </div>
                        <div className="p-4 flex justify-between items-center">
                            <VisibilityToggle
                                uniqueId={image.uniqueId}
                                isPublic={image.isPublic}
                                onStatusChange={(newStatus) => handleStatusChange(image.id, newStatus)}
                            />
                            <button onClick={() => openDeleteModal(image.uniqueId)} className="text-red-500 hover:text-red-700">
                                <FaTrash size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {isUploadModalOpen && (
                <UploadModal
                    onSubmit={handleModalSubmit}
                    onCancel={cancelUpload}
                />
            )}
            {isDeleteModalOpen && (
                <DeleteConfirmationModal
                    title="Delete Image"
                    message="Are you sure you want to delete this image? This action cannot be undone."
                    confirmText="Delete"
                    onDelete={handleDelete}
                    onCancel={cancelDelete}
                />
            )}

            {notification && (

                <NotificationModal
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                    redirect={false}   // No redirection
                />
            )}
        </div>
    );
}

export default ImageGallery;
