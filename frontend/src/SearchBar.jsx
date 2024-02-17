import React, { useState, useEffect, useContext } from 'react';

import { AppContext } from './AppContext';

export default function SearchBar() {
    const { searchQuery, setSearchQuery } = useContext(AppContext);
  
    return (
      <input
        className='search-bar'
        type="text"
        placeholder="Search by name/postcode"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    );
  }
  
  
