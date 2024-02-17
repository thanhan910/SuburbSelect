import React, { createContext, useState, useContext } from 'react';

import { AppContext } from './AppContext';

const TableSortContext = createContext();


const TableSortContextProvider = ({ children }) => {

  const { suburbSelected, postcodeData } = useContext(AppContext);

  const [sortOption, setSortOption] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  const handleSort = (option) => {
    if (sortOption === option) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortOption(option);
      setSortOrder('asc');
    }
  };

  const sortSuburbs = (suburbs) => {
    if (sortOption === 'postcode') {
      return suburbs.sort((a, b) => {
        const postcodeA = a[0].properties.postcode;
        const postcodeB = b[0].properties.postcode;
        // Put suburbs without postcode at the bottom
        if (postcodeA === undefined || postcodeA === null || postcodeA === '') return 1;
        if (postcodeB === undefined || postcodeB === null || postcodeB === '') return -1;
        return sortOrder === 'asc' ? postcodeA.localeCompare(postcodeB) : postcodeB.localeCompare(postcodeA);
      });
    } else if (sortOption === 'name') {
      return suburbs.sort((a, b) => {
        const suburbNameA = a[0].properties.name;
        const suburbNameB = b[0].properties.name;
        return sortOrder === 'asc' ? suburbNameA.localeCompare(suburbNameB) : suburbNameB.localeCompare(suburbNameA);
      });
    } else {
      // Default sorting by suburb selected
      return suburbs.sort((a, b) => {
        const selectedA = a[0].status.selected;
        const selectedB = b[0].status.selected;
        if (selectedA === selectedB) {
          return 0;
        } else if (sortOrder === 'asc') {
          return selectedA ? -1 : 1;
        } else {
          return selectedA ? 1 : -1;
        }
      });
    }
  };

  return (
    <TableSortContext.Provider value={{
      sortOption, setSortOption,
      sortOrder, setSortOrder,
      handleSort,
      sortSuburbs,
    }}>
      {children}
    </TableSortContext.Provider>
  );
};


export { TableSortContext, TableSortContextProvider };
