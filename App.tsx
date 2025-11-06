
import React, { useState, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { VideoUploader } from './components/VideoUploader';
import { ConfigPanel } from './components/ConfigPanel';
import { ResultsDisplay } from './components/ResultsDisplay';
import { generatePromoScript } from './services/geminiService';
import { PromoSegment } from './types';
import { LoadingSpinner } from './components/LoadingSpinner';

const App: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [targetDuration, setTargetDuration] = useState<number>(30);
  const [addEffects, setAddEffects] = useState<boolean>(true);
  const [sceneSnap, setSceneSnap] = useState<boolean>(true);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [promoSegments, setPromoSegments] = useState<PromoSegment[]>([]);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoUpload = (file: File) => {
    setVideoFile(file);
    setPromoSegments([]);
    setError(null);
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
  };

  const handleGenerate = useCallback(async () => {
    if (!videoRef.current) {
      setError("Video element not found.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setPromoSegments([]);

    try {
      const segments = await generatePromoScript(
        videoRef.current,
        targetDuration,
        addEffects,
        sceneSnap
      );
      setPromoSegments(segments);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred during generation.");
    } finally {
      setIsLoading(false);
    }
  }, [targetDuration, addEffects, sceneSnap]);

  const seekVideoTo = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      videoRef.current.play();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 xl:col-span-3 bg-gray-800/50 rounded-lg p-6 self-start shadow-lg border border-gray-700">
          <ConfigPanel
            targetDuration={targetDuration}
            setTargetDuration={setTargetDuration}
            addEffects={addEffects}
            setAddEffects={setAddEffects}
            sceneSnap={sceneSnap}
            setSceneSnap={setSceneSnap}
            onGenerate={handleGenerate}
            isLoading={isLoading}
            videoLoaded={!!videoFile}
          />
        </div>

        <div className="lg:col-span-8 xl:col-span-9 bg-gray-800/50 rounded-lg p-6 shadow-lg border border-gray-700">
          <VideoUploader
            videoUrl={videoUrl}
            onVideoUpload={handleVideoUpload}
            videoRef={videoRef}
          />
          {isLoading && (
            <div className="mt-6 flex flex-col items-center justify-center text-center p-8 bg-gray-900/50 rounded-lg">
                <LoadingSpinner />
                <p className="mt-4 text-lg font-semibold text-cyan-400">AI is analyzing your video...</p>
                <p className="text-sm text-gray-400">This might take a moment, especially for longer videos.</p>
            </div>
          )}
          {error && (
            <div className="mt-6 p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg">
              <p className="font-bold">Generation Failed</p>
              <p className="text-sm">{error}</p>
            </div>
          )}
          {!isLoading && promoSegments.length > 0 && (
            <ResultsDisplay segments={promoSegments} onSegmentClick={seekVideoTo} />
          )}
        </div>
      </main>
      <footer className="text-center p-4 text-gray-500 text-sm">
        <p>Powered by Google Gemini</p>
      </footer>
    </div>
  );
};

export default App;
