// import { useState, useRef, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import ImageUpload from './ImageUpload';
// import 'ol/ol.css';
// import Map from 'ol/Map';
// import View from 'ol/View';
// import TileLayer from 'ol/layer/Tile';
// import OSM from 'ol/source/OSM';
// import XYZ from 'ol/source/XYZ';
// import VectorLayer from 'ol/layer/Vector';
// import VectorSource from 'ol/source/Vector';
// import Feature from 'ol/Feature';
// import Point from 'ol/geom/Point';
// import { fromLonLat, toLonLat } from 'ol/proj';
// import { Style, Icon } from 'ol/style';
// import { defaults as defaultControls } from 'ol/control';
// import Zoom from 'ol/control/Zoom';
// import ScaleLine from 'ol/control/ScaleLine';

// // Custom waste marker icon
// const wasteIcon = new Icon({
//   src: 'https://cdn-icons-png.flaticon.com/512/484/484167.png',
//   scale: 0.8,
//   anchor: [0.5, 1],
// });

// // Camera Capture Component
// const CameraCapture = ({ onCapture, onClose }) => {
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const [stream, setStream] = useState(null);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     startCamera();
//     return () => stopCamera();
//   }, []);

//   const startCamera = async () => {
//     try {
//       const mediaStream = await navigator.mediaDevices.getUserMedia({ 
//         video: { facingMode: 'environment' }, 
//         audio: false 
//       });
//       setStream(mediaStream);
//       if (videoRef.current) {
//         videoRef.current.srcObject = mediaStream;
//       }
//     } catch (err) {
//       setError('Unable to access camera: ' + err.message);
//       console.error('Camera error:', err);
//     }
//   };

//   const stopCamera = () => {
//     if (stream) {
//       stream.getTracks().forEach(track => track.stop());
//     }
//   };

//   const capturePhoto = () => {
//     if (videoRef.current && canvasRef.current) {
//       const video = videoRef.current;
//       const canvas = canvasRef.current;
//       const context = canvas.getContext('2d');
      
//       // Set canvas dimensions to match video
//       canvas.width = video.videoWidth;
//       canvas.height = video.videoHeight;
      
//       // Draw current video frame to canvas
//       context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
//       // Convert to data URL
//       const imageDataUrl = canvas.toDataURL('image/jpeg');
//       onCapture(imageDataUrl);
//       stopCamera();
//       onClose();
//     }
//   };

//   const switchCamera = async () => {
//     stopCamera();
//     try {
//       const mediaStream = await navigator.mediaDevices.getUserMedia({ 
//         video: { facingMode: 'user' }, 
//         audio: false 
//       });
//       setStream(mediaStream);
//       if (videoRef.current) {
//         videoRef.current.srcObject = mediaStream;
//       }
//     } catch (err) {
//       setError('Unable to switch camera: ' + err.message);
//     }
//   };

//   if (error) {
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
//         <div className="bg-white p-6 rounded-lg max-w-sm">
//           <h3 className="text-lg font-semibold mb-4">Camera Error</h3>
//           <p className="text-gray-600 mb-4">{error}</p>
//           <button 
//             onClick={onClose}
//             className="w-full py-2 bg-green-600 text-white rounded-md"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
//       <div className="bg-white p-4 rounded-lg max-w-md w-full">
//         <div className="relative">
//           <video
//             ref={videoRef}
//             autoPlay
//             playsInline
//             className="w-full h-64 object-cover rounded-lg"
//           />
//           <canvas ref={canvasRef} className="hidden" />
          
//           <div className="flex justify-center mt-4 space-x-4">
//             <button
//               onClick={switchCamera}
//               className="p-3 bg-gray-600 text-white rounded-full"
//               title="Switch camera"
//             >
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
//               </svg>
//             </button>
            
//             <button
//               onClick={capturePhoto}
//               className="p-4 bg-white border-4 border-green-500 rounded-full"
//               title="Take photo"
//             >
//               <div className="w-8 h-8 bg-green-500 rounded-full"></div>
//             </button>
            
