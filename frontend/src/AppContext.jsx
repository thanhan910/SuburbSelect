import React, { createContext, useEffect, useState } from 'react';

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
  const [filesData, setFilesData] = useState(ALL_FILES.map((file, index) => (null)));
  const [files, setFiles] = useState(ALL_FILES.map((file, index) => (
    index === 0 ? 
    { ...file, displayed: true, selectable: true } : 
    { ...file, displayed: false, selectable: false })));
  const [searchQuery, setSearchQuery] = useState('');
  const [mapFocus, setMapFocus] = useState(null);

  const loadFile = (fileIndex) => {
    files[fileIndex].loaded = true;
    fetch(files[fileIndex].path).then(response => response.json()).then(data => {
      filesData[fileIndex] = data;
      setFilesData([...filesData]);
    });
  };

  useEffect(() => {
    fetch(files[0].path).then(response => response.json()).then(data => {
      filesData[0] = data;
      setFilesData([...filesData]);
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


  const toggleSelectableFile = (fileIndex) => {
    files.forEach((file, index) => {
      if (index === fileIndex) {
        file.selectable = true;
        file.displayed = true;
        if (filesData[fileIndex] === null) {
          // load file if not already loaded
          loadFile(fileIndex);
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
    if (files[fileIndex].displayed && (filesData[fileIndex] === null)) {
      // load file if not already loaded
      loadFile(fileIndex);
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
