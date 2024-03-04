import React, { useState, useEffect, useContext } from 'react';

import { AppContext, AppContextProvider } from './AppContext';
import SuburbsMap from './SuburbsMap';
import SideBar from './SideBar';
import MountData from './MountData';

import './App.css';


function App() {

  return (
    <AppContextProvider>
      <div className="app">
        {/* <MountData filepath='suburbs-greater-melbourne.geojson' /> */}
        <SideBar />
        <SuburbsMap />
      </div>
    </AppContextProvider>
  );
}

export default App;
