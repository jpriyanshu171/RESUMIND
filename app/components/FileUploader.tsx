import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { formatSize } from '../lib/utils';

interface FileUploaderProps {
  onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0] || null;
      onFileSelect?.(file);
    },
    [onFileSelect]
  );

  const maxFileSize = 20 * 1024 * 1024; // 20MB

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    multiple: false,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: maxFileSize,
  });

  const file = acceptedFiles[0] || null;

  return (
    <div
      {...getRootProps()}
      className={`w-full cursor-pointer border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center transition-colors ${
        isDragActive ? 'border-amber-400 bg-amber-50' : 'border-gray-300 bg-white'
      }`}
    >
      <input {...getInputProps()} />

      {file ? (
        <div className="flex items-center justify-between w-full max-w-md bg-gray-50 rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <img src="/images/pdf.png" alt="pdf" className="w-10 h-10" />
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-700 truncate max-w-xs">{file.name}</p>
              <p className="text-xs text-gray-500">{formatSize(file.size)}</p>
            </div>
          </div>
          <button
            className="p-1 hover:bg-gray-200 rounded-full transition"
            onClick={(e) => {
              e.stopPropagation();
              onFileSelect?.(null);
            }}
          >
            <img src="/icons/cross.svg" alt="remove" className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="text-center">
          <div className="mx-auto w-16 h-16 flex items-center justify-center mb-2">
            <img src="/icons/info.svg" alt="upload" className="w-16 h-16" />
          </div>
          <p className="text-base text-gray-600">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-sm text-gray-400 mt-1">PDF only (max {formatSize(maxFileSize)})</p>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
