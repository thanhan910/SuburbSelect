import React from 'react';

function SuburbsTable({ suburbs, selectedSuburbs, toggleSuburbSelection }) {
  return (
    <div className="suburbs-table">
      {suburbs.map((suburb, index) => (
        <div key={index}>
          <input
            type="checkbox"
            checked={selectedSuburbs.has(suburb.properties.vic_loca_2)}
            onChange={() => toggleSuburbSelection(suburb.properties.vic_loca_2)}
          />
          {suburb.properties.vic_loca_2}
        </div>
      ))}
    </div>
  );
}

export default SuburbsTable;
