import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import SuburbsTable from './SuburbsTable';
import PostcodesTable from './PostcodesTable';
import { downloadSelectedSuburbsAndPostcodes } from './utils';
import './App.css';

function App() {
  const [suburbs, setSuburbs] = useState([]);
  const [selectedSuburbs, setSelectedSuburbs] = useState([]);
  const [postcodeData, setPostcodeData] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('suburb-10-vic.geojson')
      .then((response) => response.json())
      .then((data) => setSuburbs(data.features));
    fetch('postcode-data.json')
      .then((response) => response.json())
      .then((data) => setPostcodeData(data));
  }, []);

  const toggleSuburbSelection = (suburbName) => {
    if (selectedSuburbs.includes(suburbName)) {
      setSelectedSuburbs(selectedSuburbs.filter((selectedSuburb) => selectedSuburb !== suburbName));
    } else {
      setSelectedSuburbs([...selectedSuburbs, suburbName]);
    }
    // const newSelection = new Set(selectedSuburbs);
    // if (newSelection.has(suburbName)) {
    //   newSelection.delete(suburbName);
    // } else {
    //   newSelection.add(suburbName);
    // }
    // setSelectedSuburbs(newSelection);
  };

  return (
    <div className="app">
      <div className="sidebar">
        <button onClick={() => downloadSelectedSuburbsAndPostcodes(selectedSuburbs, postcodeData)}>
          Download Selected
        </button>
        <input
          type="text"
          placeholder="Search suburbs by name or postcode"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '20px', boxSizing: 'border-box', color: 'black', backgroundColor: 'transparent', border: '1px solid #ccc'
         }}
        />
        <SuburbsTable
          suburbs={suburbs}
          selectedSuburbs={selectedSuburbs}
          postcodeData={postcodeData}
          toggleSuburbSelection={toggleSuburbSelection}
          searchQuery={searchQuery}
        />
        <PostcodesTable
          suburbs={suburbs}
          selectedSuburbs={selectedSuburbs}
          postcodeData={postcodeData}
          toggleSuburbSelection={toggleSuburbSelection}
        />
      </div>
      <MapContainer center={[-37.8136, 144.9631]} zoom={12} style={{ height: "100vh", width: "100%", float: "right" }}>
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
            style={() => {
              const selected = selectedSuburbs.includes(suburb.properties.vic_loca_2);
              return ({
                weight: 1,
                color: "#000000",
                fillColor: selected ? "#ff7800" : "#000000",
                fillOpacity: selected ? 0.5 : 0,
              })
            }}
          >
            <Tooltip>
              {suburb.properties.vic_loca_2}, {postcodeData[`${suburb.properties.vic_loca_2},VIC`] || 'VIC'}
            </Tooltip>
          </GeoJSON>
        ))}
      </MapContainer>
    </div>
  );
}

export default App;
