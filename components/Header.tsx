
import React from 'react';

const FilmReelIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 4h16v2H4V4zm0 4h16v2H4V8zm0 4h16v2H4v-2zm0 4h16v2H4v-2zM2 2v20h20V2H2zm18 18H4V4h16v16z"/>
        <path d="M6 6h2v2H6zm0 4h2v2H6zm0 4h2v2H6zm10-8h2v2h-2zm0 4h2v2h-2zm0 4h2v2h-2z" />
    </svg>
);


export const Header: React.FC = () => {
  return (
    <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <FilmReelIcon className="w-8 h-8 text-cyan-400" />
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Automated Promo Video Generator
            </h1>
        </div>
        <div className="text-xs font-mono text-cyan-400 border border-cyan-400/50 rounded-full px-3 py-1 hidden sm:block">
            CNN Version
        </div>
      </div>
    </header>
  );
};
