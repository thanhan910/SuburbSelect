import React, { createContext, useEffect, useState } from 'react';

const AppContext = createContext();

// suburbs-1GSYD.geojson
// suburbs-2GMEL.geojson
// suburbs-3GBRI.geojson
// suburbs-4GADE.geojson
// suburbs-5GPER.geojson
// suburbs-6GHOB.geojson
// suburbs-7GDAR.geojson
// suburbs-8ACTE.geojson

const ALL_FILES = [
  {
    name: 'Greater Melbourne',
    path: 'suburbs-2GMEL.geojson',
  },
  {
    name: 'Greater Sydney',
    path: 'suburbs-1GSYD.geojson',
  },
  {
    name: 'Greater Brisbane',
    path: 'suburbs-3GBRI.geojson',
  },
  {
    name: 'Greater Adelaide',
    path: 'suburbs-4GADE.geojson',
  },
  {
    name: 'Greater Perth',
    path: 'suburbs-5GPER.geojson',
  },
  {
    name: 'Greater Hobart',
    path: 'suburbs-6GHOB.geojson',
  },
  {
    name: 'Greater Darwin',
    path: 'suburbs-7GDAR.geojson',
  },
  {
    name: 'Greater Canberra',
    path: 'suburbs-8ACTE.geojson',
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

  const enrichSuburbsData = (data) => {
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
      // suburb.properties.state = 'VIC';
    });
    return data;
  };

  const loadFile = (fileIndex) => {
    files[fileIndex].loaded = true;
    fetch(files[fileIndex].path).then(response => response.json()).then(data => {
      filesData[fileIndex] = data;
      setFilesData([...filesData]);
      data = enrichSuburbsData(data);
      setSuburbs(data.features);
    });
  };

  useEffect(() => {
    fetch(files[0].path).then(response => response.json()).then(data => {
      filesData[0] = data;
      setFilesData([...filesData]);
      data = enrichSuburbsData(data);
      setSuburbs(data.features);
    });
  }, []);


  const toggleSelectableFile = (fileIndex) => {
    files.forEach((file, index) => {
      if (index === fileIndex) {
        file.selectable = true;
        file.displayed = true;
      }
      else {
        file.selectable = false;
      }
    });
    if (filesData[fileIndex] === null) {
      // load file if not already loaded
      loadFile(fileIndex);
    }
    else {
      setSuburbs(filesData[fileIndex].features);
    }
    setFiles([...files]);
  };

  const toggleFileDisplayed = (fileIndex) => {
    files[fileIndex].displayed = !files[fileIndex].displayed;
    if (!files[fileIndex].displayed) {
      files[fileIndex].selectable = false;
    }
    if (filesData[fileIndex] === null) {
      // load file if not already loaded
      loadFile(fileIndex);
    }
    else {
      setSuburbs(filesData[fileIndex].features);
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
