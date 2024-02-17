import React, { useState, useEffect, useContext } from 'react';

import { AppContext } from './AppContext';
import SearchBar from './SearchBar';
import SuburbsTable from './SuburbsTable';
import PostcodesTable from './PostcodesTable';
import { downloadSelectedSuburbsAndPostcodes } from './utils';
import { TableSortContextProvider } from './TableSortContext';
import SortToggler from './SortToggler';

export default function SideBar() {
  const { suburbs, resetSuburbSelection } = useContext(AppContext);

  return (
    <div className="sidebar">
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button 
          onClick={() => downloadSelectedSuburbsAndPostcodes(suburbs)}
          title='Download selected suburbs and postcodes as a CSV file.'
        >
          Download
        </button>
        <button 
          onClick={resetSuburbSelection}
          title='Clear selected suburbs.'
        >
          Clear
        </button>
      </div>
      <SearchBar />
      <TableSortContextProvider>
        <SortToggler />
        <SuburbsTable />
      </TableSortContextProvider>
    </div>
  );
}