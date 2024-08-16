import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AuthForm from './views/AuthForm';
import HomePage from './views/Home';
import ImageViewer from './views/ImageViewer';
import Profile from './components/Profile';


function AppRoutes() {
    return (

        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthForm />} />
            <Route path="/image/:uniqueId" element={<ImageViewer />} />
            <Route path="/profile" element={<Profile />} /> {/* Add profile route */}
        </Routes>
    );
}

export default AppRoutes;