//             <button
//               onClick={onClose}
//               className="p-3 bg-red-600 text-white rounded-full"
//               title="Cancel"
//             >
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Custom Search Bar Component
// const CustomSearchBar = ({ onLocationSelect, onSearch, currentLocation }) => {
//   const [query, setQuery] = useState('');
//   const [suggestions, setSuggestions] = useState([]);
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [isSearching, setIsSearching] = useState(false);
//   const inputRef = useRef(null);
//   const suggestionsRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (inputRef.current && !inputRef.current.contains(event.target) &&
//           suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
//         setShowSuggestions(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   useEffect(() => {
//     if (currentLocation && currentLocation.address) {
//       setQuery(currentLocation.address);
//     }
//   }, [currentLocation]);

//   const handleSearch = async (searchQuery) => {
//     if (!searchQuery.trim()) {
//       setSuggestions([]);
//       return;
//     }

//     setIsSearching(true);
//     try {
//       // Using Nominatim for search (OpenStreetMap)
//       const response = await fetch(
//         `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`
//       );
//       const results = await response.json();
//       setSuggestions(results);
//       setShowSuggestions(true);
//     } catch (error) {
//       console.error('Search error:', error);
//     } finally {
//       setIsSearching(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const value = e.target.value;
//     setQuery(value);
    
//     // Debounce the search
//     clearTimeout(inputRef.current.timeout);
//     inputRef.current.timeout = setTimeout(() => {
//       handleSearch(value);
//     }, 300);
//   };

//   const handleSuggestionClick = (result) => {
//     setQuery(result.display_name);
//     setShowSuggestions(false);
//     const locationData = {
//       latitude: parseFloat(result.lat),
//       longitude: parseFloat(result.lon),
//       accuracy: 10,
//       address: result.display_name
//     };
//     onLocationSelect(locationData);
//     onSearch(result.display_name);
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       e.preventDefault();
//       if (suggestions.length > 0) {
//         handleSuggestionClick(suggestions[0]);
//       }
//     }
//   };

//   return (
//     <div className="relative w-full mb-4">
//       <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm" ref={inputRef}>
//         <div className="pl-3 pr-2 text-gray-400">
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//           </svg>
//         </div>
//         <input
//           type="text"
//           value={query}
//           onChange={handleInputChange}
//           onFocus={() => setShowSuggestions(true)}
//           onKeyPress={handleKeyPress}
//           placeholder="Search for a location or address..."
//           className="w-full py-3 px-2 outline-none"
//         />
//         {isSearching && (
//           <div className="pr-3">
//             <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
//           </div>
//         )}
//         {query && !isSearching && (
//           <button
//             onClick={() => {
//               setQuery('');
//               setSuggestions([]);
//             }}
//             className="pr-3 text-gray-400 hover:text-gray-600"
//           >
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         )}
//       </div>
      
//       {showSuggestions && suggestions.length > 0 && (
//         <div 
//           ref={suggestionsRef}
//           className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
//         >
//           {suggestions.map((result, index) => (
//             <div
//               key={index}
//               className="px-4 py-3 cursor-pointer hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
//               onClick={() => handleSuggestionClick(result)}
//             >
//               <div className="font-medium text-gray-800">{result.display_name.split(',')[0]}</div>
//               <div className="text-sm text-gray-600">{result.display_name.split(',').slice(1).join(',').trim()}</div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// // OpenLayers Map Component
// const OLMap = ({ onLocationSelect, initialCenter, initialZoom, selectedLocation }) => {
//   const mapRef = useRef();
//   const [map, setMap] = useState(null);
//   const [vectorSource, setVectorSource] = useState(null);

//   useEffect(() => {
//     if (!mapRef.current) return;

//     // Initialize the vector source for the marker
//     const source = new VectorSource();
//     const vectorLayer = new VectorLayer({
//       source: source,
//     });

//     // Initialize the map
//     const initialMap = new Map({
//       target: mapRef.current,
//       layers: [
//         // Satellite layer (using Esri World Imagery)
//         new TileLayer({
//           source: new XYZ({
//             url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
//             attributions: 'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer">Esri</a>'
//           })
//         }),
//         // Optional: Add OSM layer for labels (semi-transparent)
//         new TileLayer({
//           source: new OSM(),
//           opacity: 0.3,
//         }),
//         vectorLayer
//       ],
//       view: new View({
//         center: fromLonLat(initialCenter),
//         zoom: initialZoom,
//       }),
//       controls: defaultControls().extend([
//         new Zoom(),
//         new ScaleLine()
//       ])
//     });

//     // Add click event to the map
//     initialMap.on('click', (event) => {
//       const coordinate = event.coordinate;
//       const lonLat = toLonLat(coordinate);
      
