import React from 'react';

function SuburbsTable({ suburbs, suburbSelected, postcodeData, toggleSuburbSelection, searchQuery }) {
  // Put selected suburbs at the top of the list. If both are selected, sort by name.
  // suburbSelected is a map of suburb index to boolean
  const suburbIndexPairs = suburbs.map((suburb, index) => [suburb, index]);

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
      {filteredSuburbs.map((suburb, index) => {
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
