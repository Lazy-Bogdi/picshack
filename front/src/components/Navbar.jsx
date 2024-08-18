import React from 'react';
import { useAuth } from '../context/AuthContext';
import { FaUser } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

function Navbar() {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <nav className="navbar bg-base-200">
            <div className="navbar-start">
                <a className="btn btn-ghost normal-case text-xl" onClick={() => navigate('/')}>PicShack</a>
            </div>
            <div className="navbar-end">
                {isAuthenticated ? (
                    <>
                        <button className="btn btn-ghost" onClick={() => navigate('/profile')}>
                            Profile
                        </button>
                        <div className="dropdown dropdown-end ml-4">
                            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full">
                                    <FaUser size={24} />
                                </div>
                            </label>
                            <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
                                <li>
                                    <span className="font-bold text-lg">{user?.username || user?.email}</span>
                                </li>
                                <li><a onClick={logout}>Logout</a></li>
                            </ul>
                        </div>
                    </>
                ) : (
                    location.pathname !== '/auth' && (
                        <button className="btn btn-primary" onClick={() => navigate('/auth')}>
                            Log In
                        </button>
                    )
                )}
            </div>
        </nav>
    );
}

export default Navbar;
