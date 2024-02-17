import React, { useState, useContext } from 'react';

import { AppContext } from './AppContext';
import { TableSortContext } from './TableSortContext';

function SuburbsTable() {

  const { suburbs, suburbSelected, postcodeData, toggleSuburbSelection, searchQuery } = useContext(AppContext);

  const { sortSuburbs } = useContext(TableSortContext);

  // Filter the suburbs based on the search query
  const searchedSuburbs = suburbs.map((suburb, index) => [suburb, index]).filter((suburb) => {
      
    if (searchQuery === '') return true;
      
    let searchQuery1 = searchQuery.toUpperCase();
    const suburb_name = suburb[0].properties.vic_loca_2;
    const postcode = postcodeData[suburb[1]];

    if (suburb_name.toUpperCase().includes(searchQuery1)) return true;
    if (postcode && postcode.includes(searchQuery1)) return true;
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
          className={`table-row ${selected ? 'table-row-selected' : ''}`}
          key={index}
          onClick={() => toggleSuburbSelection(suburb_id)}
        >
          {suburb_name} {postcode}
        </div>
      )})}
    </div>
  );
}

export default SuburbsTable;
