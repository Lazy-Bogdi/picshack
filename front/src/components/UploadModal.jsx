import React, { useState } from 'react';

function UploadModal({ onSubmit, onCancel }) {
    const [isPublic, setIsPublic] = useState(true);

    const handleSubmit = () => {
        onSubmit(isPublic);
    };

    return (
        <div className="modal modal-open">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Image Privacy</h3>
                <p className="py-4">Do you want to make this image public or private?</p>
                <div className="form-control">
                    <label className="label cursor-pointer">
                        <span className="label-text">Public</span>
                        <input
                            type="radio"
                            name="privacy"
                            className="radio"
                            checked={isPublic === true}
                            onChange={() => setIsPublic(true)}
                        />
                    </label>
                    <label className="label cursor-pointer">
                        <span className="label-text">Private</span>
                        <input
                            type="radio"
                            name="privacy"
                            className="radio"
                            checked={isPublic === false}
                            onChange={() => setIsPublic(false)}
                        />
                    </label>
                </div>
                <div className="modal-action">
                    <button className="btn" onClick={onCancel}>Cancel</button>
                    <button className="btn btn-primary" onClick={handleSubmit}>Submit</button>
                </div>
            </div>
        </div>
    );
}

export default UploadModal;
