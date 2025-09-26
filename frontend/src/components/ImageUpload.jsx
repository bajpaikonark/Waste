import { useState, useRef } from 'react';
import axios from 'axios';

const ImageUpload = ({ onImageUpload, currentImage }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', file);

      const token = localStorage.getItem('token');

      const response = await axios.post(
        '${process.env.REACT_APP_API_URL}/api/reports/admin/stats/api/upload/image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      console.log('Upload success:', response.data);

      if (response.data.success) {
        onImageUpload(response.data.imageUrl);
      }
    } catch (error) {
      console.error(
        'Upload error:',
        error.response ? error.response.data : error.message
      );
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />

      <div className="flex items-center space-x-4">
        <button
          type="button"
          onClick={triggerFileInput}
          disabled={uploading}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
        >
          {uploading ? 'Uploading...' : 'Select Image'}
        </button>

        {currentImage && (
          <span className="text-sm text-green-600">✓ Image uploaded</span>
        )}
      </div>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      {currentImage && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
          <img
            src={currentImage}
            alt="Uploaded waste"
            className="w-full h-48 object-cover rounded-lg border"
          />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