//       // Remove existing features
//       source.clear();
      
//       // Create a new feature
//       const feature = new Feature({
//         geometry: new Point(coordinate)
//       });
      
//       feature.setStyle(new Style({
//         image: wasteIcon
//       }));
      
//       source.addFeature(feature);
      
//       // Update the location state
//       const newLocation = {
//         latitude: lonLat[1],
//         longitude: lonLat[0],
//         accuracy: 10
//       };
      
//       onLocationSelect(newLocation);
//     });

//     setMap(initialMap);
//     setVectorSource(source);

//     // Clean up on unmount
//     return () => {
//       if (initialMap) {
//         initialMap.setTarget(undefined);
//       }
//     };
//   }, []);

//   // Update marker when selectedLocation changes
//   useEffect(() => {
//     if (map && vectorSource && selectedLocation) {
//       vectorSource.clear();
      
//       const coordinate = fromLonLat([selectedLocation.longitude, selectedLocation.latitude]);
//       const feature = new Feature({
//         geometry: new Point(coordinate)
//       });
      
//       feature.setStyle(new Style({
//         image: wasteIcon
//       }));
      
//       vectorSource.addFeature(feature);
      
//       // Center map on the selected location
//       map.getView().animate({
//         center: coordinate,
//         zoom: 16,
//         duration: 1000
//       });
//     }
//   }, [selectedLocation, map, vectorSource]);

//   return (
//     <div ref={mapRef} className="w-full h-full" />
//   );
// };

// const ReportWaste = ({ onSuccess, onClose }) => {
//   const [description, setDescription] = useState('');
//   const [imageUrl, setImageUrl] = useState('');
//   const [location, setLocation] = useState(null);
//   const [mapPosition, setMapPosition] = useState([78.9629, 20.5937]); // [longitude, latitude]
//   const [zoomLevel, setZoomLevel] = useState(5);
//   const [gettingLocation, setGettingLocation] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [currentStep, setCurrentStep] = useState(1);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [showCamera, setShowCamera] = useState(false);
//   const { currentUser } = useAuth();

//   const steps = [
//     { number: 1, title: 'Take Photo', description: 'Capture the waste situation' },
//     { number: 2, title: 'Pin Location', description: 'Select exact location on map' },
//     { number: 3, title: 'Add Details', description: 'Describe the waste issue' },
//   ];

//   // Function to handle map location selection
//   const handleLocationSelect = (selectedLocation) => {
//     setLocation(selectedLocation);
//     setMapPosition([selectedLocation.longitude, selectedLocation.latitude]);
//     setZoomLevel(16);
    
//     // Reverse geocode to get address
//     getAddressFromCoordinates(selectedLocation.latitude, selectedLocation.longitude)
//       .then(address => setSearchQuery(address));
//   };

//   // Function to get current location
//   const getCurrentLocation = () => {
//     if (!navigator.geolocation) {
//       setError('Geolocation is not supported by your browser');
//       return;
//     }

//     setGettingLocation(true);
//     setError('');

//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const newLocation = {
//           latitude: position.coords.latitude,
//           longitude: position.coords.longitude,
//           accuracy: position.coords.accuracy
//         };
        
//         setLocation(newLocation);
//         setMapPosition([newLocation.longitude, newLocation.latitude]);
//         setZoomLevel(16);
//         setGettingLocation(false);
//         setCurrentStep(2);
        
//         // Reverse geocode to get address
//         getAddressFromCoordinates(newLocation.latitude, newLocation.longitude)
//           .then(address => setSearchQuery(address));
//       },
//       (error) => {
//         setGettingLocation(false);
//         setError(`Unable to get location: ${error.message}`);
//       },
//       {
//         enableHighAccuracy: true,
//         timeout: 15000,
//         maximumAge: 60000
//       }
//     );
//   };

//   const handleSearchSelect = (query) => {
//     setSearchQuery(query);
//   };

//   const handleImageUpload = (url) => {
//     setImageUrl(url);
//     setCurrentStep(2);
//   };

//   const handleCameraCapture = async (dataUrl) => {
//     // Convert data URL to blob
//     const response = await fetch(dataUrl);
//     const blob = await response.blob();
    
//     // Create form data for upload
//     const formData = new FormData();
//     formData.append('image', blob, 'camera-capture.jpg');
    
