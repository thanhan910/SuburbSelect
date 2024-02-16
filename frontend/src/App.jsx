import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import SuburbsTable from './SuburbsTable';
import PostcodesTable from './PostcodesTable';
import { downloadSelectedSuburbsAndPostcodes } from './utils';
import './App.css';

function App() {
  const [suburbs, setSuburbs] = useState([]);
  const [suburbSelected, setSuburbSelected] = useState({});
  const [postcodeData, setPostcodeData] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('suburb-10-vic.geojson')
      .then((response) => response.json())
      .then((suburbsdata) => {
        setSuburbs(suburbsdata.features.sort((a, b) => a.properties.vic_loca_2.localeCompare(b.properties.vic_loca_2)));
        fetch('postcode-data.json')
          .then((response) => response.json())
          .then((postcodesdata) => {
            const postcode_data = {};
            suburbs.forEach((suburb, index) => {
              const suburbName = suburb.properties.vic_loca_2;
              if (postcodesdata[`${suburbName},VIC`] === undefined) {
                postcode_data[index] = '';
                console.log(suburbName, postcodesdata, postcodesdata[`${suburbName},VIC`] === undefined);
              }
              else {
                postcode_data[index] = postcodesdata[`${suburbName},VIC`];
              }
            });
            setPostcodeData(postcode_data);
          });
      })
  }, []);

  const toggleSuburbSelection = (suburbIndex) => {
    if (!suburbSelected[suburbIndex]) {
      setSuburbSelected({ ...suburbSelected, [suburbIndex]: true });
    } else {
      setSuburbSelected({ ...suburbSelected, [suburbIndex]: false });
    }
  };

  return (
    <div className="app">
      <div className="sidebar">
        <button onClick={() => downloadSelectedSuburbsAndPostcodes(suburbs, postcodeData, suburbSelected)}>
          Download selected
        </button>
        <input
          type="text"
          placeholder="Search suburbs by name or postcode"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%', padding: '10px', marginBottom: '20px', boxSizing: 'border-box', color: 'black', backgroundColor: 'transparent', border: '1px solid #ccc'
          }}
        />
        <SuburbsTable
          suburbs={suburbs}
          suburbSelected={suburbSelected}
          postcodeData={postcodeData}
          toggleSuburbSelection={toggleSuburbSelection}
          searchQuery={searchQuery}
        />
        <PostcodesTable
          suburbs={suburbs}
          suburbSelected={suburbSelected}
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
              click: () => toggleSuburbSelection(index),
            }}
            style={() => {
              const selected = suburbSelected[index];
              return ({
                weight: 1,
                color: "#000000",
                fillColor: selected ? "#ff7800" : "#000000",
                fillOpacity: selected ? 0.5 : 0,
              })
            }}
          >
            <Tooltip>
              {suburb.properties.vic_loca_2}, {postcodeData[index] || 'VIC'}
            </Tooltip>
          </GeoJSON>
        ))}
      </MapContainer>
    </div>
  );
}

export default App;
