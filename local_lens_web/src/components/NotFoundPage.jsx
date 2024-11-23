import React from 'react';

const NotFoundPage = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
            <div className="text-center">
                <h1 className="text-9xl font-bold text-white">404</h1>
                <p className="text-2xl text-white mt-4">Oops! Page not found</p>
                <p className="text-lg text-white mt-2">You might've gotten lost cause the page you are looking for does not exist.</p>
                <a href="/" className="mt-6 inline-block px-6 py-3 bg-white text-purple-500 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition duration-300">
                    Go Home
                </a>
            </div>
        </div>
    );
};

export default NotFoundPage;