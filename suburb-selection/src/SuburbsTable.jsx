import React from 'react';

function SuburbsTable({ suburbs, selectedSuburbs, toggleSuburbSelection }) {
  return (
    <div className="suburbs-table">
      {suburbs.map((suburb, index) => (
        <div key={index}>
          <input
            type="checkbox"
            checked={selectedSuburbs.has(suburb.properties.name)}
            onChange={() => toggleSuburbSelection(suburb.properties.name)}
          />
          {suburb.properties.name}
        </div>
      ))}
    </div>
  );
}

export default SuburbsTable;
