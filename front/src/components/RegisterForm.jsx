import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Assurez-vous que cette logique existe ou adaptez-la

function RegisterForm({ onRegistrationSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [name, setName] = useState('');
    const { register } = useAuth(); // Implémentez cette méthode dans AuthContext
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Check if passwords match as the user types
        setPasswordsMatch(password === passwordConfirmation);
    }, [password, passwordConfirmation]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!passwordsMatch) {
            console.error('Passwords do not match');
            return;
        }
        // await register(email, password, name, passwordConfirmation);
        setLoading(true);
        const {success, data, error } = await register(email, password, name, passwordConfirmation);
        setLoading(false);
        if (success) {
            console.log('User registered successfully:', data);
            onRegistrationSuccess();
            // Handle successful registration, maybe redirect to another page
        } else {
            console.error('Registration failed:', error);
            // Handle registration error
        }

        // Gestion des erreurs et redirection devrait être ajoutée ici
    };

    return (
        <form onSubmit={handleSubmit} className="form-control">
            <label className="label">
                <span className="label-text">Nom</span>
            </label>
            <input type="text" placeholder="Nom complet" className="input input-bordered" value={name} onChange={(e) => setName(e.target.value)} disabled={loading} required />

            <label className="label">
                <span className="label-text">Email</span>
            </label>
            <input type="email" placeholder="Email" className="input input-bordered" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} required />

            <label className="label">
                <span className="label-text">Mot de passe</span>
            </label>
            <input type="password" placeholder="Mot de passe" className="input input-bordered" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} required />

            <label className="label">
                <span className="label-text">Confirmation du mot de passe</span>
            </label>
            <input
                type="password"
                placeholder="Confirmez le mot de passe"
                className="input input-bordered"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                disabled={loading}
                required
            />
            {!passwordsMatch && (
                <span className="text-red-500 text-sm mt-1">Les mots de passe ne correspondent pas.</span>
            )}

<button 
                type="submit" 
                className="btn btn-primary mt-4 flex items-center justify-center"
                disabled={!passwordsMatch || loading} // Disable button when loading
            >
                {loading ? (
                    <span className="loading loading-ring loading-lg"></span> // Display loader
                ) : (
                    "Inscription"
                )}
            </button>  
        </form>
    );
}

export default RegisterForm;
