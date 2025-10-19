import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gold-500 p-4 text-center mt-auto">
      <div className="container mx-auto">
        <p className="text-sm">
          Designed and maintained by{' '}
          <a 
            href="https://www.linkedin.com/in/thousif-ibrahim-29050421b" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gold-400 hover:text-gold-300 transition-colors duration-300 font-medium"
          >
            smdspace
          </a>
        </p>
        <p className="text-xs mt-2 text-gray-500">
          <a 
            href="https://www.linkedin.com/in/thousif-ibrahim-29050421b" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-gold-400 transition-colors duration-300"
          >
            © {new Date().getFullYear()} Qareeb. All rights reserved.
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
