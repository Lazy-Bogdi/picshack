import React, { useState } from 'react';

function UploadForm({ onClose }) {
    const [imageFile, setImageFile] = useState(null);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
        setError('');  // Clear any previous error message
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!imageFile) {
            setError('Please select an image to upload.');
            return;
        }

        // Trigger the upload modal
        onClose(imageFile);
    };

    return (
        <div className="fixed right-0 top-0 h-full w-1/3 bg-base-100 p-4 shadow-lg">
            <form onSubmit={handleSubmit}>
                <div className="form-control">
                    <input
                        type="file"
                        className="file-input file-input-bordered w-full"
                        onChange={handleFileChange}
                    />
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                </div>
                <div className="mt-4">
                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                    >
                        Upload
                    </button>
                </div>
            </form>
        </div>
    );
}

export default UploadForm;
