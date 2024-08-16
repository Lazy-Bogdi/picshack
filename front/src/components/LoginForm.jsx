import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate(); // Initialize useNavigate

    const handleSubmit = async (event) => {
        event.preventDefault();
        const { success, error } = await login(email, password);

        if (success) {
            navigate('/'); // Redirect to home page on successful login
        } else {
            console.error(error);
            // You can handle the error here (e.g., display an error message)
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-control">
            <label className="label">
                <span className="label-text">Email</span>
            </label>
            <input type="email" placeholder="Email" className="input input-bordered" value={email} onChange={(e) => setEmail(e.target.value)} required />

            <label className="label">
                <span className="label-text">Mot de passe</span>
            </label>
            <input type="password" placeholder="Mot de passe" className="input input-bordered" value={password} onChange={(e) => setPassword(e.target.value)} required />

            <button type="submit" className="btn btn-primary mt-4">Connexion</button>
        </form>
    );
}

export default LoginForm;
