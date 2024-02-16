import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, Tooltip, useMap  } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import SuburbsTable from './SuburbsTable';
import PostcodesTable from './PostcodesTable';
import { downloadSelectedSuburbsAndPostcodes } from './utils';
import './App.css';


function MapFocus({ center, bounds }) {
  const map = useMap();
  useEffect(() => {
    if (center && bounds) {
      // Fly to the center of the bounds
      map.flyTo(center, map.getZoom(), {
        animate: true,
        duration: 0.5 // Animation duration in seconds
      });

      // After a delay, fit the map to the bounds
      // This delay allows the flyTo animation to complete before fitting to bounds

      // Only fit bounds if the map is smaller than the bounds, or if the bounds are not visible

      // const mapBounds = map.getBounds();
      // if (!mapBounds.contains(bounds) || !mapBounds.intersects(bounds)) {
      //   bounds = L.latLngBounds(mapBounds.getSouthWest(), mapBounds.getNorthEast()).extend(bounds.getSouthWest()).extend(bounds.getNorthEast());
      // }
      setTimeout(() => {
        map.fitBounds(bounds, {
          animate: true,
          padding: [60, 60] // Adjust padding to ensure the bounds fit well within the view
        });
      }, 500); // Delay in milliseconds, adjust based on the duration of flyTo
      
    }
  }, [center, bounds, map]);

  return null;
}



function App() {
  const [suburbs, setSuburbs] = useState([]);
  const [suburbSelected, setSuburbSelected] = useState({});
  const [postcodeData, setPostcodeData] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [mapFocus, setMapFocus] = useState(null);

  useEffect(() => {
    // Create promises for each fetch operation
    const suburbsPromise = fetch('suburb-10-vic.geojson').then(response => response.json());
    const postcodesPromise = fetch('postcode-data.json').then(response => response.json());
  
    // Use Promise.all to wait for both promises to resolve
    Promise.all([suburbsPromise, postcodesPromise]).then(([suburbsData, postcodesData]) => {
      // Sort the suburbs
      const sortedSuburbs = suburbsData.features.sort((a, b) => a.properties.vic_loca_2.localeCompare(b.properties.vic_loca_2));
      
      // Map suburbs to postcodes
      const postcodeData = sortedSuburbs.reduce((acc, suburb, index) => {
        const suburbName = suburb.properties.vic_loca_2;
        acc[index] = postcodesData[`${suburbName},VIC`] || '';
        return acc;
      }, {});

      setSuburbs(sortedSuburbs);
      setPostcodeData(postcodeData);
    });
  }, []);
  

  const toggleSuburbSelection = (suburbIndex, mapfocus = true) => {
    const newSelection = !suburbSelected[suburbIndex];
    setSuburbSelected({ ...suburbSelected, [suburbIndex]: newSelection });

    if (newSelection && mapfocus) {
      const suburb = suburbs[suburbIndex];
      const bounds = L.geoJSON(suburb).getBounds();
      const center = bounds.getCenter();
      // Update to include both center and bounds
      setMapFocus({center: [center.lat, center.lng], bounds: bounds});
    } else {
      // Reset map focus when deselection happens
      setMapFocus(null);
    }
  };


  const resetSuburbSelection = () => {
    setSuburbSelected({});
  };

  return (
    <div className="app">
      <div className="sidebar">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={() => downloadSelectedSuburbsAndPostcodes(suburbs, postcodeData, suburbSelected)}>
            Download
          </button>
          <button onClick={resetSuburbSelection}>
            Reset
          </button>
        </div>
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
              click: () => toggleSuburbSelection(index, false),
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
        {/* Conditional rendering to focus map */}
        {mapFocus && <MapFocus center={mapFocus.center} bounds={mapFocus.bounds} />}
      </MapContainer>
    </div>
  );
}

export default App;
