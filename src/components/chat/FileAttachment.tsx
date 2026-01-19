import { useState } from "react";
import { Download, File, FileText, X, ZoomIn } from "lucide-react";

interface FileAttachmentProps {
  fileUrl: string;
}

const getFileExtension = (url: string): string => {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const ext = pathname.split('.').pop()?.toLowerCase() || '';
    return ext;
  } catch {
    return '';
  }
};

const getFileType = (url: string): 'image' | 'video' | 'audio' | 'pdf' | 'document' | 'other' => {
  const ext = getFileExtension(url);
  
  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico'];
  const videoExts = ['mp4', 'webm', 'mov', 'avi', 'mkv', 'flv'];
  const audioExts = ['mp3', 'wav', 'ogg', 'flac', 'm4a', 'aac'];
  const documentExts = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf'];
  
  if (imageExts.includes(ext)) return 'image';
  if (videoExts.includes(ext)) return 'video';
  if (audioExts.includes(ext)) return 'audio';
  if (ext === 'pdf') return 'pdf';
  if (documentExts.includes(ext)) return 'document';
  
  return 'other';
};

const getFileName = (url: string): string => {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const fileName = pathname.split('/').pop() || 'file';
    return decodeURIComponent(fileName);
  } catch {
    return 'file';
  }
};

export const FileAttachment = ({ fileUrl }: FileAttachmentProps) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const fileType = getFileType(fileUrl);
  const fileName = getFileName(fileUrl);
  const ext = getFileExtension(fileUrl).toUpperCase();

  // Render images with lightbox
  if (fileType === 'image') {
    return (
      <>
        <div className="relative mt-2 group max-w-md">
          <img
            src={fileUrl}
            alt={fileName}
            className="rounded-lg border border-[#2e3035] hover:opacity-90 transition-opacity cursor-pointer max-h-96 object-contain"
            onClick={() => setLightboxOpen(true)}
          />
          <div 
            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center cursor-pointer"
            onClick={() => setLightboxOpen(true)}
          >
            <div className="bg-[#2b2d31]/90 px-3 py-2 rounded-lg flex items-center gap-2">
              <ZoomIn size={16} className="text-white" />
              <span className="text-sm text-white font-medium">View Full Size</span>
            </div>
          </div>
        </div>

        {/* Lightbox Modal */}
        {lightboxOpen && (
          <div 
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              className="absolute top-4 right-4 p-2 bg-[#2b2d31] hover:bg-[#35373c] rounded-lg transition-colors"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close lightbox"
            >
              <X size={24} className="text-white" />
            </button>
            <img
              src={fileUrl}
              alt={fileName}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-[#2b2d31]/95 px-4 py-2 rounded-lg">
              <p className="text-sm text-white font-medium">{fileName}</p>
            </div>
          </div>
        )}
      </>
    );
  }

  // Render videos with controls
  if (fileType === 'video') {
    return (
      <div className="mt-2 max-w-md">
        <video
          src={fileUrl}
          controls
          className="w-full rounded-lg border border-[#2e3035] bg-black"
        >
          Your browser does not support the video tag.
        </video>
        <p className="text-xs text-[#949ba4] mt-1">{fileName}</p>
      </div>
    );
  }

  // Render audio player
  if (fileType === 'audio') {
    return (
      <div className="mt-2 max-w-md">
        <div className="bg-[#2b2d31] border border-[#3e4046] rounded-lg p-3">
          <p className="text-sm text-[#dbdee1] font-medium mb-2">{fileName}</p>
          <audio src={fileUrl} controls className="w-full">
            Your browser does not support the audio tag.
          </audio>
        </div>
      </div>
    );
  }

  // For other files, show a download card
  const getIcon = () => {
    switch (fileType) {
      case 'pdf':
        return <FileText size={32} className="text-[#da373c]" />;
      case 'document':
        return <FileText size={32} className="text-[#5865f2]" />;
      default:
        return <File size={32} className="text-[#b5bac1]" />;
    }
  };

  return (
    <a
      href={fileUrl}
      download
      target="_blank"
      rel="noopener noreferrer"
      className="mt-2 flex items-center gap-3 p-3 bg-[#2b2d31] hover:bg-[#35373c] border border-[#3e4046] rounded-lg max-w-md transition-all duration-200 group cursor-pointer hover:border-[#5865f2]/50"
    >
      <div className="flex-shrink-0">{getIcon()}</div>
      <div className="flex-1 min-w-0">
        <p className="text-[#00b0f4] font-medium truncate group-hover:underline">
          {fileName}
        </p>
        <p className="text-xs text-[#949ba4] mt-0.5">
          {ext} File
        </p>
      </div>
      <div className="flex-shrink-0">
        <div className="p-2 bg-[#1e1f22] group-hover:bg-[#5865f2] rounded-lg transition-colors">
          <Download size={16} className="text-[#b5bac1] group-hover:text-white transition-colors" />
        </div>
      </div>
    </a>
  );
};
