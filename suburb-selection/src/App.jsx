import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import SuburbsTable from './SuburbsTable';
import PostcodesTable from './PostcodesTable';
import { downloadSelectedSuburbsAndPostcodes } from './utils';
import './App.css';

function App() {
  const [suburbs, setSuburbs] = useState([]);
  const [selectedSuburbs, setSelectedSuburbs] = useState(new Set());
  const [postcodeData, setPostcodeData] = useState({});

  useEffect(() => {
    fetch('suburb-10-vic.geojson')
      .then((response) => response.json())
      .then((data) => setSuburbs(data.features));
    fetch('postcode-data.json')
      .then((response) => response.json())
      .then((data) => setPostcodeData(data));
  }, []);

  const toggleSuburbSelection = (suburbName) => {
    const newSelection = new Set(selectedSuburbs);
    if (newSelection.has(suburbName)) {
      newSelection.delete(suburbName);
    } else {
      newSelection.add(suburbName);
    }
    setSelectedSuburbs(newSelection);
  };

  return (
    <div className="app">
      <div className="sidebar">
        <button onClick={() => downloadSelectedSuburbsAndPostcodes(selectedSuburbs, postcodeData)}>
          Download Selected
        </button>
        <SuburbsTable
          suburbs={suburbs}
          selectedSuburbs={selectedSuburbs}
          toggleSuburbSelection={toggleSuburbSelection}
        />
        <PostcodesTable
          suburbs={suburbs}
          selectedSuburbs={selectedSuburbs}
          postcodeData={postcodeData}
          toggleSuburbSelection={toggleSuburbSelection}
        />
      </div>
      <MapContainer center={[-37.8136, 144.9631]} zoom={10} style={{ height: "100vh", width: "100%", float: "right" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {suburbs.map((suburb, index) => (
          <GeoJSON
            key={index}
            data={suburb}
            eventHandlers={{
              click: () => toggleSuburbSelection(suburb.properties.vic_loca_2),
            }}
            style={() => ({
              color: selectedSuburbs.has(suburb.properties.vic_loca_2) ? "#ff7800" : "#3388ff",
            })}
          />
        ))}
      </MapContainer>
    </div>
  );
}

export default App;
