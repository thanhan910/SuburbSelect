import React from 'react';

function SuburbsTable({ suburbs, selectedSuburbs, postcodeData, toggleSuburbSelection }) {
  console.log(postcodeData);
  return (
    <div className="suburbs-table">
      {suburbs.map((suburb, index) => (
        <div key={index}>
          <input
            type="checkbox"
            checked={selectedSuburbs.has(suburb.properties.vic_loca_2)}
            onChange={() => toggleSuburbSelection(suburb.properties.vic_loca_2)}
          />
          {suburb.properties.vic_loca_2} {postcodeData[`${suburb.properties.vic_loca_2},VIC`]}
        </div>
      ))}
    </div>
  );
}

export default SuburbsTable;
