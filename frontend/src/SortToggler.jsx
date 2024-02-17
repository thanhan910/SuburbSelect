import React, { useContext } from 'react';

import { TableSortContext } from './TableSortContext';

export default function SortToggler() {

  const { handleSort } = useContext(TableSortContext);

  return (
    <select name="suburb" id="suburb" onChange={(e) => handleSort(e.target.value)}>
      <option value="selected">Sort by Selected</option>
      <option value="name">Sort by Name</option>
      <option value="postcode">Sort by Postcode</option>
    </select>
  );
}

