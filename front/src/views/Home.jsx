import React from 'react';
import ImageGallery from '../components/ImageGallery';


function HomePage() {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold">Welcome to My App</h1>
            <ImageGallery />
        </div>
    );
}

export default HomePage;
