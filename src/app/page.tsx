'use client';

import { useState } from 'react';
import ImageGenerationForm from '@/components/form/ImageGenerationForm';
import ImageDisplay from '@/components/image/ImageDisplay';
import ImageGallery from '@/components/image/ImageGallery';

interface GenerationData {
  prompt: string;
  negativePrompt?: string;
  width: number;
  height: number;
  numInferenceSteps: number;
  guidanceScale: number;
  scheduler: string;
}

export default function Home() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<{
    prompt: string;
    negativePrompt?: string;
    width: number;
    height: number;
    timestamp: string;
  } | null>(null);

  const handleGenerate = async (data: GenerationData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/replicate/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: data.prompt,
          negative_prompt: data.negativePrompt,
          width: data.width,
          height: data.height,
          num_inference_steps: data.numInferenceSteps,
          guidance_scale: data.guidanceScale,
          scheduler: data.scheduler,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const result = await response.json();
      const imageUrl = result.output[0];
      
      setImageUrl(imageUrl);
      setMetadata({
        prompt: data.prompt,
        negativePrompt: data.negativePrompt,
        width: data.width,
        height: data.height,
        timestamp: new Date().toISOString(),
      });

      // Save to local storage
      const storedImages = JSON.parse(localStorage.getItem('generatedImages') || '[]');
      const newImage = {
        id: Date.now().toString(),
        url: imageUrl,
        ...data,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem('generatedImages', JSON.stringify([newImage, ...storedImages]));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while generating the image');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            AI Image Generator
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Create stunning images using AI
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <ImageGenerationForm onGenerate={handleGenerate} isLoading={isLoading} />
            <ImageDisplay
              imageUrl={imageUrl}
              isLoading={isLoading}
              error={error}
              metadata={metadata || undefined}
            />
          </div>
          <div>
            <ImageGallery />
          </div>
        </div>
      </div>
    </main>
  );
}
