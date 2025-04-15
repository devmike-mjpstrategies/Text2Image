'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  negativePrompt?: string;
  width: number;
  height: number;
  timestamp: string;
}

const ITEMS_PER_PAGE = 6;

export default function ImageGallery() {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);

  useEffect(() => {
    const storedImages = localStorage.getItem('generatedImages');
    if (storedImages) {
      setImages(JSON.parse(storedImages));
    }
  }, []);

  const totalPages = Math.ceil(images.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentImages = images.slice(startIndex, endIndex);

  const handleDelete = (id: string) => {
    const updatedImages = images.filter(img => img.id !== id);
    setImages(updatedImages);
    localStorage.setItem('generatedImages', JSON.stringify(updatedImages));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Generated Images</h2>
      
      {images.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No images generated yet</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentImages.map((image) => (
              <div
                key={image.id}
                className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden group"
              >
                <Image
                  src={image.url}
                  alt={image.prompt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  onClick={() => setSelectedImage(image)}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => handleDelete(image.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-md disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-3 py-1">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full p-6 space-y-4">
            <div className="relative aspect-square">
              <Image
                src={selectedImage.url}
                alt={selectedImage.prompt}
                fill
                className="object-contain"
              />
            </div>
            <div className="space-y-2">
              <p><span className="font-medium">Prompt:</span> {selectedImage.prompt}</p>
              {selectedImage.negativePrompt && (
                <p><span className="font-medium">Negative Prompt:</span> {selectedImage.negativePrompt}</p>
              )}
              <p><span className="font-medium">Dimensions:</span> {selectedImage.width}x{selectedImage.height}px</p>
              <p><span className="font-medium">Generated:</span> {new Date(selectedImage.timestamp).toLocaleString()}</p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setSelectedImage(null)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 