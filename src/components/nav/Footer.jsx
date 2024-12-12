import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-300 py-5 text-center dark:bg-gray-500 dark:text-white">
            <p>&copy; {new Date().getFullYear()} Konnichiwa. All Rights Reserved.</p>
        </footer>
    );
};

export default Footer;