//     try {
//       const token = localStorage.getItem('token');
//       const uploadResponse = await fetch('http://localhost:8000/api/upload/image', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//         body: formData,
//       });
      
//       const uploadData = await uploadResponse.json();
      
//       if (uploadResponse.ok && uploadData.success) {
//         setImageUrl(uploadData.imageUrl);
//         setCurrentStep(2);
//       } else {
//         setError('Failed to upload captured image');
//       }
//     } catch (error) {
//       console.error('Upload error:', error);
//       setError('Failed to upload captured image');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!imageUrl) {
//       setError('Please upload an image of the waste');
//       setCurrentStep(1);
//       return;
//     }
    
//     if (!location) {
//       setError('Please select a location on the map');
//       setCurrentStep(2);
//       return;
//     }

//     setSubmitting(true);
//     setError('');

//     try {
//       const token = localStorage.getItem('token');
//       const address = await getAddressFromCoordinates(location.latitude, location.longitude);
      
//       const response = await fetch('http://localhost:8000/api/reports', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           imageUrl,
//           location,
//           description,
//           address
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setSuccess('Waste report submitted successfully! You earned 20 points.');
//         setTimeout(() => {
//           setDescription('');
//           setImageUrl('');
//           setLocation(null);
//           setSearchQuery('');
//           setCurrentStep(1);
//           if (onSuccess) onSuccess();
//         }, 2000);
//       } else {
//         setError(data.message || 'Failed to submit report');
//       }
//     } catch (error) {
//       setError('Failed to submit report. Please try again.');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const getAddressFromCoordinates = async (lat, lng) => {
//     try {
//       const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
//       const data = await response.json();
      
//       if (data && data.display_name) {
//         return data.display_name;
//       }
//       return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
//     } catch {
//       return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">
//       <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <h2 className="text-3xl font-bold">Report Waste Issue</h2>
//               <p className="text-green-100 mt-2">Help keep our environment clean and earn rewards</p>
//             </div>
//             {onClose && (
//               <button
//                 onClick={onClose}
//                 className="text-white hover:text-green-200 transition-colors"
//               >
//                 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Progress Steps */}
//         <div className="px-6 py-4 bg-white border-b">
//           <div className="flex justify-between items-center">
//             {steps.map((step, index) => (
//               <div key={step.number} className="flex items-center">
//                 <div className={`flex flex-col items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}>
//                   <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-semibold ${
//                     currentStep === step.number
//                       ? 'bg-green-600 border-green-600 text-white'
//                       : currentStep > step.number
//                       ? 'bg-green-500 border-green-500 text-white'
//                       : 'border-gray-300 text-gray-400'
//                   }`}>
//                     {currentStep > step.number ? (
//                       <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//                         <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                       </svg>
//                     ) : (
//                       step.number
//                     )}
//                   </div>
//                   <span className={`text-xs mt-2 font-medium ${
//                     currentStep >= step.number ? 'text-green-600' : 'text-gray-400'
//                   }`}>
//                     {step.title}
//                   </span>
//                 </div>
//                 {index < steps.length - 1 && (
//                   <div className={`flex-1 h-1 mx-2 ${
//                     currentStep > step.number ? 'bg-green-500' : 'bg-gray-200'
//                   }`} />
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="p-6">
//           {error && (
//             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
//               <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               {error}
//             </div>
//           )}

//           {success && (
//             <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center">
//               <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               {success}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Step 1: Image Upload */}
//             {currentStep === 1 && (
//               <div className="space-y-4">
//                 <div className="text-center">
//                   <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
//                     </svg>
//                   </div>
//                   <h3 className="text-xl font-semibold text-gray-800">Capture the Waste</h3>
//                   <p className="text-gray-600 mt-2">Take a clear photo of the waste situation</p>
//                 </div>
                
//                 <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
//                   <button
//                     type="button"
//                     onClick={() => setShowCamera(true)}
//                     className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
//                   >
//                     <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
//                     </svg>
//                     Use Camera
//                   </button>
//                 </div>
                
//                 <ImageUpload 
//                   onImageUpload={handleImageUpload} 
//                   currentImage={imageUrl} 
//                 />

