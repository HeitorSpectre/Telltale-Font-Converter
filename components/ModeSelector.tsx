
import React from 'react';
import { ConversionMode } from '../types';

interface ModeSelectorProps {
  onSelectMode: (mode: 'fntToTtf' | 'ttfToFnt') => void;
}

const ModeCard: React.FC<{ title: string, description: string, onClick: () => void }> = ({ title, description, onClick }) => (
    <button 
        onClick={onClick}
        className="w-full text-left p-6 bg-gray-900 rounded-lg border border-gray-700 hover:bg-gray-700/50 hover:border-blue-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
        <h3 className="text-lg font-semibold text-blue-400">{title}</h3>
        <p className="text-sm text-gray-400 mt-2">{description}</p>
    </button>
);


export const ModeSelector: React.FC<ModeSelectorProps> = ({ onSelectMode }) => {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-6 text-white">Choose Conversion Type</h2>
      <div className="grid sm:grid-cols-1 gap-6">
        <ModeCard 
            title="FNT & PNG → TTF"
            description="Combine Telltale's .fnt and texture .png files into a single, standard .ttf font file."
            onClick={() => onSelectMode('fntToTtf')}
        />
        <ModeCard
            title="TTF → FNT & PNG"
            description="Convert a standard .ttf font file into a Telltale-compatible .fnt and .png texture atlas."
            onClick={() => onSelectMode('ttfToFnt')}
        />
      </div>
    </div>
  );
};
