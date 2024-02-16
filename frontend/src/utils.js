/**
 * Generates a CSV string from the given data.
 * @param {Array} data - Array of objects representing the rows.
 * @param {Array} headers - Array of strings representing the column headers.
 * @returns {string} The generated CSV string.
 */
const generateCSVString = (data, headers) => {
  const csvRows = [headers.join(','), ...data.map(row => headers.map(fieldName => JSON.stringify(row[fieldName])).join(','))];
  return csvRows.join('\r\n');
};

/**
 * Triggers the download of a file with the given content.
 * @param {string} content - The content of the file.
 * @param {string} fileName - The name of the file to save.
 */
const triggerDownload = (content, fileName) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Prepares and triggers the download of the selected suburbs and their postcodes.
 * @param {Set} selectedSuburbs - A set of selected suburb names.
 * @param {Object} postcodeData - An object mapping "suburb name,state code" to its postcode.
 */
export const downloadSelectedSuburbsAndPostcodes = (suburbs, postcodeData, suburbSelected) => {
  const headers = ['suburb', 'postcode'];
  const data = suburbs.forEach((suburbName, index) => {
    if (suburbSelected[index]) {
      const postcode = postcodeData[`${suburbName},VIC`] || 'Unknown';
      return { suburb: suburbName, postcode: postcode };
    }
  });

  const csvString = generateCSVString(data, headers);
  triggerDownload(csvString, 'selected-suburbs-and-postcodes.csv');
};
