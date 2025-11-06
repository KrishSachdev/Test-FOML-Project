
import React from 'react';
import { PromoSegment } from '../types';

interface ResultsDisplayProps {
  segments: PromoSegment[];
  onSegmentClick: (time: number) => void;
}

const PlayIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M8 5v14l11-7z"/>
    </svg>
);

const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const msecs = Math.round((seconds - Math.floor(seconds)) * 10);
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${msecs}`;
};

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ segments, onSegmentClick }) => {
    const totalDuration = segments.reduce((acc, seg) => acc + (seg.end_time - seg.start_time), 0);

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-700">
        <h2 className="text-2xl font-bold text-white">Generated Shot List</h2>
        <div className="text-right">
            <p className="font-mono text-cyan-400">{segments.length} clips</p>
            <p className="font-mono text-gray-400 text-sm">~{Math.round(totalDuration)}s total</p>
        </div>
      </div>
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
        {segments.map((segment, index) => (
          <div
            key={index}
            className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-cyan-500 transition-all group"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-mono text-cyan-400 text-lg">
                  {formatTime(segment.start_time)} &rarr; {formatTime(segment.end_time)}
                </div>
                <p className="mt-2 text-gray-300">{segment.description}</p>
                 {segment.suggested_effects && segment.suggested_effects.toLowerCase() !== 'none' && (
                    <p className="mt-2 text-xs font-mono text-gray-500 bg-gray-900 inline-block px-2 py-1 rounded">
                        FX: {segment.suggested_effects}
                    </p>
                )}
              </div>
              <button
                onClick={() => onSegmentClick(segment.start_time)}
                className="bg-gray-700 p-3 rounded-full hover:bg-cyan-600 text-white transition-colors group-hover:scale-110 transform"
                title={`Jump to ${formatTime(segment.start_time)}`}
              >
                <PlayIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
