import React, { useState, useContext } from 'react';

import { AppContext } from './AppContext';
import { TableSortContext } from './TableSortContext';

function SuburbsTable() {

  const { suburbs, suburbSelected, postcodeData, toggleSuburbSelection, searchQuery } = useContext(AppContext);

  const { sortSuburbs } = useContext(TableSortContext);

  // Filter the suburbs based on the search query
  const searchedSuburbs = suburbs.map((suburb, index) => [suburb, index]).filter((suburb) => {
      
    if (searchQuery === '') return true;
      
    searchQuery = searchQuery.toLowerCase();
    const suburb_name = suburb[0].properties.vic_loca_2;
    const postcode = postcodeData[suburb[1]];

    if (suburb_name.toLowerCase().includes(searchQuery)) return true;
    if (postcode && postcode.includes(searchQuery)) return true;
  });

  return (
    <div className="suburbs-table">
      {sortSuburbs(searchedSuburbs).map((suburb, index) => {
        const suburb_name = suburb[0].properties.vic_loca_2;
        const suburb_id = suburb[1];
        const postcode = postcodeData[suburb[1]];
        const selected = suburbSelected[suburb[1]];
        return (
        <div 
          key={index}
          onClick={() => toggleSuburbSelection(suburb_id)}
          style={{
            backgroundColor: selected ? '#ff780050' : 'transparent',
            padding: '10px',
            cursor: 'pointer',
          }}
        >
          {suburb_name} {postcode}
        </div>
      )})}
    </div>
  );
}

export default SuburbsTable;
