
import React, { useMemo } from 'react';
import { FntData, PngFilesMap, SelectedCharsets, CharSetName } from '../types';
import { FileUpload } from './FileUpload';
import { LoaderIcon } from './icons';
import { CHAR_SET_NAMES, CHAR_SETS, CHAR_MAP } from '../constants';

interface FontProcessorProps {
  fntData: FntData;
  pngFiles: PngFilesMap;
  onPngUpload: (fileName: string, file: File) => boolean;
  onGenerate: () => void;
  isLoading: boolean;
  selectedCharsets: SelectedCharsets;
  onCharsetChange: (charsets: SelectedCharsets) => void;
}

export const FontProcessor: React.FC<FontProcessorProps> = ({
  fntData,
  pngFiles,
  onPngUpload,
  onGenerate,
  isLoading,
  selectedCharsets,
  onCharsetChange,
}) => {
  const allPngsUploaded = fntData.pages.length > 0 && fntData.pages.every(p => pngFiles[p.file]);

  const handleCheckboxChange = (name: CharSetName) => {
    onCharsetChange({
      ...selectedCharsets,
      [name]: !selectedCharsets[name],
    });
  };

  const getFilteredChars = useMemo(() => {
    let allowedChars = "";
    for (const name of CHAR_SET_NAMES) {
      if (selectedCharsets[name]) {
        allowedChars += CHAR_SETS[name];
      }
    }
    const allowedCharsSet = new Set(allowedChars.split(''));
    const availableInFnt = new Set(fntData.chars.map(c => CHAR_MAP[c.id]).filter(Boolean));
    
    return Array.from(allowedCharsSet)
      .filter(char => availableInFnt.has(char))
      .sort()
      .join('');
  }, [selectedCharsets, fntData.chars]);


  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Upload Texture Files</h2>
        <p className="text-gray-400 mt-1">
          Your `.fnt` file requires the following texture pages. Please upload each one.
        </p>
      </div>
      <div className="space-y-4">
        {fntData.pages.map(page => (
          <div key={page.id}>
             <label className="block text-sm font-medium text-gray-300 mb-2">
                Required file: <span className="font-mono text-blue-400">{page.file}</span>
            </label>
            <FileUpload
              label={`Upload ${page.file}`}
              onFileUpload={(file) => onPngUpload(page.file, file)}
              accept=".png"
              uploadedFileName={pngFiles[page.file]?.name}
            />
          </div>
        ))}
      </div>
      
      <div className="pt-4 border-t border-gray-700">
        <h3 className="text-xl font-bold text-white">Customize Character Set</h3>
        <p className="text-gray-400 mt-1 mb-4">Select which character sets to include in your final font file.</p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {CHAR_SET_NAMES.map(name => (
            <label key={name} className="flex items-center space-x-3 p-3 bg-gray-900 rounded-lg cursor-pointer hover:bg-gray-950/50 transition-colors">
              <input
                type="checkbox"
                checked={!!selectedCharsets[name]}
                onChange={() => handleCheckboxChange(name)}
                className="h-5 w-5 rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-600"
              />
              <span className="text-gray-300 font-medium">{name}</span>
            </label>
          ))}
        </div>

        <div className="mt-4">
            <h4 className="text-lg font-semibold text-white">Preview of Included Characters</h4>
            <p className="text-gray-400 text-sm mt-1">
                The following characters from your `.fnt` file will be included in the generated TTF.
            </p>
            <div className="mt-2 p-3 bg-gray-900 rounded-md max-h-32 overflow-y-auto font-mono text-gray-300 break-all">
                {getFilteredChars || <span className="text-gray-500">No characters selected or available.</span>}
            </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-700">
        <button
          onClick={onGenerate}
          disabled={!allPngsUploaded || isLoading || getFilteredChars.length === 0}
          className="w-full flex justify-center items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isLoading ? (
            <>
              <LoaderIcon className="h-5 w-5 mr-3" />
              Generating Font...
            </>
          ) : (
            'Generate TTF'
          )}
        </button>
      </div>
    </div>
  );
};
