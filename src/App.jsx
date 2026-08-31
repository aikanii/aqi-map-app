import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMapEvents, Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Wind, Navigation, AlertCircle } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import './index.css';

function getAQITheme(aqi) {
  if (aqi === null) return 'theme-good';
  if (aqi <= 50) return 'theme-good';
  if (aqi <= 100) return 'theme-moderate';
  if (aqi <= 150) return 'theme-usg';
  if (aqi <= 200) return 'theme-unhealthy';
  if (aqi <= 300) return 'theme-very-unhealthy';
  return 'theme-hazardous';
}

function getAQILabel(aqi) {
  if (aqi === null) return 'Select a location';
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
}

const MAJOR_CITIES = [
  { name: 'New York', lat: 40.7128, lng: -74.0060 },
  { name: 'London', lat: 51.5074, lng: -0.1278 },
  { name: 'Paris', lat: 48.8566, lng: 2.3522 },
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503 },
  { name: 'Beijing', lat: 39.9042, lng: 116.4074 },
  { name: 'Delhi', lat: 28.6139, lng: 77.2090 },
  { name: 'Los Angeles', lat: 34.0522, lng: -118.2437 },
  { name: 'Sao Paulo', lat: -23.5505, lng: -46.6333 },
  { name: 'Cairo', lat: 30.0444, lng: 31.2357 },
  { name: 'Sydney', lat: -33.8688, lng: 151.2093 },
  { name: 'Moscow', lat: 55.7558, lng: 37.6173 },
  { name: 'Mexico City', lat: 19.4326, lng: -99.1332 },
  { name: 'Seoul', lat: 37.5665, lng: 126.9780 },
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
  { name: 'Dubai', lat: 25.2048, lng: 55.2708 },
  { name: 'Toronto', lat: 43.6532, lng: -79.3832 }
];

function getMarkerIcon(aqi) {
  const theme = getAQITheme(aqi);
  return L.divIcon({
    className: `custom-aqi-marker ${theme}`,
    html: `<div>${aqi}</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  });
}

function MapEvents({ setLocation, fetchAQI }) {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setLocation({ lat: lat.toFixed(4), lng: lng.toFixed(4) });
      fetchAQI(lat, lng);
    },
  });
  return null;
}

export default function App() {
  const [aqi, setAqi] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);
  const [liveMarkers, setLiveMarkers] = useState([]);
  const themeClass = getAQITheme(aqi);

  useEffect(() => {
    const fetchLiveReadings = async () => {
      try {
        const lats = MAJOR_CITIES.map(c => c.lat).join(',');
        const lngs = MAJOR_CITIES.map(c => c.lng).join(',');
        const res = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lats}&longitude=${lngs}&current=us_aqi`);
        if (!res.ok) throw new Error('Bulk API Failed');
        const data = await res.json();
        
        const readings = MAJOR_CITIES.map((city, index) => {
          const cityData = data[index];
          return {
            ...city,
            aqi: cityData?.current?.us_aqi !== undefined ? cityData.current.us_aqi : null
          };
        });
        setLiveMarkers(readings.filter(r => r.aqi !== null));
      } catch (e) {
        console.error('Failed to fetch live readings', e);
      }
    };
    fetchLiveReadings();
  }, []);

  useEffect(() => {
    document.body.className = themeClass;
  }, [themeClass]);

  const fetchAQI = async (lat, lng) => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}&current=us_aqi`);
      if (!resp.ok) throw new Error('API Request Failed');
      const data = await resp.json();
      if (data && data.current && data.current.us_aqi !== null && data.current.us_aqi !== undefined) {
        setAqi(data.current.us_aqi);
      } else {
        throw new Error('No AQI data for this location.');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch data');
      setAqi(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`App ${themeClass}`} style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <div className="map-container">
        <MapContainer 
          center={[20, 0]} 
          zoom={3} 
          style={{ height: '100%', width: '100%', zIndex: 1 }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />
          {liveMarkers.map((marker, i) => (
            <Marker key={i} position={[marker.lat, marker.lng]} icon={getMarkerIcon(marker.aqi)}>
              <Tooltip direction="top" offset={[0, -20]} opacity={1}>
                {marker.name}: AQI {marker.aqi}
              </Tooltip>
            </Marker>
          ))}
          <MapEvents setLocation={setLocation} fetchAQI={fetchAQI} />
        </MapContainer>
      </div>

      <div className="app-overlay">
        <div className="glass-panel">
          <div className="header">
            <h1><Wind className="pulse-icon" style={{ display: 'inline-block', width: '32px', height:'32px', verticalAlign: 'middle', marginRight: '8px' }}/> <span className="highlight">AirSense</span></h1>
            <p>Global Air Quality Index</p>
          </div>

          <div className="aqi-display">
            {loading ? (
              <div className="loader"></div>
             ) : error ? (
              <div style={{ textAlign: 'center', color: '#fca5a5' }}>
                <AlertCircle size={32} style={{ margin: '0 auto 8px' }} />
                <p>{error}</p>
              </div>
            ) : aqi !== null ? (
              <>
                <div className="aqi-value">{aqi}</div>
                <div className="aqi-label">{getAQILabel(aqi)}</div>
              </>
            ) : (
              <div className="aqi-label" style={{ opacity: 0.7 }}>Click on the map to begin</div>
            )}
          </div>

          {location && (
            <div className="location-info">
              <MapPin size={16} />
              <span>{location.lat}, {location.lng}</span>
            </div>
          )}

          {!location && !loading && (
            <div className="instruction-text">
              <Navigation size={16} />
              <span>Select any location worldwide</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
