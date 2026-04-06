'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

type UploadMode = 'file' | 'text' | 'url';

export function FileUpload() {
  const [mode, setMode] = useState<UploadMode>('file');
  const [title, setTitle] = useState('');
  const [textContent, setTextContent] = useState('');
  const [urlContent, setUrlContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title || 'Untitled Deck');

      if (mode === 'file' && file) {
        formData.append('file', file);
      } else if (mode === 'text' && textContent) {
        formData.append('text', textContent);
      } else if (mode === 'url' && urlContent) {
        formData.append('url', urlContent);
      } else {
        setError('Please provide content to upload.');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/upload', { method: 'POST', body: formData });
      const result = await response.json();

      if (!result.success) {
        setError(result.error);
        toast.error(result.error);
        setLoading(false);
        return;
      }

      toast.success('Deck created successfully!');
      router.push(`/decks/${result.data.deckId}`);
    } catch {
      setError('Something went wrong. Please try again.');
      toast.error('Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const tabs: { key: UploadMode; label: string }[] = [
    { key: 'file', label: 'Upload File' },
    { key: 'text', label: 'Paste Text' },
    { key: 'url', label: 'From URL' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Deck title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="e.g. Biology Chapter 5"
        />
      </div>

      {/* Mode tabs */}
      <div className="flex gap-1 border border-border rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setMode(tab.key)}
            className={`flex-1 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
              mode === tab.key
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* File upload */}
      {mode === 'file' && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-4 sm:p-6 lg:p-8 text-center transition-colors cursor-pointer ${
            dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
          }`}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <input
            id="file-input"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.gif,.webp"
            onChange={handleFileChange}
            className="hidden"
          />
          {file ? (
            <div>
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          ) : (
            <div>
              <p className="font-medium">Drop your file here, or click to browse</p>
              <p className="text-sm text-muted-foreground mt-1">
                PDF, JPG, PNG, GIF, or WebP (max 10MB)
              </p>
            </div>
          )}
        </div>
      )}

      {/* Text input */}
      {mode === 'text' && (
        <textarea
          value={textContent}
          onChange={(e) => setTextContent(e.target.value)}
          rows={5}
          className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-y"
          placeholder="Paste your study notes here..."
        />
      )}

      {/* URL input */}
      {mode === 'url' && (
        <input
          type="url"
          value={urlContent}
          onChange={(e) => setUrlContent(e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="https://example.com/article"
        />
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Upload & Create Deck'}
      </button>
    </form>
  );
}
