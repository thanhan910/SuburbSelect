import React, { useState, useEffect, useContext } from 'react';

import { AppContext } from './AppContext';
import SearchBar from './SearchBar';
import SuburbsTable from './SuburbsTable';
import FilesTable from './FilesTable';
import { downloadSelectedSuburbsAndPostcodes } from './utils';
import { TableSortContextProvider } from './TableSortContext';
import SortToggler from './SortToggler';

export default function SideBar() {
  const { suburbs, resetSuburbSelection } = useContext(AppContext);
  const [upperlAreaHeight, setUpperAreaHeight] = useState(50); // Percentage
  const [isDragging, setIsDragging] = useState(false);
  const [initialMouseY, setInitialMouseY] = useState(null);
  const [initialHeight, setInitialHeight] = useState(null);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setInitialMouseY(e.clientY);
    setInitialHeight(upperlAreaHeight);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || initialMouseY === null || initialHeight === null) return;

      const sidebar = document.querySelector('.sidebar');
      if (!sidebar) return;

      const sidebarRect = sidebar.getBoundingClientRect();
      const sidebarHeight = sidebarRect.height;
      
      // Calculate the position relative to sidebar top (accounting for header buttons and search bar ~80px)
      const headerHeight = 80;
      const availableHeight = sidebarHeight - headerHeight;
      
      // Calculate delta from initial click
      const deltaY = e.clientY - initialMouseY;
      const deltaPercentage = (deltaY / availableHeight) * 100;
      
      const newPercentage = Math.max(20, Math.min(80, initialHeight + deltaPercentage));
      
      setUpperAreaHeight(newPercentage);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setInitialMouseY(null);
      setInitialHeight(null);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, initialMouseY, initialHeight]);

  return (
    <div className="sidebar">
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button 
          onClick={() => downloadSelectedSuburbsAndPostcodes(suburbs)}
          title='Download selected suburbs and postcodes as a CSV file.'
        >
          Download
        </button>
        <button 
          onClick={resetSuburbSelection}
          title='Clear selected suburbs.'
        >
          Clear
        </button>
      </div>
      <SearchBar />
      <TableSortContextProvider>
        <SortToggler />
        <div style={{ height: `${upperlAreaHeight}%` }}>
          <SuburbsTable />
        </div>
        <div
          className="resize-dragbar"
          onMouseDown={handleMouseDown}
          style={{ cursor: isDragging ? 'row-resize' : 'grab' }}
        />
        <div style={{ height: `${100 - upperlAreaHeight}%` }}>
          <FilesTable />
        </div>
      </TableSortContextProvider>
    </div>
  );
}