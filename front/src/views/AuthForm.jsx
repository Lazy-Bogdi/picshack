import React, { useState } from 'react';
import LoginForm from '../components/LoginForm'; // Assurez-vous de créer ce composant
import RegisterForm from '../components/RegisterForm'; // Assurez-vous de créer ce composant

function AuthForm() {
    const [isLogin, setIsLogin] = useState(true); // True pour login, false pour register

    const toggleForm = () => {
        setIsLogin(!isLogin);
    };
    const handleRegistrationSuccess = () => {
        setIsLogin(true);
    };

    return (
        <div className="container mx-auto p-4">
            <div className="tabs tabs-boxed bg-base-100">
                <a className={`tab ${isLogin ? 'tab-active' : ''}`} onClick={() => setIsLogin(true)}>Connexion</a>
                <a className={`tab ${!isLogin ? 'tab-active' : ''}`} onClick={() => setIsLogin(false)}>Inscription</a>
            </div>
            <div className="form-content mt-4">
                {isLogin ? <LoginForm /> : <RegisterForm onRegistrationSuccess={handleRegistrationSuccess} />}
            </div>
        </div>
    );
}

export default AuthForm;
