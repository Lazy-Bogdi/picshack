import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AuthForm from './views/AuthForm';
import HomePage from './views/Home';
import ImageViewer from './views/ImageViewer';


function AppRoutes() {
    return (

        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthForm />} />
            <Route path="/image/:uniqueId/:imageName" element={<ImageViewer />} />
        </Routes>
    );
}

export default AppRoutes;
