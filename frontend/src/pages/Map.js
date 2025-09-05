import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom icons for different amenity types
const amenityIcons = {
  washroom: new L.Icon({
    iconUrl: '/icons/toilet.png',
    iconSize: [25, 25],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  }),
  medical: new L.Icon({
    iconUrl: '/icons/hospital.png',
    iconSize: [25, 25],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  }),
  food: new L.Icon({
    iconUrl: '/icons/food.png',
    iconSize: [25, 25],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  }),
  default: new L.Icon({
    iconUrl: '/icons/marker.png',
    iconSize: [25, 25],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  })
};

// Sample data - replace with your actual amenities data
const sampleAmenities = [
  { id: 1, name: "Main Washroom", type: "washroom", position: [26.513, 80.232] },
  { id: 2, name: "Medical Camp A", type: "medical", position: [26.515, 80.233] },
  { id: 3, name: "Food Stall 1", type: "food", position: [26.514, 80.231] },
  { id: 4, name: "Emergency Exit", type: "default", position: [26.512, 80.234] }
];

// Component to change map view when search is used
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

const Map = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // For a real implementation, you would set this to your fair's coordinates
  const fairLocation = [26.514, 80.232]; // Example coordinates
  
  // Filter amenities based on search and category
  const filteredAmenities = useMemo(() => {
    return sampleAmenities.filter(amenity => {
      const matchesSearch = amenity.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || amenity.type === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "1rem", backgroundColor: "#f8f9fa", borderBottom: "1px solid #dee2e6" }}>
        <h2>Mela Map</h2>
        
        {/* Search input */}
        <div className="search-container" style={{ marginBottom: "1rem" }}>
          <input
            type="text"
            placeholder="Search for amenities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: "0.5rem", width: "100%", maxWidth: "400px" }}
          />
        </div>
        
        {/* Category filter */}
        <div className="category-filter" style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <button 
            className={selectedCategory === "all" ? "active" : ""}
            onClick={() => setSelectedCategory("all")}
            style={{ padding: "0.5rem 1rem", backgroundColor: selectedCategory === "all" ? "#007bff" : "#6c757d", color: "white", border: "none", borderRadius: "4px" }}
          >
            All
          </button>
          <button 
            className={selectedCategory === "washroom" ? "active" : ""}
            onClick={() => setSelectedCategory("washroom")}
            style={{ padding: "0.5rem 1rem", backgroundColor: selectedCategory === "washroom" ? "#007bff" : "#6c757d", color: "white", border: "none", borderRadius: "4px" }}
          >
            Washrooms
          </button>
          <button 
            className={selectedCategory === "medical" ? "active" : ""}
            onClick={() => setSelectedCategory("medical")}
            style={{ padding: "0.5rem 1rem", backgroundColor: selectedCategory === "medical" ? "#007bff" : "#6c757d", color: "white", border: "none", borderRadius: "4px" }}
          >
            Medical
          </button>
          <button 
            className={selectedCategory === "food" ? "active" : ""}
            onClick={() => setSelectedCategory("food")}
            style={{ padding: "0.5rem 1rem", backgroundColor: selectedCategory === "food" ? "#007bff" : "#6c757d", color: "white", border: "none", borderRadius: "4px" }}
          >
            Food
          </button>
        </div>
      </div>
      
      {/* Map container */}
      <div style={{ flex: 1, position: "relative" }}>
        <MapContainer
          center={fairLocation}
          zoom={16}
          style={{ height: "100%", width: "100%" }}
        >
          <ChangeView center={fairLocation} zoom={16} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Render filtered amenities */}
          {filteredAmenities.map(amenity => (
            <Marker
              key={amenity.id}
              position={amenity.position}
              icon={amenityIcons[amenity.type] || amenityIcons.default}
            >
              <Popup>
                <div>
                  <h3>{amenity.name}</h3>
                  <p>Type: {amenity.type}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default Map;