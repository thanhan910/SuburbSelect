// Initialize the map
var map = L.map('mapid').setView([-37.8136, 144.9631], 10); // Example center: Melbourne, VIC

// Add OpenStreetMap tiles to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Function to load GeoJSON file
async function loadGeoJson(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

// Placeholder for selected IDs
let selectedSuburbs = [];


let suburbPostcodes = {};

fetch('postcode-data.json')
  .then(response => response.json())
  .then(data => {
    suburbPostcodes = data;
    // Now suburbPostcodes is populated, proceed to load and handle the GeoJSON
  });


var tableBody = document.getElementById('suburbTable').getElementsByTagName('tbody')[0];



// When adding the GeoJSON to the map, include the onEachFeature option
loadGeoJson('suburb-10-vic.geojson').then(data => {
  // Sort the suburbs by name
  data.features.sort((a, b) => a.properties.vic_loca_2.localeCompare(b.properties.vic_loca_2));

  // Add the suburbs to the table
  data.features.forEach(feature => {
    const row = tableBody.insertRow();
    const nameCell = row.insertCell(0);
    const checkCell = row.insertCell(1);
    const suburbKey = `${feature.properties.vic_loca_2.toUpperCase()},VIC`; // Ensure matching format
    const postcode = suburbPostcodes[suburbKey];
    nameCell.innerHTML = `${feature.properties.vic_loca_2} ${postcode}`
    checkCell.innerHTML = `<input type="checkbox" id="suburbCheckbox_${feature.properties.loc_pid}" />`;

    // Add event listener to the checkbox
    document.querySelector(`#suburbCheckbox_${feature.properties.loc_pid}`).addEventListener('change', function () {
      if (this.checked) {
        tableBody.prepend(row); // Move row to the top
      } else {
        tableBody.appendChild(row); // Move row to its original position or to the bottom
      }
    });
  });

  var geoJsonLayer = L.geoJson(data, {
    style: function (feature) {
      return {
        weight: 1,
        opacity: 1,
        color: 'black',
        fillOpacity: 0
      };
    },
    onEachFeature: function (feature, layer) {
      if (feature.properties) {
        // Attempt to find the postcode for the suburb
        const suburbKey = `${feature.properties.vic_loca_2.toUpperCase()},VIC`; // Ensure matching format
        const postcode = suburbPostcodes[suburbKey];
    
        const info = `Suburb: ${feature.properties.vic_loca_2}<br>
                      Postcode: ${postcode || 'Not available'}<br>`;
    
        layer.bindTooltip(info, { permanent: false, direction: 'auto' });
    
        layer.on({
          mouseover: function (e) {
            var layer = e.target;
            if (!selectedSuburbs.includes(feature.properties.vic_loca_2)) {
              layer.setStyle({
                fillOpacity: 0.2
              });
            }
            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
              layer.bringToFront();
            }
            layer.openTooltip(); // Open the tooltip on hover
          },
          mouseout: function (e) {
            // Reset the layer style to default when not hovering
            if (!selectedSuburbs.includes(feature.properties.vic_loca_2)) {
              geoJsonLayer.resetStyle(e.target);
            }
            
            e.target.closeTooltip(); // Close the tooltip when the mouse leaves
          },
          click: function (e) {
            // Toggle selection
            if (selectedSuburbs.includes(feature.properties.vic_loca_2)) {
              selectedSuburbs = selectedSuburbs.filter(id => id !== feature.properties.vic_loca_2);
              layer.setStyle({ 
                fillColor: '' 
              }); // Deselect style
              console.log(layer);
            } else {
              selectedSuburbs.push(feature.properties.vic_loca_2);
              layer.setStyle({ 
                fillColor: '#ff7800',
                fillOpacity: 0.5
              }); // Select style
            }

            const checkbox = document.querySelector(`#suburbCheckbox_${feature.properties.loc_pid}`);

            if (checkbox) {
              checkbox.checked = !checkbox.checked;
            }

            const row = document.querySelector(`#suburbCheckbox_${feature.properties.loc_pid}`).parentNode.parentNode;
            if (checkbox.checked) {
              tableBody.prepend(row); // Move row to the top
            } else {
              tableBody.appendChild(row); // Move row to its original position or to the bottom
            }
          }
        });
      }
    }
  }).addTo(map);
});



// Download Selected IDs
document.getElementById('download').addEventListener('click', function () {
  // Add postcode to the selected suburbs
  const content = selectedSuburbs.map(suburb => {
    const suburbKey = `${suburb.toUpperCase()},VIC`; // Ensure matching format
    const postcode = suburbPostcodes[suburbKey];
    return `${suburbKey},${postcode || 'N/A'}`;
  });
  const text = content.join('\n');
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', 'selected-suburbs.txt');

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
});
