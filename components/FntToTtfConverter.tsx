
import React, { useState, useCallback } from 'react';
import { ProjectSetup } from './ProjectSetup';
import { FileUpload } from './FileUpload';
import { FontProcessor } from './FontProcessor';
import { FntData, PngFilesMap, AppState, SelectedCharsets } from '../types';
import { parseFnt } from '../services/fntParser';
import { generateTtf } from '../services/ttfGenerator';
import { CheckCircleIcon, ExclamationTriangleIcon, LoaderIcon } from './icons';
import { CHAR_SET_NAMES } from '../constants';

interface FntToTtfConverterProps {
  onBack: () => void;
}

export const FntToTtfConverter: React.FC<FntToTtfConverterProps> = ({ onBack }) => {
  const [appState, setAppState] = useState<AppState>('setup');
  const [projectName, setProjectName] = useState<string>('');
  const [fntFile, setFntFile] = useState<File | null>(null);
  const [fntData, setFntData] = useState<FntData | null>(null);
  const [pngFiles, setPngFiles] = useState<PngFilesMap>({});
  const [error, setError] = useState<string | null>(null);
  const [selectedCharsets, setSelectedCharsets] = useState<SelectedCharsets>(
    () => CHAR_SET_NAMES.reduce((acc, name) => ({ ...acc, [name]: true }), {})
  );

  const handleProjectNameSet = (name: string) => {
    if (name.trim()) {
      setProjectName(name.trim());
      setAppState('fnt_upload');
      setError(null);
    } else {
      setError('Project name cannot be empty.');
    }
  };

  const handleFntUpload = useCallback((file: File) => {
    setError(null);
    if (!file.name.endsWith('.fnt')) {
      setError('Invalid file type. Please upload a .fnt file.');
      return false;
    }

    setFntFile(file);
    setAppState('processing');

    const processFile = async () => {
      try {
        const text = await file.text();
        const data = parseFnt(text);
        if (data.pages.length === 0) {
          throw new Error('The .fnt file does not specify any page files (.png textures).');
        }
        setFntData(data);
        setAppState('png_upload');
      } catch (e) {
        const err = e as Error;
        setError(`Error parsing .fnt file: ${err.message}`);
        setAppState('fnt_upload');
        setFntFile(null);
      }
    };

    processFile();

    return true;
  }, []);

  const handlePngUpload = (fileName: string, file: File): boolean => {
    setError(null);
    if (!file.name.endsWith('.png')) {
      setError(`Invalid file type for ${fileName}. Please upload a .png file.`);
      return false;
    }
    if (file.name !== fileName) {
      setError(`The file "${file.name}" is incorrect. Please upload the file named "${fileName}".`);
      return false;
    }
    setPngFiles(prev => ({ ...prev, [fileName]: file }));
    return true;
  };

  const handleGenerate = async () => {
    if (!fntData || !projectName) return;
    setAppState('generating');
    setError(null);
    try {
      await generateTtf(projectName, fntData, pngFiles, selectedCharsets);
      setAppState('done');
    } catch (e) {
      const err = e as Error;
      console.error(e);
      setError(`Failed to generate TTF: ${err.message}`);
      setAppState('png_upload');
    }
  };

  const handleReset = () => {
    setAppState('setup');
    setProjectName('');
    setFntFile(null);
    setFntData(null);
    setPngFiles({});
    setError(null);
    setSelectedCharsets(
        CHAR_SET_NAMES.reduce((acc, name) => ({ ...acc, [name]: true }), {})
    );
  };

  const renderContent = () => {
    switch (appState) {
      case 'setup':
        return <ProjectSetup onNext={handleProjectNameSet} onBack={onBack} />;
      case 'fnt_upload':
        return <FileUpload label="Upload .fnt File" onFileUpload={handleFntUpload} accept=".fnt" />;
      case 'png_upload':
      case 'generating':
        return fntData ? <FontProcessor 
                            fntData={fntData} 
                            pngFiles={pngFiles} 
                            onPngUpload={handlePngUpload} 
                            onGenerate={handleGenerate} 
                            isLoading={appState === 'generating'}
                            selectedCharsets={selectedCharsets}
                            onCharsetChange={setSelectedCharsets}
                         /> : null;
      case 'processing':
        return (
          <div className="flex flex-col items-center justify-center text-center p-8">
            <LoaderIcon className="h-12 w-12 text-blue-500" />
            <p className="mt-4 text-lg">Processing .fnt file...</p>
          </div>
        );
      case 'done':
        return (
          <div className="flex flex-col items-center justify-center text-center p-8 bg-gray-800 rounded-lg shadow-lg">
            <CheckCircleIcon className="h-16 w-16 text-green-500" />
            <h2 className="mt-4 text-2xl font-bold">Success!</h2>
            <p className="mt-2 text-gray-300">Your TTF font has been generated and downloaded.</p>
            <button
              onClick={handleReset}
              className="mt-6 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Start New Project
            </button>
          </div>
        );
      default:
        return null;
    }
  };

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
