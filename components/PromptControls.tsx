
import React from 'react';
import { SparklesIcon } from './Icons';

interface PromptControlsProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  isReady: boolean;
}

const presetPrompts = [
  "Place on a black t-shirt.",
  "Mockup on a white coffee mug.",
  "Add a retro, vintage filter.",
  "Put this logo on a canvas tote bag.",
  "Make the background a solid bright color.",
  "Remove the background.",
];

export const PromptControls: React.FC<PromptControlsProps> = ({ prompt, setPrompt, onGenerate, isLoading, isReady }) => {
  return (
    <div className="flex flex-col gap-4 flex-grow">
      <div>
        <h2 className="text-lg font-semibold text-gray-200 mb-2">2. Describe Your Edit</h2>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., 'Add a cool retro filter' or 'Place this logo on a black t-shirt worn by a model'"
          className="w-full h-24 p-3 bg-gray-900/70 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors placeholder-gray-500"
          rows={3}
        />
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-400 mb-2">Or try an example:</h3>
        <div className="flex flex-wrap gap-2">
          {presetPrompts.map((p) => (
            <button
              key={p}
              onClick={() => setPrompt(p)}
              className="px-3 py-1.5 text-sm bg-gray-700/80 rounded-full hover:bg-indigo-600/50 hover:text-white transition-colors"
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-auto">
        <button
          onClick={onGenerate}
          disabled={!isReady || isLoading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 font-bold text-white bg-indigo-600 rounded-lg shadow-lg hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:scale-100"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <SparklesIcon className="w-5 h-5" />
              Generate Mockup
            </>
          )}
        </button>
      </div>
    </div>
  );
};
