import { FileUpload } from '@/components/upload/file-upload';

export default function NewDeckPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Create New Deck</h1>
        <p className="text-muted-foreground">
          Upload a PDF, paste your notes, or provide a URL to get started.
        </p>
      </div>
      <div className="border border-border rounded-lg p-6">
        <FileUpload />
      </div>
    </div>
  );
}
