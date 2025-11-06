
import React from 'react';

interface ConfigPanelProps {
  targetDuration: number;
  setTargetDuration: (duration: number) => void;
  addEffects: boolean;
  setAddEffects: (add: boolean) => void;
  sceneSnap: boolean;
  setSceneSnap: (snap: boolean) => void;
  onGenerate: () => void;
  isLoading: boolean;
  videoLoaded: boolean;
}

const SparklesIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z"/>
    </svg>
);


export const ConfigPanel: React.FC<ConfigPanelProps> = ({
  targetDuration,
  setTargetDuration,
  addEffects,
  setAddEffects,
  sceneSnap,
  setSceneSnap,
  onGenerate,
  isLoading,
  videoLoaded,
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Configuration</h2>
      
      {/* Target Duration */}
      <div className="space-y-2">
        <label htmlFor="duration" className="block font-medium text-gray-300">Target Duration</label>
        <div className="flex items-center gap-4">
          <input
            id="duration"
            type="range"
            min="10"
            max="120"
            step="5"
            value={targetDuration}
            onChange={(e) => setTargetDuration(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <span className="font-mono bg-gray-900 px-3 py-1 rounded-md text-cyan-400 w-20 text-center">
            {targetDuration}s
          </span>
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-4 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-300">Suggest Effects</span>
          <button
            onClick={() => setAddEffects(!addEffects)}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
              addEffects ? 'bg-cyan-500' : 'bg-gray-600'
            }`}
          >
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
              addEffects ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
        <p className="text-xs text-gray-500">AI will suggest crossfades, speed ramps, etc.</p>

        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-300">Scene Snapping</span>
          <button
            onClick={() => setSceneSnap(!sceneSnap)}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
              sceneSnap ? 'bg-cyan-500' : 'bg-gray-600'
            }`}
          >
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
              sceneSnap ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
        <p className="text-xs text-gray-500">Aligns clips with natural scene changes for better flow.</p>
      </div>

      {/* Generate Button */}
      <div className="pt-4 border-t border-gray-700">
        <button
          onClick={onGenerate}
          disabled={isLoading || !videoLoaded}
          className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg shadow-cyan-900/50"
        >
          <SparklesIcon className="w-5 h-5" />
          {isLoading ? 'Generating...' : 'Generate Promo Script'}
        </button>
        {!videoLoaded && <p className="text-xs text-center mt-2 text-gray-500">Please upload a video first.</p>}
      </div>
    </div>
  );
};
