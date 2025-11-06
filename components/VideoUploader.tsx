
import React, { useRef, ChangeEvent } from 'react';

interface VideoUploaderProps {
  videoUrl: string | null;
  onVideoUpload: (file: File) => void;
  videoRef: React.RefObject<HTMLVideoElement>;
}

const UploadIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 16h6v-6h4l-8-8-8 8h4v6zm-4 2h14v2H5v-2z"/>
    </svg>
);

export const VideoUploader: React.FC<VideoUploaderProps> = ({ videoUrl, onVideoUpload, videoRef }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onVideoUpload(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div className="aspect-video w-full bg-gray-900 rounded-lg overflow-hidden border-2 border-dashed border-gray-600 flex items-center justify-center">
        {videoUrl ? (
          <video ref={videoRef} src={videoUrl} controls className="w-full h-full object-contain" crossOrigin="anonymous" />
        ) : (
          <div
            className="text-center p-8 cursor-pointer text-gray-400 hover:text-cyan-400 transition-colors"
            onClick={handleClick}
          >
            <UploadIcon className="w-16 h-16 mx-auto text-gray-500" />
            <p className="mt-4 font-semibold">Click to upload a video</p>
            <p className="text-sm text-gray-500">or drag and drop a file</p>
          </div>
        )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="video/*"
        className="hidden"
      />
    </div>
  );
};
