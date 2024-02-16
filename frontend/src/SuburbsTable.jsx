import React from 'react';

function SuburbsTable({ suburbs, selectedSuburbs, postcodeData, toggleSuburbSelection, searchQuery }) {
  let filteredSuburbs = suburbs.filter((suburb) => {
    if (searchQuery === '') return true;
    searchQuery = searchQuery.toLowerCase();
    const suburb_name = suburb.properties.vic_loca_2;
    const postcode = postcodeData[`${suburb_name},VIC`];
    if (postcode === undefined) console.log(suburb_name, postcodeData, postcodeData[`${suburb_name},VIC`] === undefined);
    if (suburb_name.toLowerCase().includes(searchQuery)) return true;
    if (postcode && postcode.includes(searchQuery)) return true;
  }
  );
  // Put selected suburbs at the top of the list
  filteredSuburbs.sort((a, b) => {
    if (selectedSuburbs.includes(a.properties.vic_loca_2)) return -1;
    if (selectedSuburbs.includes(b.properties.vic_loca_2)) return 1;
    return a.properties.vic_loca_2.localeCompare(b.properties.vic_loca_2);
  });

  return (
    <div className="suburbs-table">
      {filteredSuburbs.map((suburb, index) => {
        const suburb_name = suburb.properties.vic_loca_2;
        const postcode = postcodeData[`${suburb_name},VIC`];
        return (
        <div 
          key={index}
          onClick={() => toggleSuburbSelection(suburb_name)}
          style={{
            backgroundColor: selectedSuburbs.includes(suburb_name) ? '#ff780050' : 'transparent',
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
