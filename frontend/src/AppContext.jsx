import React, { createContext, useState } from 'react';

const AppContext = createContext();

const ALL_FILES = [
  {
    name: 'Greater Melbourne',
    path: 'suburbs-greater-melbourne.geojson',
  },
  {
    name: 'Greater Sydney',
    path: 'suburbs-greater-melbourne.geojson',
  }
];


const AppContextProvider = ({ children }) => {
  const [suburbs, setSuburbs] = useState([]);
  const [files, setFiles] = useState(ALL_FILES.map((file, index) => (
    index === 0 ? 
    { ...file, displayed: true, selectable: true, loaded: true } : 
    { ...file, displayed: false, selectable: false, loaded: false })));
  const [searchQuery, setSearchQuery] = useState('');
  const [mapFocus, setMapFocus] = useState(null);

  const toggleSelectableFile = (fileIndex) => {
    files.forEach((file, index) => {
      if (index === fileIndex) {
        file.selectable = true;
        file.displayed = true;
        if (!file.loaded) {
          file.loaded = true;
        }
      }
      else {
        file.selectable = false;
      }
    });
    setFiles([...files]);
  };

  const toggleFileDisplayed = (fileIndex) => {
    files[fileIndex].displayed = !files[fileIndex].displayed;
    if (files[fileIndex].displayed && !files[fileIndex].loaded) {
      // load file if not already loaded
      // loadFile(files[fileIndex].path);
      files[fileIndex].loaded = true;
    }
    else {
      files[fileIndex].selectable = false;
    }
    setFiles([...files]);
  };

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
    suburbs.forEach((suburb) => {
      suburb.status.selected = false;
    });

    setSuburbs([...suburbs]);
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
      resetSuburbSelection,
      files,
      setFiles,
      toggleFileDisplayed,
      toggleSelectableFile
    }}>
      {children}
    </AppContext.Provider>
  );
};


export { AppContext, AppContextProvider };
