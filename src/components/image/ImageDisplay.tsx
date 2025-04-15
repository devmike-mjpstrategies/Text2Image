'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageDisplayProps {
  imageUrl: string | null;
  isLoading: boolean;
  error: string | null;
  metadata?: {
    prompt: string;
    negativePrompt?: string;
    width: number;
    height: number;
    timestamp: string;
  };
}

export default function ImageDisplay({ imageUrl, isLoading, error, metadata }: ImageDisplayProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleDownload = async () => {
    if (!imageUrl) return;
    
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `generated-image-${new Date().toISOString()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading image:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="text-gray-500 dark:text-gray-400">Generating your image...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-2xl mx-auto aspect-square bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-500 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!imageUrl) {
    return (
      <div className="w-full max-w-2xl mx-auto aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">No image generated yet</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
        <Image
          src={imageUrl}
          alt="Generated image"
          fill
          className={`object-contain transition-transform duration-300 ${
            isFullscreen ? 'scale-100' : 'hover:scale-105'
          }`}
          onClick={() => setIsFullscreen(!isFullscreen)}
        />
      </div>

      {metadata && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Image Details</h3>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Prompt:</span> {metadata.prompt}</p>
            {metadata.negativePrompt && (
              <p><span className="font-medium">Negative Prompt:</span> {metadata.negativePrompt}</p>
            )}
            <p><span className="font-medium">Dimensions:</span> {metadata.width}x{metadata.height}px</p>
            <p><span className="font-medium">Generated:</span> {new Date(metadata.timestamp).toLocaleString()}</p>
          </div>
        </div>
      )}

      <div className="flex justify-center space-x-4">
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Download Image
        </button>
      </div>
    </div>
  );
} 