
import React, { useState } from 'react';
import { ModeSelector } from './components/ModeSelector';
import { FntToTtfConverter } from './components/FntToTtfConverter';
import { TtfToFntConverter } from './components/TtfToFntConverter';
import { ConversionMode } from './types';

export default function App() {
  const [conversionMode, setConversionMode] = useState<ConversionMode>('select');

  const handleBackToSelect = () => {
    setConversionMode('select');
  };

  const renderContent = () => {
    switch (conversionMode) {
      case 'fntToTtf':
        return <FntToTtfConverter onBack={handleBackToSelect} />;
      case 'ttfToFnt':
        return <TtfToFntConverter onBack={handleBackToSelect} />;
      case 'select':
      default:
        return <ModeSelector onSelectMode={setConversionMode} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white tracking-wider">Telltale Font Converter</h1>
          <p className="text-gray-400 mt-2">Convert between Telltale's bitmap fonts and standard TTF files</p>
        </header>
        <main className="bg-gray-800 rounded-xl shadow-2xl p-6 sm:p-8 border border-gray-700 min-h-[400px] flex flex-col justify-center">
          {renderContent()}
        </main>
        <footer className="text-center mt-8 text-gray-500 text-sm">
          <p>Telltale Font Converter was created by Heitor Spectre / Spectre Games from CENTRAL DO PS3, with special thanks to my friend KRISP — part of the code from his tool was reworked to help bring this one to life.</p>
        </footer>
      </div>
    </div>
  );
}
