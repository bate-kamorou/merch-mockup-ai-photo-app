
import React from 'react';
import { SparklesIcon } from './Icons';

export const Header: React.FC = () => {
  return (
    <header className="py-6 px-4 md:px-8 border-b border-gray-700/50">
      <div className="container mx-auto flex items-center gap-4">
        <SparklesIcon className="w-8 h-8 text-indigo-400" />
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Merch Mockup AI</h1>
          <p className="text-sm md:text-base text-gray-400">Instantly create stunning mockups and edits with AI.</p>
        </div>
      </div>
    </header>
  );
};
