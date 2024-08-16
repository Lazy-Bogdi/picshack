import { useState } from 'react';
import axios from 'axios';

export function useImageUpload() {
    const [isUploadFormOpen, setIsUploadFormOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const openUploadForm = () => {
        setIsUploadFormOpen(true);
    };

    const closeUploadForm = (imageFile) => {
        setSelectedImage(imageFile);
        setIsUploadFormOpen(false);
        setIsUploadModalOpen(true);
    };

    const handleModalSubmit = async (isPublic) => {
        console.log(isPublic);
        const formData = new FormData();
        formData.append('imageFile', selectedImage);
        formData.append('isPublic', isPublic ? 1 : 0); // Convert boolean to 1 or 0
        // console.log(isPublic);

        try {
            const response = await axios.post('/api/upload', formData);
            alert('Image uploaded successfully');
        } catch (error) {
            alert('Failed to upload image');
        } finally {
            setIsUploadModalOpen(false);
            setSelectedImage(null);
        }
    };

    const cancelUpload = () => {
        setIsUploadModalOpen(false);
        setSelectedImage(null);
    };

    return {
        isUploadFormOpen,
        isUploadModalOpen,
        openUploadForm,
        closeUploadForm,
        handleModalSubmit,
        cancelUpload,
    };
}
