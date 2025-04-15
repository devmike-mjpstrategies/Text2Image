'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ImageGenerationFormProps {
  onGenerate: (data: GenerationData) => void;
  isLoading: boolean;
}

interface GenerationData {
  prompt: string;
  negativePrompt?: string;
  width: number;
  height: number;
  numInferenceSteps: number;
  guidanceScale: number;
  scheduler: string;
}

export default function ImageGenerationForm({ onGenerate, isLoading }: ImageGenerationFormProps) {
  const [formData, setFormData] = useState<GenerationData>({
    prompt: '',
    negativePrompt: '',
    width: 512,
    height: 512,
    numInferenceSteps: 50,
    guidanceScale: 7.5,
    scheduler: 'DPMSolverMultistep',
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }
    setError(null);
    onGenerate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Prompt
          </label>
          <textarea
            id="prompt"
            value={formData.prompt}
            onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600"
            rows={4}
            placeholder="Describe the image you want to generate..."
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="negativePrompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Negative Prompt
          </label>
          <textarea
            id="negativePrompt"
            value={formData.negativePrompt}
            onChange={(e) => setFormData({ ...formData, negativePrompt: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600"
            rows={2}
            placeholder="Describe what you don't want in the image..."
            disabled={isLoading}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="width" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Width
            </label>
            <select
              id="width"
              value={formData.width}
              onChange={(e) => setFormData({ ...formData, width: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600"
              disabled={isLoading}
            >
              <option value={512}>512px</option>
              <option value={768}>768px</option>
              <option value={1024}>1024px</option>
            </select>
          </div>

          <div>
            <label htmlFor="height" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Height
            </label>
            <select
              id="height"
              value={formData.height}
              onChange={(e) => setFormData({ ...formData, height: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600"
              disabled={isLoading}
            >
              <option value={512}>512px</option>
              <option value={768}>768px</option>
              <option value={1024}>1024px</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="numInferenceSteps" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Inference Steps
            </label>
            <input
              type="number"
              id="numInferenceSteps"
              value={formData.numInferenceSteps}
              onChange={(e) => setFormData({ ...formData, numInferenceSteps: parseInt(e.target.value) })}
              min={1}
              max={100}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="guidanceScale" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Guidance Scale
            </label>
            <input
              type="number"
              id="guidanceScale"
              value={formData.guidanceScale}
              onChange={(e) => setFormData({ ...formData, guidanceScale: parseFloat(e.target.value) })}
              min={1}
              max={20}
              step={0.5}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600"
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="scheduler" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Scheduler
          </label>
          <select
            id="scheduler"
            value={formData.scheduler}
            onChange={(e) => setFormData({ ...formData, scheduler: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600"
            disabled={isLoading}
          >
            <option value="DPMSolverMultistep">DPM-Solver++</option>
            <option value="K_EULER">Euler</option>
            <option value="K_EULER_ANCESTRAL">Euler Ancestral</option>
            <option value="DDIM">DDIM</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Generating...' : 'Generate Image'}
      </button>
    </form>
  );
} 