//                 <div className="flex justify-center">
//                   <button
//                     type="button"
//                     onClick={() => setCurrentStep(2)}
//                     disabled={!imageUrl}
//                     className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
//                   >
//                     Next: Pin Location →
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* Step 2: Map Location */}
//             {currentStep === 2 && (
//               <div className="space-y-4">
//                 <div className="text-center">
//                   <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                     </svg>
//                   </div>
//                   <h3 className="text-xl font-semibold text-gray-800">Pin the Exact Location</h3>
//                   <p className="text-gray-600 mt-2">Search for a location or click on the map to mark the waste location</p>
//                 </div>

//                 {/* Search Bar */}
//                 <CustomSearchBar 
//                   onLocationSelect={handleLocationSelect}
//                   onSearch={handleSearchSelect}
//                   currentLocation={location}
//                 />

//                 <div className="h-96 rounded-lg overflow-hidden border-2 border-gray-200 relative">
//                   <OLMap 
//                     onLocationSelect={handleLocationSelect}
//                     initialCenter={mapPosition}
//                     initialZoom={zoomLevel}
//                     selectedLocation={location}
//                   />
                  
//                   <div className="absolute top-4 right-4 z-[400] bg-white p-2 rounded-lg shadow-md">
//                     <button
//                       type="button"
//                       onClick={getCurrentLocation}
//                       disabled={gettingLocation}
//                       className="flex items-center text-sm text-gray-700 hover:text-gray-900"
//                       title="Use current location"
//                     >
//                       {gettingLocation ? (
//                         <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600 mr-1"></div>
//                       ) : (
//                         <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                         </svg>
//                       )}
//                       {gettingLocation ? 'Locating...' : 'My Location'}
//                     </button>
//                   </div>
//                 </div>

//                 <div className="flex flex-col sm:flex-row gap-4 justify-center">
//                   <button
//                     type="button"
//                     onClick={() => setCurrentStep(1)}
//                     className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
//                   >
//                     ← Back to Photo
//                   </button>

//                   <button
//                     type="button"
//                     onClick={() => setCurrentStep(3)}
//                     disabled={!location}
//                     className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
//                   >
//                     Next: Add Details →
//                   </button>
//                 </div>

//                 {location && (
//                   <div className="bg-green-50 p-4 rounded-lg">
//                     <h4 className="font-semibold text-green-800">📍 Selected Location</h4>
//                     <p className="text-sm text-green-600">{searchQuery || `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`}</p>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Step 3: Details */}
//             {currentStep === 3 && (
//               <div className="space-y-4">
//                 <div className="text-center">
//                   <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                     </svg>
//                   </div>
//                   <h3 className="text-xl font-semibold text-gray-800">Add Details</h3>
//                   <p className="text-gray-600 mt-2">Help us understand the waste situation better</p>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Waste Description (optional)
//                   </label>
//                   <textarea
//                     value={description}
//                     onChange={(e) => setDescription(e.target.value)}
//                     rows={4}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                     placeholder="Describe the type of waste, quantity, any immediate hazards..."
//                   />
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="bg-gray-50 p-4 rounded-lg">
//                     <h4 className="font-semibold text-gray-800 mb-2">📸 Photo Preview</h4>
//                     {imageUrl && (
//                       <img 
//                         src={imageUrl} 
//                         alt="Waste preview" 
//                         className="w-full h-32 object-cover rounded"
//                       />
//                     )}
//                   </div>

//                   <div className="bg-gray-50 p-4 rounded-lg">
//                     <h4 className="font-semibold text-gray-800 mb-2">📍 Location</h4>
//                     {location && (
//                       <p className="text-sm text-gray-600 break-words">
//                         {searchQuery || `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`}
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="flex flex-col sm:flex-row gap-4 justify-center">
//                   <button
//                     type="button"
//                     onClick={() => setCurrentStep(2)}
//                     className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
//                   >
//                     ← Back to Map
//                   </button>

//                   <button
//                     type="submit"
//                     disabled={submitting}
//                     className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 flex items-center justify-center"
//                   >
//                     {submitting ? (
//                       <>
//                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                         Submitting...
//                       </>
//                     ) : (
//                       '🚀 Submit Report & Earn 20 Points'
//                     )}
//                   </button>
//                 </div>
//               </div>
//             )}
//           </form>
//         </div>
//       </div>

//       {/* Camera Modal */}
//       {showCamera && (
//         <CameraCapture 
//           onCapture={handleCameraCapture} 
//           onClose={() => setShowCamera(false)} 
//         />
//       )}
//     </div>
//   );
// };

// export default ReportWaste;

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