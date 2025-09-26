import React, { useState, useMemo, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons using SVG-based markers
const createCustomIcon = (iconName, color = '#007bff') => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color}; 
        width: 32px; 
        height: 32px; 
        border-radius: 50%; 
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex; 
        justify-content: center; 
        align-items: center;
        font-weight: bold;
        color: white;
        font-size: 14px;
      ">${iconName.charAt(0)}</div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -35]
  });
};

const amenityIcons = {
  washroom: createCustomIcon('W', '#6f42c1'),
  medical: createCustomIcon('M', '#dc3545'),
  food: createCustomIcon('F', '#fd7e14'),
  default: createCustomIcon('P', '#007bff'),
  entrance: createCustomIcon('E', '#28a745'),
  parking: createCustomIcon('P', '#6c757d'),
  stage: createCustomIcon('S', '#ffc107'),
};

// IITK-specific amenities data with more details
const iitkAmenities = [
  { id: 1, name: "Main Washroom", type: "washroom", position: [26.5125, 80.2325], description: "Near the main entrance" },
  { id: 2, name: "Medical Center", type: "medical", position: [26.5135, 80.2335], description: "Emergency services available" },
  { id: 3, name: "Food Court 1", type: "food", position: [26.5128, 80.2318], description: "Variety of cuisines" },
  { id: 4, name: "Main Entrance", type: "entrance", position: [26.5118, 80.2338], description: "Gate no. 1" },
  { id: 5, name: "Parking Area A", type: "parking", position: [26.5138, 80.2305], description: "Capacity: 200 vehicles" },
  { id: 6, name: "Main Stage", type: "stage", position: [26.5132, 80.2342], description: "Cultural events venue" },
  { id: 7, name: "First Aid Station", type: "medical", position: [26.5122, 80.2328], description: "Basic medical assistance" },
  { id: 8, name: "Snack Bar", type: "food", position: [26.5130, 80.2310], description: "Quick bites and beverages" },
  { id: 9, name: "Parking Area B", type: "parking", position: [26.5140, 80.2298], description: "Capacity: 150 vehicles" },
  { id: 10, name: "Food Court 2", type: "food", position: [26.5135, 80.2320], description: "Traditional Indian food" },
];

// Simulated route data with turn-by-turn instructions
const generateRoute = (from, to) => {
  // This is a simplified simulation - in a real app you would use a routing API
  const waypoints = [
    from,
    [from[0] + 0.0005, from[1] - 0.0005],
    [to[0] - 0.0005, to[1] + 0.0005],
    to
  ];
  
  return {
    waypoints,
    distance: "450m",
    time: "5-7 min",
    steps: [
      "Head northeast from your starting point",
      "Turn right at the first intersection",
      "Continue straight for about 200m",
      "Turn left at the food court",
      "Your destination will be on the right"
    ]
  };
};

// Component to change map view
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

