import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gold-500 p-4 text-center mt-auto">
      <div className="container mx-auto">
        <p className="text-sm">
          Designed and maintained by{' '}
          <a 
            href="https://smdspace.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gold-400 hover:text-gold-300 transition-colors duration-300 font-medium"
          >
            smdspace
          </a>
        </p>
        <p className="text-xs mt-2 text-gray-500">
          © {new Date().getFullYear()} Muslim Lifestyle App. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
