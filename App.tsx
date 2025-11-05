
import React, { useState, useCallback } from 'react';
import { editImageWithPrompt } from './services/geminiService';
import { ImageUploader } from './components/ImageUploader';
import { GeneratedImageDisplay } from './components/GeneratedImageDisplay';
import { Header } from './components/Header';
import { PromptControls } from './components/PromptControls';
import { ImageFile } from './types';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<ImageFile | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!imageFile || !prompt) {
      setError('Please upload an image and provide a prompt.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const result = await editImageWithPrompt(imageFile, prompt);
      if (result) {
        setGeneratedImage(`data:${result.mimeType};base64,${result.base64}`);
      } else {
        setError('Failed to generate image. The model might not have returned an image.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [imageFile, prompt]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Controls */}
          <div className="flex flex-col gap-6 p-6 bg-gray-800/50 rounded-2xl shadow-lg border border-gray-700">
            <ImageUploader onImageUpload={setImageFile} />
            <PromptControls 
              prompt={prompt} 
              setPrompt={setPrompt} 
              onGenerate={handleGenerate} 
              isLoading={isLoading} 
              isReady={!!imageFile && !!prompt}
            />
          </div>

          {/* Right Column: Results */}
          <GeneratedImageDisplay
            originalImage={imageFile?.base64}
            generatedImage={generatedImage}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
