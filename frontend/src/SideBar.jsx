import React, { useState, useEffect, useContext } from 'react';

import { AppContext } from './AppContext';
import SearchBar from './SearchBar';
import SuburbsTable from './SuburbsTable';
import PostcodesTable from './PostcodesTable';
import { downloadSelectedSuburbsAndPostcodes } from './utils';

export default function SideBar() {
  const { suburbs, suburbSelected, postcodeData, searchQuery, setSearchQuery, resetSuburbSelection } = useContext(AppContext);

  return (
    <div className="sidebar">
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={() => downloadSelectedSuburbsAndPostcodes(suburbs, postcodeData, suburbSelected)}>
          Download
        </button>
        <button onClick={resetSuburbSelection}>
          Clear
        </button>
      </div>
      <SearchBar />
      <SuburbsTable />
    </div>
  );
}