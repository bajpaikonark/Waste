
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import 'ol/ol.css';
import { Style, Icon } from 'ol/style';

// Custom waste marker icon
const wasteIcon = new Icon({
  src: 'https://cdn-icons-png.flaticon.com/512/484/484167.png',
  scale: 0.8,
  anchor: [0.5, 1],
});

// Camera Capture Component with Geo-tagging
const CameraCapture = ({ onCapture, onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState('');
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState('');

  useEffect(() => {
    startCamera();
    getCurrentLocation();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }, 
        audio: false 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError('Unable to access camera: ' + err.message);
      console.error('Camera error:', err);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        };
        setLocation(newLocation);
      },
      (error) => {
        setLocationError(`Unable to get location: ${error.message}`);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000
      }
    );
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw current video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert to data URL
      const imageDataUrl = canvas.toDataURL('image/jpeg');
      
      // Pass both image and location data
      onCapture({
        imageDataUrl,
        location
      });
      
      stopCamera();
      onClose();
    }
  };

  const switchCamera = async () => {
    stopCamera();
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' }, 
        audio: false 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError('Unable to switch camera: ' + err.message);
    }
  };

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-sm">
          <h3 className="text-lg font-semibold mb-4">Camera Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={onClose}
            className="w-full py-2 bg-green-600 text-white rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg max-w-md w-full">
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-64 object-cover rounded-lg"
          />
          <canvas ref={canvasRef} className="hidden" />
          
          {/* Location status indicator */}
          <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
            {location ? (
              <span>📍 Location captured</span>
            ) : locationError ? (
              <span>❌ {locationError}</span>
            ) : (
              <span>🔄 Acquiring location...</span>
            )}
          </div>
          
          <div className="flex justify-center mt-4 space-x-4">
            <button
              onClick={switchCamera}
              className="p-3 bg-gray-600 text-white rounded-full"
              title="Switch camera"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            
            <button
              onClick={capturePhoto}
              className="p-4 bg-white border-4 border-green-500 rounded-full"
              title="Take photo"
            >
              <div className="w-8 h-8 bg-green-500 rounded-full"></div>
            </button>
            
            <button
              onClick={onClose}
              className="p-3 bg-red-600 text-white rounded-full"
              title="Cancel"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReportWaste = ({ onSuccess, onClose }) => {
  const [description, setDescription] = useState('');
  const [landmark, setLandmark] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const { currentUser } = useAuth();

  const handleCameraCapture = async (captureData) => {
    const { imageDataUrl, location: capturedLocation } = captureData;
    
    // Convert data URL to blob
    const response = await fetch(imageDataUrl);
    const blob = await response.blob();
    
    // Create form data for upload
    const formData = new FormData();
    formData.append('image', blob, 'camera-capture.jpg');
    
    try {
      const token = localStorage.getItem('token');
      const uploadResponse = await fetch('http://localhost:8000/api/upload/image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      
      const uploadData = await uploadResponse.json();
      
      if (uploadResponse.ok && uploadData.success) {
        setImageUrl(uploadData.imageUrl);
        
        // Set location if available
        if (capturedLocation) {
          setLocation(capturedLocation);
          
          // Try to get address from coordinates
          try {
            const addr = await getAddressFromCoordinates(
              capturedLocation.latitude, 
              capturedLocation.longitude
            );
            setAddress(addr);
          } catch (err) {
            console.error('Error getting address:', err);
          }
        }
      } else {
        setError('Failed to upload captured image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError('Failed to upload captured image');
    }
  };

  const getAddressFromCoordinates = async (lat, lng) => {
  try {
    const response = await fetch(
      `http://localhost:8000/api/reverse-geocode?lat=${lat}&lon=${lng}`
    );
    const data = await response.json();
    
    if (data && data.display_name) {
      return data.display_name;
    }
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  } catch {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!imageUrl) {
      setError('Please capture an image of the waste');
      return;
    }
    
    if (!location) {
      setError('Location is required. Please enable location services and try again.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:8000/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          imageUrl,
          location,
          description,
          landmark,
          address: address || await getAddressFromCoordinates(location.latitude, location.longitude)
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Waste report submitted successfully! You earned 20 points.');
        setTimeout(() => {
          setDescription('');
          setLandmark('');
          setImageUrl('');
          setLocation(null);
          setAddress('');
          if (onSuccess) onSuccess();
        }, 2000);
      } else {
        setError(data.message || 'Failed to submit report');
      }
    } catch (error) {
      setError('Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Report Waste Issue</h2>
              <p className="text-green-100 mt-2">Capture, describe, and submit in one step</p>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="text-white hover:text-green-200 transition-colors"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0114 0z" />
              </svg>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Camera Capture Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">1. Capture Waste Photo</h3>
              {!imageUrl ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 mb-4">Capture a photo of the waste with your camera</p>
                  <button
                    type="button"
                    onClick={() => setShowCamera(true)}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center mx-auto"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Open Camera
                  </button>
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-800">Photo Captured</h4>
                    <button
                      type="button"
                      onClick={() => {
                        setImageUrl('');
                        setLocation(null);
                        setAddress('');
                      }}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Retake Photo
                    </button>
                  </div>
                  <div className="flex flex-col md:flex-row gap-4">
                    <img 
                      src={imageUrl} 
                      alt="Waste preview" 
                      className="w-full md:w-1/2 h-48 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-700 mb-2">Location Data</h5>
                      {location ? (
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>📍 Latitude: {location.latitude.toFixed(6)}</p>
                          <p>📍 Longitude: {location.longitude.toFixed(6)}</p>
                          {address && <p>🏠 Address: {address}</p>}
                          <p className="text-xs text-green-600 mt-2">
                            ✓ Geo-tagged automatically from your camera
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-red-600">
                          ❌ Location not available. Please enable location services.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Landmark Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                2. Nearby Landmark (optional)
              </label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Near Central Park fountain, Behind City Mall, etc."
              />
              <p className="text-xs text-gray-500 mt-1">
                Help others find the exact location with a recognizable landmark
              </p>
            </div>

            {/* Description Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                3. Waste Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Describe the type of waste, quantity, any immediate hazards..."
                required
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting || !imageUrl || !location}
                className="w-full py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center text-lg font-semibold"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  '🚀 Submit Report & Earn 20 Points'
                )}
              </button>
              <p className="text-xs text-gray-500 mt-2 text-center">
                By submitting, you help create a cleaner environment and earn reward points
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Camera Modal */}
      {showCamera && (
        <CameraCapture 
          onCapture={handleCameraCapture} 
          onClose={() => setShowCamera(false)} 
        />
      )}
    </div>
  );
};

export default ReportWaste;