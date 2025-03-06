import React from 'react';
import { FeedbackForm } from './ui';

const Footer = () => {
  return (
    <footer className="mt-8 py-6 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="text-sm text-gray-600">
          Built with ❤️ by <a href="https://github.com/dzldebby/" target="_blank" rel="noopener noreferrer">Debby</a>.
          </div>
          <div className="mt-4 sm:mt-0">
            <FeedbackForm />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 