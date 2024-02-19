# Suburb Select

A website that allows the user to select a number of suburbs or areas on a map.

Allows searching for suburbs, searching for multiple suburbs by postcode, searching nearby suburbs, downloading a list of selected suburbs.

Currently this website mainly help explore Australian suburbs and local government areas, however, it can be easily extended to support exploration of other areas around the world.

## Data sources

- Australian Statistical Geography Standard (ASGS) Edition 3
    - https://www.abs.gov.au/statistics/standards/australian-statistical-geography-standard-asgs-edition-3/jul2021-jun2026

- Digital boundary files:
    - https://www.abs.gov.au/statistics/standards/australian-statistical-geography-standard-asgs-edition-3/jul2021-jun2026/access-and-downloads/digital-boundary-files
        - Suburbs boundary files can be found at: Non ABS Structures > Suburbs and Localities
        - Local Government Areas boundary files can be found at: Non ABS Structures > Local Government Areas
        - Postcodes boundary files can be found at: Non ABS Structures > Postal Areas

- ABS Maps:
    - https://maps.abs.gov.au/
    - https://www.abs.gov.au/statistics/standards/australian-statistical-geography-standard-asgs-edition-3/jul2021-jun2026/access-and-downloads/abs-maps

- Suburbs, Postcodes, Local Government Area boundaries:
    - Tony Wright's dataset of suburbs' GeoJSON and postcodes: https://github.com/tonywr71/GeoJson-Data

- Postcodes: 
    - Australia Post's Postcode Finder: https://auspost.com.au/postcode
    - Matthew Proctor's Postcodes dataset: https://www.matthewproctor.com/australian_postcodes

## Alternative applications and inspiration

There are a number of applications that serves similar purposes to this website where you can look at. Some of them are:

- Australian Bureau of Statistics's ABS Maps: https://maps.abs.gov.au/
- Australia Post's Postcode Finder: https://auspost.com.au/postcode
- Melbourne Suburbs Map: https://www.reddit.com/r/melbourne/comments/1tojmn/melbourne_suburbs_map/

## Installation of React frontend

Navigate to the folder containing the React project (currently, "frontend"), then run:

```bash
npm install
```
to install the required NPM packages.

## Deploy React frontend

### Development environment

```bash
npm run dev
```

### Build the website

```bash
npm run build
```

### Deploy to GitHub pages

```bash
npm run deploy
```

The frontend is also automatically deployed to GitHub pages using GitHub Actions when a new release is created.