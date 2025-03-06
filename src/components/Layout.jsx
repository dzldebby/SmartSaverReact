"use client";

import React from 'react';
import { motion } from 'framer-motion';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 transition-colors duration-300">
      <div className="container mx-auto px-1 py-6 max-w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <img src="/calculator-icon.svg" alt="Calculator Icon" className="w-10 h-10" />
              <h1 className="gradient-heading text-4xl md:text-5xl">SmartSaver</h1>
            </div>
            <p className="text-muted-foreground">Compare rates and find the best banking options for your needs</p>
          </header>
          
          <main>
            {children}
          </main>
          
          <footer className="mt-16 pt-8 border-t border-gray-200 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} SmartSaver. All rights reserved.</p>
          </footer>
        </motion.div>
      </div>
      
      {/* Background decorative elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-[-1]">
        <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[20%] right-[10%] w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>
        <div className="absolute top-[40%] right-[25%] w-72 h-72 bg-indigo/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default Layout; 