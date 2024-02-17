import React, { useState, useEffect, useContext } from 'react';

import { AppContext } from './AppContext';
import SuburbsMap from './SuburbsMap';

import './App.css';

function MountData() {
  const { setSuburbs, setPostcodeData } = useContext(AppContext);

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

  return null;
}



function App() {

  return (
    <div className="app">
      <MountData />
      <SideBar />
      <SuburbsMap />
    </div>
  );
}

export default App;
