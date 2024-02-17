import React, { useState, useEffect, useContext } from 'react';

import { AppContext, AppContextProvider } from './AppContext';
import SuburbsMap from './SuburbsMap';
import SideBar from './SideBar';

import './App.css';

function MountData() {
  const { setSuburbs } = useContext(AppContext);

  useEffect(() => {
    fetch('suburbs-vic.geojson').then(response => response.json()).then(data => {
      data.features = data.features.sort((a, b) => a.properties.name.localeCompare(b.properties.name));
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
