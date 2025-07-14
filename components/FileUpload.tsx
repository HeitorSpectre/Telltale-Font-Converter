

import React, { useState, useCallback, DragEvent, ChangeEvent, useRef } from 'react';
import { UploadIcon, CheckCircleIcon } from './icons';

interface FileUploadProps {
  label: string;
  onFileUpload: (file: File) => void | boolean;
  accept: string;
  uploadedFileName?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ label, onFileUpload, accept, uploadedFileName }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(uploadedFileName || null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File | null) => {
    if (file) {
      const success = onFileUpload(file);
      if (success) {
        setFileName(file.name);
      } else {
        // On failure (indicated by a `false` return), re-trigger the file input.
        if (inputRef.current) {
          inputRef.current.value = ''; // Reset to allow re-selecting the same file
          inputRef.current.click();
        }
      }
    }
  }, [onFileUpload]);

  const handleDragEnter = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const baseClasses = "flex justify-center w-full h-32 px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md transition-colors duration-200";
  const draggingClasses = "border-blue-500 bg-gray-700/50";
  const normalClasses = "hover:border-gray-500";
  
  if (fileName) {
    return (
        <div className="flex items-center justify-between w-full p-3 bg-gray-700 border border-gray-600 rounded-md">
            <span className="text-green-400 font-mono truncate">{fileName}</span>
            <CheckCircleIcon className="h-6 w-6 text-green-500 ml-4 flex-shrink-0" />
        </div>
    );
  }

  return (
    <div className="w-full">
      <label
        htmlFor={`file-upload-${label}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`${baseClasses} ${isDragging ? draggingClasses : normalClasses} cursor-pointer`}
      >
        <div className="space-y-1 text-center">
          <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
          <div className="flex text-sm text-gray-400">
            <p className="pl-1">
              <span className="font-semibold text-blue-400">{label}</span> or drag and drop
            </p>
          </div>
          <p className="text-xs text-gray-500">{accept}</p>
        </div>
        <input ref={inputRef} id={`file-upload-${label}`} name={`file-upload-${label}`} type="file" className="sr-only" accept={accept} onChange={handleChange} />
      </label>
    </div>
  );
};
