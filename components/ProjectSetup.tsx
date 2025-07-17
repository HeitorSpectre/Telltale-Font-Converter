
import React, { useState } from 'react';

interface ProjectSetupProps {
  onNext: (projectName: string) => void;
  onBack: () => void;
}

export const ProjectSetup: React.FC<ProjectSetupProps> = ({ onNext, onBack }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(name);
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4 text-white">Setup New Font Project</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <label htmlFor="project-name" className="block text-sm font-medium text-gray-300 mb-2">
          Project Name:
        </label>
        <input
          id="project-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., My Telltale Font"
          className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        />
        <div className="mt-6 space-y-2">
            <button
              type="submit"
              disabled={!name.trim()}
              className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Continue
            </button>
            <button
              type="button"
              onClick={onBack}
              className="w-full px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              Back
            </button>
        </div>
      </form>
    </div>
  );
};
