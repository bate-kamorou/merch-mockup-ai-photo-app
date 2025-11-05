
import React, { useCallback } from 'react';
import { DownloadIcon, ImageIcon, AlertTriangleIcon } from './Icons';

interface GeneratedImageDisplayProps {
  originalImage: string | null | undefined;
  generatedImage: string | null;
  isLoading: boolean;
  error: string | null;
}

const getFileExtensionFromMimeType = (mimeType: string): string => {
  if (!mimeType) return 'jpg';
  // e.g., 'image/png' -> 'png'
  const subtype = mimeType.split('/')[1];
  if (!subtype) return 'jpg';
  // e.g., 'svg+xml' -> 'svg'
  return subtype.split('+')[0];
};

const dataURLtoBlob = (dataUrl: string): Blob | null => {
    try {
        const arr = dataUrl.split(',');
        if (arr.length < 2) return null;
        
        const mimeMatch = arr[0].match(/:(.*?);/);
        if (!mimeMatch || !mimeMatch[1]) return null;
        const mime = mimeMatch[1];
        
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    } catch (e) {
        console.error('Could not convert data URL to blob', e);
        return null;
    }
};

const ImageBox: React.FC<{ src: string | null; title: string; children?: React.ReactNode }> = ({ src, title, children }) => (
  <div className="relative w-full aspect-square bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center">
    {src ? (
      <>
        <img src={src} alt={title} className="w-full h-full object-contain" />
        <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">{title}</div>
        {children}
      </>
    ) : (
      <div className="text-gray-500 text-sm">{title} will appear here</div>
    )}
  </div>
);


const Placeholder: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="w-full aspect-square bg-gray-800 border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center text-center p-4">
        {children}
    </div>
);


export const GeneratedImageDisplay: React.FC<GeneratedImageDisplayProps> = ({ originalImage, generatedImage, isLoading, error }) => {
  
  const handleDownload = useCallback(() => {
    if (!generatedImage) return;

    const blob = dataURLtoBlob(generatedImage);
    if (!blob) {
      console.error("Failed to create blob for download.");
      return;
    }

    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    
    const extension = getFileExtensionFromMimeType(blob.type);
    link.download = `generated-mockup.${extension}`;
    
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);
  }, [generatedImage]);


  return (
    <div className="p-6 bg-gray-800/50 rounded-2xl shadow-lg border border-gray-700">
      <h2 className="text-lg font-semibold text-gray-200 mb-4">3. Result</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ImageBox src={originalImage} title="Original" />
        
        <div className="relative w-full aspect-square">
          {isLoading && (
            <div className="absolute inset-0 bg-gray-800 rounded-lg flex flex-col items-center justify-center z-10">
              <svg className="animate-spin h-10 w-10 text-indigo-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-300">Generating your image...</p>
              <p className="text-sm text-gray-500">This may take a moment.</p>
            </div>
          )}

          {error && (
             <Placeholder>
                <AlertTriangleIcon className="w-10 h-10 text-red-400 mb-3" />
                <h3 className="font-semibold text-red-400">Generation Failed</h3>
                <p className="text-sm text-gray-400 mt-1">{error}</p>
             </Placeholder>
          )}

          {!isLoading && !error && !generatedImage && (
            <Placeholder>
                <ImageIcon className="w-10 h-10 text-gray-500 mb-3" />
                <h3 className="font-semibold text-gray-300">Your mockup is waiting</h3>
                <p className="text-sm text-gray-500 mt-1">Upload an image and enter a prompt to get started.</p>
            </Placeholder>
          )}
          
          {!isLoading && !error && generatedImage && (
            <ImageBox src={generatedImage} title="Generated">
              <button
                onClick={handleDownload}
                className="absolute bottom-3 right-3 flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-500 transition-colors shadow-lg"
              >
                <DownloadIcon className="w-4 h-4" />
                Download
              </button>
            </ImageBox>
          )}
        </div>
      </div>
    </div>
  );
};
