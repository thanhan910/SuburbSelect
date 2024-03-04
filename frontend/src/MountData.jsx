import React, { useState, useEffect, useContext } from 'react';

import { AppContext, AppContextProvider } from './AppContext';
import SuburbsMap from './SuburbsMap';
import SideBar from './SideBar';

export default function MountData({ filepath }) {
  
  const { setSuburbs } = useContext(AppContext);

  useEffect(() => {
    console.log(filepath);
    fetch(filepath).then(response => response.json()).then(data => {
      data.features = data.features.sort((a, b) => {
        if (!(a.properties.postcode)) return 1;
        if (!(b.properties.postcode)) return -1;
        return a.properties.postcode.localeCompare(b.properties.postcode)
      });
      data.features.forEach((suburb) => {
        suburb.status = {
          selected: false,
          hover: false,
        }
        suburb.properties.name = suburb.properties.suburb || suburb.properties.name;
        suburb.properties.state = 'VIC';
      });
      setSuburbs(data.features);
    });
  }, []);

  return null;
}

