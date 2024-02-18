import React, { useState, useEffect, useContext } from 'react';

import { AppContext, AppContextProvider } from './AppContext';
import SuburbsMap from './SuburbsMap';
import SideBar from './SideBar';

import './App.css';

function MountData() {
  const { setSuburbs } = useContext(AppContext);

  useEffect(() => {
    fetch('suburbs.geojson').then(response => response.json()).then(data => {
      data.features = data.features.sort((a, b) => {
        if (!(a.properties.postcode)) return 1;
        if (!(b.properties.postcode)) return -1;
        a.properties.postcode.localeCompare(b.properties.postcode)
      });
      data.features.forEach((suburb) => {
        suburb.status = {
          selected: false,
          hover: false,
        }
      });
      setSuburbs(data.features);
    });
  }, []);

  return null;
}



function App() {

  return (
    <AppContextProvider>
      <div className="app">
        <MountData />
        <SideBar />
        <SuburbsMap />
      </div>
    </AppContextProvider>
  );
}

export default App;