// Component to handle routing
function Routing({ route, map }) {
  useEffect(() => {
    if (!route || !map) return;
    
    // Clear any existing routing lines
    map.eachLayer(layer => {
      if (layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });
    
    // Draw the route
    const routeLine = L.polyline(route.waypoints, {
      color: '#3388ff',
      weight: 5,
      opacity: 0.8,
      lineJoin: 'round'
    }).addTo(map);
    
    // Add direction markers
    route.waypoints.forEach((point, index) => {
      if (index === 0 || index === route.waypoints.length - 1) return; // Skip start and end
      
      L.marker(point, {
        icon: L.divIcon({
          className: 'direction-marker',
          html: `<div style="background-color: #ffc107; width: 24px; height: 24px; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: black; font-weight: bold;">${index}</div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        })
      }).addTo(map);
    });
    
    // Add start marker
    L.marker(route.waypoints[0], {
      icon: L.divIcon({
        className: 'route-marker',
        html: `<div style="background-color: #28a745; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      })
    }).addTo(map).bindPopup("Start: " + route.fromName);
    
    // Add end marker
    L.marker(route.waypoints[route.waypoints.length - 1], {
      icon: L.divIcon({
        className: 'route-marker',
        html: `<div style="background-color: #dc3545; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      })
    }).addTo(map).bindPopup("Destination: " + route.toName);
    
    // Fit map to show the entire route
    const bounds = L.latLngBounds(route.waypoints);
    map.fitBounds(bounds, { padding: [50, 50] });
    
    return () => {
      map.removeLayer(routeLine);
    };
  }, [route, map]);
  
  return null;
}

const Map = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [currentRoute, setCurrentRoute] = useState(null);
  const [showDirections, setShowDirections] = useState(false);
  const mapRef = useRef();
  
  // IIT Kanpur coordinates
  const iitkLocation = [26.5123, 80.2329];
  
  // Filter amenities based on search and category
  const filteredAmenities = useMemo(() => {
    return iitkAmenities.filter(amenity => {
      const matchesSearch = amenity.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || amenity.type === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);
  
  // Handle getting directions
  const handleGetDirections = () => {
    if (!fromLocation || !toLocation) {
      alert("Please select both 'From' and 'To' locations");
      return;
    }
    
    // Find the selected locations
    const fromAmenity = iitkAmenities.find(a => a.name === fromLocation);
    const toAmenity = iitkAmenities.find(a => a.name === toLocation);
    
    if (fromAmenity && toAmenity) {
      const route = generateRoute(fromAmenity.position, toAmenity.position);
      setCurrentRoute({
        ...route,
        fromName: fromAmenity.name,
        toName: toAmenity.name
      });
      setShowDirections(true);
      
      // Zoom to the starting point
      if (mapRef.current) {
        mapRef.current.setView(fromAmenity.position, 18);
      }
    }
  };
  
  // Clear directions
  const clearDirections = () => {
    setCurrentRoute(null);
    setShowDirections(false);
    setFromLocation("");
    setToLocation("");
    
    // Clear any routing lines from the map
    if (mapRef.current) {
      mapRef.current.eachLayer(layer => {
        if (layer instanceof L.Polyline || layer instanceof L.Marker) {
          if (layer?.options?.className === 'direction-marker' || 
              layer?.options?.className === 'route-marker') {
            mapRef.current.removeLayer(layer);
          }
        }
      });
      
      // Reset view
      mapRef.current.setView(iitkLocation, 16);
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ 
        padding: "1.2rem", 
        backgroundColor: "#f8f9fa", 
        borderBottom: "1px solid #dee2e6",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{ margin: "0 0 1rem 0", color: "#2c3e50", display: "flex", alignItems: "center" }}>
          <span style={{ 
            backgroundColor: "#4CAF50", 
            color: "white", 
            borderRadius: "8px", 
            padding: "0.3rem 0.6rem",
            marginRight: "0.8rem",
            fontSize: "1.2rem"
          }}>🗺️</span>
          IITK Mela Navigator
        </h2>
        
        {/* Search input */}
        <div className="search-container" style={{ marginBottom: "1rem" }}>
          <input
            type="text"
            placeholder="Search for amenities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              padding: "0.7rem", 
              width: "100%", 
              maxWidth: "400px", 
              marginBottom: "0.8rem",
              border: "1px solid #ced4da",
              borderRadius: "4px",
              fontSize: "1rem"
            }}
          />
        </div>
        
        {/* From-To directions */}
        <div style={{ marginBottom: "1rem" }}>
          <h4 style={{ margin: "0 0 0.5rem 0", color: "#495057" }}>Get Directions</h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
            <select
              value={fromLocation}
              onChange={(e) => setFromLocation(e.target.value)}
              style={{ 
                padding: "0.7rem", 
                minWidth: "180px",
                border: "1px solid #ced4da",
                borderRadius: "4px",
                backgroundColor: "white"
              }}
            >
              <option value="">Select starting point...</option>
              {iitkAmenities.map(amenity => (
                <option key={`from-${amenity.id}`} value={amenity.name}>
                  {amenity.name}
                </option>
              ))}
            </select>
            
            <span style={{ fontSize: "1.2rem", color: "#6c757d" }}>→</span>
            
            <select
              value={toLocation}
              onChange={(e) => setToLocation(e.target.value)}
              style={{ 
                padding: "0.7rem", 
                minWidth: "180px",
                border: "1px solid #ced4da",
                borderRadius: "4px",
                backgroundColor: "white"
              }}
            >
              <option value="">Select destination...</option>
              {iitkAmenities.map(amenity => (
                <option key={`to-${amenity.id}`} value={amenity.name}>
                  {amenity.name}
                </option>
              ))}
            </select>
            
            <button
              onClick={handleGetDirections}
              style={{ 
                padding: "0.7rem 1.2rem", 
                backgroundColor: "#4CAF50", 
                color: "white", 
                border: "none", 
                borderRadius: "4px",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              Get Directions
            </button>
            
            {showDirections && (
              <button
                onClick={clearDirections}
                style={{ 
                  padding: "0.7rem 1.2rem", 
                  backgroundColor: "#6c757d", 
                  color: "white", 
                  border: "none", 
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Clear Route
              </button>
            )}
          </div>
        </div>
        
        {/* Category filter */}
        <div className="category-filter" style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {["all", "washroom", "medical", "food", "entrance", "parking", "stage"].map(category => (
            <button
              key={category}
              className={selectedCategory === category ? "active" : ""}
              onClick={() => setSelectedCategory(category)}
              style={{
                padding: "0.6rem 1rem",
                backgroundColor: selectedCategory === category ? "#4CAF50" : "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "20px",
                textTransform: 'capitalize',
                fontSize: "0.9rem",
                cursor: "pointer"
              }}
            >
              {category === 'all' ? 'All Locations' : category}
            </button>
          ))}
        </div>
      </div>
      
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Directions Panel */}
        {showDirections && currentRoute && (
          <div style={{ 
            width: "300px", 
            backgroundColor: "white", 
            padding: "1rem",
            borderRight: "1px solid #dee2e6",
            overflowY: "auto",
            boxShadow: "2px 0 5px rgba(0,0,0,0.1)"
          }}>
            <h3 style={{ color: "#2c3e50", marginTop: 0 }}>Directions</h3>
            <div style={{ 
              backgroundColor: "#e8f4fc", 
              padding: "1rem", 
              borderRadius: "8px",
              marginBottom: "1rem"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "bold" }}>From:</span>
                <span>{currentRoute.fromName}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem" }}>
                <span style={{ fontWeight: "bold" }}>To:</span>
                <span>{currentRoute.toName}</span>
              </div>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                marginTop: "1rem",
                paddingTop: "0.5rem",
                borderTop: "1px dashed #ccc"
              }}>
                <span>Distance: {currentRoute.distance}</span>
                <span>Time: {currentRoute.time}</span>
              </div>
            </div>
            
            <h4 style={{ color: "#2c3e50" }}>Turn-by-Turn</h4>
            <ol style={{ paddingLeft: "1.2rem" }}>
              {currentRoute.steps.map((step, index) => (
                <li key={index} style={{ marginBottom: "0.8rem" }}>{step}</li>
              ))}
            </ol>
          </div>
        )}
        
        {/* Map container */}
        <div style={{ flex: 1, position: "relative" }}>
          <MapContainer
            center={iitkLocation}
            zoom={16}
            style={{ height: "100%", width: "100%" }}
            whenCreated={mapInstance => { mapRef.current = mapInstance; }}
          >
            <ChangeView center={iitkLocation} zoom={16} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Render routing if directions are active */}
            {showDirections && currentRoute && (
              <Routing route={currentRoute} map={mapRef.current} />
            )}
            
            {/* Render filtered amenities */}
            {filteredAmenities.map(amenity => (
              <Marker
                key={amenity.id}
                position={amenity.position}
                icon={amenityIcons[amenity.type] || amenityIcons.default}
              >
                <Popup>
                  <div style={{ minWidth: "200px" }}>
                    <h3 style={{ margin: "0 0 0.5rem 0", color: "#2c3e50" }}>{amenity.name}</h3>
                    <p style={{ margin: "0 0 0.8rem 0", color: "#6c757d" }}>{amenity.description}</p>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        onClick={() => {
                          setFromLocation(amenity.name);
                          if (mapRef.current) {
                            mapRef.current.setView(amenity.position, 18);
                          }
                        }}
                        style={{ 
                          padding: "0.4rem 0.7rem", 
                          backgroundColor: "#28a745", 
                          color: "white", 
                          border: "none", 
                          borderRadius: "4px",
                          fontSize: "0.8rem",
                          cursor: "pointer"
                        }}
                      >
                        Set as Start
                      </button>
                      <button
                        onClick={() => {
                          setToLocation(amenity.name);
                        }}
                        style={{ 
                          padding: "0.4rem 0.7rem", 
                          backgroundColor: "#dc3545", 
                          color: "white", 
                          border: "none", 
                          borderRadius: "4px",
                          fontSize: "0.8rem",
                          cursor: "pointer"
                        }}
                      >
                        Set as End
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default Map;