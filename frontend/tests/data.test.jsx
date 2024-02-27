import fs from 'fs';

// Test that data syntax is correct

test('GeoJSON file has properties', () => {
  // Read the GeoJSON file
  const geojson = JSON.parse(fs.readFileSync('public/suburbs-greater-melbourne.geojson', 'utf8'));

  // Loop through each feature in the GeoJSON
  geojson.features.forEach(feature => {
    expect(feature.properties.suburb).toBeDefined();
  });
});


test('GeoJSON file has properties.postcode', () => {
  // Read the GeoJSON file
  const geojson = JSON.parse(fs.readFileSync('public/suburbs-greater-melbourne.geojson', 'utf8'));

  // Loop through each feature in the GeoJSON
  geojson.features.forEach(feature => {
    expect(feature.properties.postcode).toBeDefined();
  });
});