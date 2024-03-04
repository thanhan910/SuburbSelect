import React, { createContext, useState } from 'react';

const AppContext = createContext();


const AppContextProvider = ({ children }) => {
  const [suburbs, setSuburbs] = useState([]);
  const [files, setFiles] = useState([
    {
      name: 'file1',
      path: 'path1',
      displayed: true,
      selectable: true
    },
    {
      name: 'file2',
      path: 'path2',
      displayed: false,
      selectable: true
    }
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapFocus, setMapFocus] = useState(null);

  const toggleSelectableFile = (fileIndex) => {
    files.forEach((file, index) => {
      if (index !== fileIndex) {
        file.selectable = false;
      }
      else {
        file.selectable = true;
        file.displayed = true;
      }
    });
    setFiles([...files]);
  };

  const toggleFileDisplayed = (fileIndex) => {
    console.log(files[fileIndex].displayed)
    files[fileIndex].displayed = !files[fileIndex].displayed;
    if (!files[fileIndex].displayed) {
      files[fileIndex].selectable = false;
    }
    setFiles([...files]);
    console.log(files);
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
