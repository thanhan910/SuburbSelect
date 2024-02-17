import React, { createContext, useState } from 'react';

const AppContext = createContext();


const AppContextProvider = ({ children }) => {
  const [suburbs, setSuburbs] = useState([]);
  const [suburbSelected, setSuburbSelected] = useState({});
  const [postcodeData, setPostcodeData] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [mapFocus, setMapFocus] = useState(null);

  const toggleSuburbSelection = (suburbIndex, mapfocus = true) => {
    const newSelection = !suburbSelected[suburbIndex];
    setSuburbSelected({ ...suburbSelected, [suburbIndex]: newSelection });

    if (newSelection && mapfocus) {
      const suburb = suburbs[suburbIndex];
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
      suburbSelected,
      setSuburbSelected,
      postcodeData,
      setPostcodeData,
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
