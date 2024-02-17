import React, { useEffect, useContext } from "react";
import { MapContainer, TileLayer, GeoJSON, Tooltip, useMap  } from 'react-leaflet';

import { AppContext } from './AppContext';

import 'leaflet/dist/leaflet.css';

function MapFocus({ center, bounds }) {
  const map = useMap();
  useEffect(() => {
    if (center && bounds) {
      // Fly to the center of the bounds
      map.flyTo(center, map.getZoom(), {
        animate: true,
        duration: 0.5 // Animation duration in seconds
      });

      // After a delay, fit the map to the bounds
      // This delay allows the flyTo animation to complete before fitting to bounds

      // Only fit bounds if the map is smaller than the bounds, or if the bounds are not visible

      // const mapBounds = map.getBounds();
      // if (!mapBounds.contains(bounds) || !mapBounds.intersects(bounds)) {
      //   bounds = L.latLngBounds(mapBounds.getSouthWest(), mapBounds.getNorthEast()).extend(bounds.getSouthWest()).extend(bounds.getNorthEast());
      // }
      setTimeout(() => {
        map.fitBounds(bounds, {
          animate: true,
          padding: [200, 200] // Adjust padding to ensure the bounds fit well within the view
        });
      }, 500); // Delay in milliseconds, adjust based on the duration of flyTo
      
    }
  }, [center, bounds, map]);

  return null;
}

export default function SuburbsMap() {
  const { suburbs, setSuburbs, toggleSuburbSelection, mapFocus } = useContext(AppContext);

  return (
    <MapContainer center={[-37.8136, 144.9631]} zoom={12} style={{ height: "100vh", width: "100%", float: "right" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {suburbs.map((suburb, index) => (
        // Make the suburb color change to green when hovered over
        <GeoJSON
          key={index}
          data={suburb}
          eventHandlers={{
            mouseover: (e) => {
              e.target.setStyle({
                weight: 3,
              });
              // suburb.status.hovered = true;
              // setSuburbs([...suburbs]);
            },
            mouseout: (e) => {
              e.target.setStyle({
                weight: 1,
              });
              // suburb.status.hovered = false;
              // setSuburbs([...suburbs]);
            },
            click: () => toggleSuburbSelection(index, false),
          }}
          style={() => {
            const selected = suburb.status.selected;
            const hovered = suburb.status.hovered;
            return ({
              weight: hovered ? 3 : 1,
              color: "#000000",
              fillColor: selected ? "#ff7800" : "#000000",
              fillOpacity: selected ? 0.5 : 0,
            })
          }}
        >
          <Tooltip>
            {suburb.properties.name}{suburb.properties.postcode ? `, ${suburb.properties.postcode}` : ''}
          </Tooltip>
        </GeoJSON>
      ))}
      {/* Conditional rendering to focus map */}
      {mapFocus && <MapFocus center={mapFocus.center} bounds={mapFocus.bounds} />}
    </MapContainer>
  );
}