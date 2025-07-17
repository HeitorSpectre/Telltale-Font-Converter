
import React, { useState, useCallback, useMemo } from 'react';
import * as opentype from 'opentype.js';
import { FileUpload } from './FileUpload';
import { SelectedCharsets, CharSetName } from '../types';
import { LoaderIcon, CheckCircleIcon, ExclamationTriangleIcon } from './icons';
import { generateFntAndPng } from '../services/fntGenerator';
import { CHAR_SET_NAMES, CHAR_SETS } from '../constants';

type TtfConverterState = 'upload' | 'configure' | 'generating' | 'done';

interface TtfToFntConverterProps {
  onBack: () => void;
}

export const TtfToFntConverter: React.FC<TtfToFntConverterProps> = ({ onBack }) => {
  const [step, setStep] = useState<TtfConverterState>('upload');
  const [ttfFile, setTtfFile] = useState<File | null>(null);
  const [font, setFont] = useState<opentype.Font | null>(null);
  const [projectName, setProjectName] = useState('');
  const [fontSize, setFontSize] = useState<string>('64');
  const [textureWidth, setTextureWidth] = useState<string>('1024');
  const [textureHeight, setTextureHeight] = useState<string>('1024');
  const [error, setError] = useState<string | null>(null);
  const [selectedCharsets, setSelectedCharsets] = useState<SelectedCharsets>(
    () => CHAR_SET_NAMES.reduce((acc, name) => ({ ...acc, [name]: true }), {})
  );

  const handleTtfUpload = useCallback((file: File) => {
    setError(null);
    if (!file.name.endsWith('.ttf') && !file.name.endsWith('.otf')) {
      setError('Invalid file type. Please upload a .ttf or .otf file.');
      return false;
    }
    setTtfFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const font = opentype.parse(e.target?.result);
        setFont(font);
        setProjectName(font.names.fontFamily.en);
        setStep('configure');
      } catch (err) {
        console.error(err);
        setError(`Error parsing font file: ${(err as Error).message}`);
        setTtfFile(null);
      }
    };
    reader.onerror = () => {
      setError('Could not read the font file.');
      setTtfFile(null);
    };
    reader.readAsArrayBuffer(file);
    return true;
  }, []);
  
  const handleCheckboxChange = (name: CharSetName) => {
    onCharsetChange({
      ...selectedCharsets,
      [name]: !selectedCharsets[name],
    });
  };

  const onCharsetChange = (charsets: SelectedCharsets) => {
    setSelectedCharsets(charsets);
  }

  const includedChars = useMemo(() => {
    if (!font) return '';
    let allowedChars = "";
    for (const name of CHAR_SET_NAMES) {
      if (selectedCharsets[name]) {
        allowedChars += CHAR_SETS[name];
      }
    }
    const uniqueChars = Array.from(new Set(allowedChars.split('')));
    return uniqueChars.filter(char => font.charToGlyph(char).index !== 0).sort().join('');
  }, [selectedCharsets, font]);

  const handleGenerate = async () => {
    const finalFontSize = parseInt(fontSize, 10) || 0;
    const finalTextureWidth = parseInt(textureWidth, 10) || 0;
    const finalTextureHeight = parseInt(textureHeight, 10) || 0;
    
    if (!font || !projectName || finalFontSize <= 0 || finalTextureWidth <= 0 || finalTextureHeight <= 0 || includedChars.length === 0) return;

    setStep('generating');
    setError(null);
    try {
      await generateFntAndPng(font, projectName, finalFontSize, selectedCharsets, finalTextureWidth, finalTextureHeight);
      setStep('done');
    } catch (err) {
      console.error(err);
      setError(`Failed to generate files: ${(err as Error).message}`);
      setStep('configure');
    }
  }

  const handleReset = () => {
    setStep('upload');
    setTtfFile(null);
    setFont(null);
    setProjectName('');
    setFontSize('64');
    setTextureWidth('1024');
    setTextureHeight('1024');
    setError(null);
    setSelectedCharsets(
      CHAR_SET_NAMES.reduce((acc, name) => ({ ...acc, [name]: true }), {})
    );
  };
  
  const renderContent = () => {
    switch (step) {
      case 'upload':
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 text-white">Upload Font File</h2>
            <FileUpload label="Upload .ttf or .otf File" onFileUpload={handleTtfUpload} accept=".ttf,.otf" />
            <button
                type="button"
                onClick={onBack}
                className="mt-6 px-6 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
                Back
            </button>
          </div>
        );
      case 'configure':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Configure Output</h2>
              <p className="text-gray-400 mt-1">Set the parameters for your new font files.</p>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="project-name" className="block text-sm font-medium text-gray-300 mb-2">Project Name</label>
                <input id="project-name" type="text" value={projectName} onChange={e => setProjectName(e.target.value)} className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"/>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                <div className="flex-1">
                    <label htmlFor="font-size" className="block text-sm font-medium text-gray-300 mb-2">Font Size (px)</label>
                    <input id="font-size" type="number" value={fontSize} onChange={e => setFontSize(e.target.value)} className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"/>
                </div>
                <div className="flex-1">
                    <label htmlFor="texture-width" className="block text-sm font-medium text-gray-300 mb-2">Texture Width</label>
                    <input id="texture-width" type="number" value={textureWidth} onChange={e => setTextureWidth(e.target.value)} className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"/>
                </div>
                <div className="flex-1">
                    <label htmlFor="texture-height" className="block text-sm font-medium text-gray-300 mb-2">Texture Height</label>
                    <input id="texture-height" type="number" value={textureHeight} onChange={e => setTextureHeight(e.target.value)} className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"/>
                </div>
              </div>

            </div>
            
            <div className="pt-4 border-t border-gray-700">
                <h3 className="text-xl font-bold text-white">Customize Character Set</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                  {CHAR_SET_NAMES.map(name => (
                    <label key={name} className="flex items-center space-x-3 p-3 bg-gray-900 rounded-lg cursor-pointer hover:bg-gray-950/50 transition-colors">
                      <input type="checkbox" checked={!!selectedCharsets[name]} onChange={() => handleCheckboxChange(name)} className="h-5 w-5 rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-600" />
                      <span className="text-gray-300 font-medium">{name}</span>
                    </label>
                  ))}
                </div>
                <div className="mt-4">
                    <h4 className="text-lg font-semibold text-white">Preview of Included Characters</h4>
                    <div className="mt-2 p-3 bg-gray-900 rounded-md max-h-32 overflow-y-auto font-mono text-gray-300 break-all">
                        {includedChars || <span className="text-gray-500">No characters selected or available in font.</span>}
                    </div>
                </div>
            </div>

            <div className="pt-4 border-t border-gray-700">
              <button onClick={handleGenerate} disabled={!projectName || !(parseInt(fontSize, 10) > 0) || !(parseInt(textureWidth, 10) > 0) || !(parseInt(textureHeight, 10) > 0) || includedChars.length === 0} className="w-full flex justify-center items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-200">
                Generate FNT & PNG
              </button>
            </div>
          </div>
        );
      case 'generating':
        return (
          <div className="flex flex-col items-center justify-center text-center p-8">
            <LoaderIcon className="h-12 w-12 text-blue-500" />
            <p className="mt-4 text-lg">Generating font files...</p>
          </div>
        );
       case 'done':
        return (
          <div className="flex flex-col items-center justify-center text-center p-8">
            <CheckCircleIcon className="h-16 w-16 text-green-500" />
            <h2 className="mt-4 text-2xl font-bold">Success!</h2>
            <p className="mt-2 text-gray-300">Your .fnt and .png files have been generated and downloaded.</p>
            <button onClick={handleReset} className="mt-6 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200">
              Start New Conversion
            </button>
          </div>
        );
    }
  }

  return (
    <>
      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg relative mb-6 flex items-center" role="alert">
          <ExclamationTriangleIcon className="h-5 w-5 mr-3" />
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      {renderContent()}
    </>
  );
}
