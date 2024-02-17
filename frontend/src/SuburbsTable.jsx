import React, { useState, useContext } from 'react';

import { AppContext } from './AppContext';

function SuburbsTable() {

  const { suburbs, suburbSelected, postcodeData, toggleSuburbSelection, searchQuery, setSearchQuery } = useContext(AppContext);

  // Put selected suburbs at the top of the list. If both are selected, sort by name.
  // suburbSelected is a map of suburb index to boolean
  const suburbIndexPairs = suburbs.map((suburb, index) => [suburb, index]);

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
        const postcodeA = postcodeData[a[1]];
        const postcodeB = postcodeData[b[1]];
        // Put suburbs without postcode at the bottom
        if (postcodeA === undefined || postcodeA === null || postcodeA === '') return 1;
        if (postcodeB === undefined || postcodeB === null || postcodeB === '') return -1;
        if (sortOrder === 'asc') {
          return postcodeA - postcodeB;
        } else {
          return postcodeB - postcodeA;
        }
      });
    } else if (sortOption === 'selected') {
      return suburbs.sort((a, b) => {
        const selectedA = suburbSelected[a[1]];
        const selectedB = suburbSelected[b[1]];
        if (selectedA === selectedB) {
          return 0;
        } else if (sortOrder === 'asc') {
          return selectedA ? -1 : 1;
        } else {
          return selectedA ? 1 : -1;
        }
      });
    } else {
      // Default sorting by suburb name
      return suburbs.sort((a, b) => {
        const suburbNameA = a[0].properties.vic_loca_2;
        const suburbNameB = b[0].properties.vic_loca_2;
        return sortOrder === 'asc' ? suburbNameA.localeCompare(suburbNameB) : suburbNameB.localeCompare(suburbNameA);
      });
    }
  };

  const sortedSuburbs = suburbIndexPairs.sort((a, b) => {
    const [suburb_a, index_a] = a;
    const [suburb_b, index_b] = b;
    if (suburbSelected[index_a] && !suburbSelected[index_b]) return -1;
    if (!suburbSelected[index_a] && suburbSelected[index_b]) return 1;
    return suburb_a.properties.vic_loca_2.localeCompare(suburb_b.properties.vic_loca_2);
  });

  // Filter the suburbs based on the search query
  const filteredSuburbs = sortedSuburbs.filter((suburb) => {
    if (searchQuery === '') return true;
    searchQuery = searchQuery.toLowerCase();
    const suburb_name = suburb[0].properties.vic_loca_2;
    const postcode = postcodeData[suburb[1]];
    if (postcode === undefined) console.log(suburb_name, postcodeData, postcodeData[suburb[1]] === undefined);
    if (suburb_name.toLowerCase().includes(searchQuery)) return true;
    if (postcode && postcode.includes(searchQuery)) return true;
  });

  return (
    <div className="suburbs-table">
      <select name="suburb" id="suburb" onChange={(e) => handleSort(e.target.value)}>
        <option value="name">Sort by Name</option>
        <option value="postcode">Sort by Postcode</option>
        <option value="selected">Sort by Selected</option>
      </select>
      {sortSuburbs(filteredSuburbs).map((suburb, index) => {
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
