import React, { createContext, useState } from 'react';

const AppContext = createContext();


const AppContextProvider = ({ children }) => {
  const [suburbs, setSuburbs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapFocus, setMapFocus] = useState(null);

  const toggleSuburbSelection = (suburbIndex, mapfocus = true) => {
    const suburb = suburbs[suburbIndex];
    const newSelection = !suburb.status.selected;

    setSuburbs([
      ...suburbs.slice(0, suburbIndex),
      {
        ...suburb,
        status: {
          ...suburb.status,
          selected: !suburb.status.selected
        }
      },
      ...suburbs.slice(suburbIndex + 1)
    ]);


    if (newSelection && mapfocus) {
      const bounds = L.geoJSON(suburb).getBounds();
      const center = bounds.getCenter();
      // Update to include both center and bounds
      setMapFocus({ center: [center.lat, center.lng], bounds: bounds });
    } else {
      // Reset map focus when deselection happens
      setMapFocus(null);
    }
  };

  const resetSuburbSelection = () => {
    setSuburbSelected({});
  };

  return (
    <AppContext.Provider value={{ 
      suburbs,
      setSuburbs,
      searchQuery,
      setSearchQuery,
      mapFocus,
      setMapFocus,
      toggleSuburbSelection, 
      resetSuburbSelection 
    }}>
      {children}
    </AppContext.Provider>
  );
};


export { AppContext, AppContextProvider };
