import React, { useState, useContext } from 'react';

import { AppContext } from './AppContext';
import { TableSortContext } from './TableSortContext';

function FilesTable() {

  const { files, setFiles, toggleFileDisplayed, toggleSelectableFile } = useContext(AppContext);

  return (
    <>
    <div className='table-row'>
      <input type="checkbox"/>Displayed <input type="radio" />Selectable
    </div>
      <div className="files-table">

        {files.map((file, index) => {
          const filename = file.name;
          const filepath = file.path;
          const file_displayed = file.displayed;
          const file_selectable = file.selectable;
          return (
            <div
              className={`table-row ${file_selectable ? 'table-row-selected' : ''}`}
              key={index}
            // onClick={() => toggleFileDisplayed(index)}
            >
              <input
                type="checkbox"
                checked={file_displayed}
                onChange={() => toggleFileDisplayed(index)}
              />
              <input
                type="radio"
                checked={file_selectable}
                onChange={() => toggleSelectableFile(index)}
              />
              {filename}
            </div>
          )
        })}
      </div>
    </>
  );
}

export default FilesTable;
