/**
 * File Upload Hook
 * 
 * A reusable hook for handling file uploads in the CampusConnect application.
 * Currently stores files locally in the public/uploads folder.
 * Can be easily extended to support cloud storage (AWS S3, Firebase Storage, etc.) in the future.
 * 
 * Supports multiple upload types: assignment, profile, announcement, document, image, video, audio, etc.
 */

import { useState } from 'react';

/**
 * @typedef {Object} FileUploadOptions
 * @property {string} [type='document'] - Type of upload (assignment, profile, announcement, document, image, video, audio, etc.)
 * @property {number} [maxSizeInMB=10] - Maximum file size in megabytes
 * @property {string[]} [allowedTypes=['*']] - Array of allowed MIME types
 * @property {Function} [onSuccess] - Callback function called on successful upload with file URL
 * @property {Function} [onError] - Callback function called on error with error object
 */

/**
 * @typedef {Object} FileUploadReturn
 * @property {Function} uploadFile - Function to upload a file
 * @property {boolean} uploading - Whether a file is currently being uploaded
 * @property {string|null} error - Error message if upload failed
 * @property {number} progress - Upload progress (0-100)
 */

/**
 * Hook for uploading files to local storage or cloud storage
 * 
 * @param {FileUploadOptions} [options={}] - Configuration options for file upload
 * @returns {FileUploadReturn} Object with uploadFile function, uploading state, error, and progress
 * 
 * @example
 * // Upload an assignment
 * const { uploadFile, uploading, error } = useFileUpload({
 *   type: 'assignment',
 *   maxSizeInMB: 10,
 *   onSuccess: (url) => console.log('Uploaded:', url)
 * });
 * 
 * @example
 * // Upload a profile picture
 * const { uploadFile, uploading, error } = useFileUpload({
 *   type: 'profile',
 *   maxSizeInMB: 5,
 *   allowedTypes: ['image/jpeg', 'image/png', 'image/gif'],
 *   onSuccess: (url) => setProfileImage(url)
 * });
 * 
 * @example
 * // Upload any document
 * const { uploadFile, uploading, error } = useFileUpload({
 *   type: 'document',
 *   maxSizeInMB: 20,
 *   allowedTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
 * });
 */
export function useFileUpload(options = {}) {
  const {
    type = 'document',
    maxSizeInMB = 10,
    allowedTypes = ['*'],
    onSuccess,
    onError,
  } = options;

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  /**
   * Validates the file before upload
   * @param {File} file - The file to validate
   * @returns {string|null} Error message if validation fails, null if validation passes
   */
  const validateFile = (file) => {
    // Check file size
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      return `File size exceeds ${maxSizeInMB}MB limit`;
    }

    // Check file type if restrictions are set
    if (allowedTypes[0] !== '*') {
      const fileType = file.type;
      const isAllowed = allowedTypes.some(allowed => {
        if (allowed.includes('*')) {
          const category = allowed.split('/')[0];
          return fileType.startsWith(category);
        }
        return fileType === allowed;
      });

      if (!isAllowed) {
        return `File type ${fileType} is not allowed`;
      }
    }

    return null;
  };

  /**
   * Uploads a file to the server
   * @param {File} file - The file to upload
   * @returns {Promise<string>} Promise that resolves with the file URL
   */
  const uploadFile = async (file) => {
    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      // Validate file
      const validationError = validateFile(file);
      if (validationError) {
        throw new Error(validationError);
      }

      // Create FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      // Simulate progress (since we can't track actual upload progress easily)
      setProgress(30);

      // Upload file to API
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      setProgress(70);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      const data = await response.json();
      setProgress(100);

      // Call success callback if provided
      if (onSuccess) {
        onSuccess(data.fileUrl);
      }

      return data.fileUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      
      // Call error callback if provided
      if (onError && err instanceof Error) {
        onError(err);
      }

      throw err;
    } finally {
      setUploading(false);
      // Reset progress after a short delay
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return {
    uploadFile,
    uploading,
    error,
    progress,
  };
}

/**
 * Utility function to delete a file (for future cloud storage integration)
 * Currently does nothing as we don't delete local files
 * 
 * @param {string} fileUrl - The URL of the file to delete
 * @returns {Promise<void>}
 */
export async function deleteFile(fileUrl) {
  try {
    // For future cloud storage implementation
    // await fetch('/api/upload/delete', {
    //   method: 'DELETE',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ fileUrl }),
    // });
    
    console.log('Delete file:', fileUrl);
    // Currently no-op for local storage
  } catch (error) {
    console.error('Error deleting file:', error);
  }
}

/**
 * Utility function to get file URL
 * Handles both local and cloud storage URLs
 * 
 * @param {string} relativePath - The relative path or full URL of the file
 * @returns {string} The full URL of the file
 */
export function getFileUrl(relativePath) {
  // If it's already a full URL, return as is
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    return relativePath;
  }

  // For local storage, construct the full URL
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  return `${baseUrl}${relativePath}`;
}

/**
 * Utility function to format file size
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size (e.g., "1.5 MB")
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Utility function to get file extension
 * @param {string} filename - The filename
 * @returns {string} File extension (e.g., "pdf", "jpg")
 */
export function getFileExtension(filename) {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
}

/**
 * Predefined file type configurations for common use cases
 */
export const FILE_UPLOAD_CONFIGS = {
  // Image uploads (profile pictures, photos, etc.)
  image: {
    type: 'image',
    maxSizeInMB: 5,
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  },
  
  // Document uploads (PDFs, Word docs, etc.)
  document: {
    type: 'document',
    maxSizeInMB: 10,
    allowedTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
    ],
  },
  
  // Assignment uploads (any file type)
  assignment: {
    type: 'assignment',
    maxSizeInMB: 20,
    allowedTypes: ['*'],
  },
  
  // Profile picture uploads
  profile: {
    type: 'profile',
    maxSizeInMB: 3,
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif'],
  },
  
  // Announcement attachments
  announcement: {
    type: 'announcement',
    maxSizeInMB: 15,
    allowedTypes: ['*'],
  },
  
  // Video uploads
  video: {
    type: 'video',
    maxSizeInMB: 100,
    allowedTypes: ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo'],
  },
  
  // Audio uploads
  audio: {
    type: 'audio',
    maxSizeInMB: 50,
    allowedTypes: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3'],
  },
};

// Default export for easier imports
export default useFileUpload;