import React, { useState, useEffect, useContext } from 'react';

import { AppContext } from './AppContext';

export default function SearchBar() {
    const { searchQuery, setSearchQuery } = useContext(AppContext);
  
    return (
      <input
        type="text"
        placeholder="Search suburbs by name or postcode"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          width: '100%', padding: '10px', marginBottom: '20px', boxSizing: 'border-box', color: 'black', backgroundColor: 'transparent', border: '1px solid #ccc'
        }}
      />
    );
  }
  
  
