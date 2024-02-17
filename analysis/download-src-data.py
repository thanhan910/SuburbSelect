import os
import json
import requests
import pandas as pd
import geopandas as gpd

def save_to_json(data, output_file):
    """
    Saves a dictionary to a JSON file.

    Args:
        data (dict): The data to be saved.
        output_file (str): The path to the output JSON file.
    """
    with open(output_file, 'w') as file:
        json.dump(data, file)

def download_file(url, output_folder, output_filename):
    """
    Downloads a file from the internet.

    Args:
        url (str): The URL of the file to be downloaded.
        output_file (str): The path to the output file.
    """
    response = requests.get(url)

    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    output_filepath = os.path.join(output_folder, output_filename)

    with open(output_filepath, 'wb') as file:
        file.write(response.content)

def transform_geojson(geojson_file: str, postcode_file: str, output_geojson_file: str):

    df = pd.read_csv(postcode_file, header=None, names=['suburb', 'state', 'postcode'], dtype={'suburb': str, 'state': str, 'postcode': str})
    
    gdf = gpd.read_file(geojson_file)

    df_add = pd.DataFrame({'suburb': ['AINTREE', 'BONNIE BROOK', 'CREEK VIEW', 'THORNHILL PARK'], 'state': ['VIC', 'VIC', 'VIC', 'VIC'], 'postcode': ['3336', '3335', '3551', '3335']})
    
    df = pd.concat([df, df_add])

    dfx = df.dropna(subset=['postcode']).groupby(['suburb', 'state'])['postcode'].apply(lambda x: ', '.join(x)).reset_index()
    dfx = dfx[dfx['state'] == 'VIC']
    gdfx = pd.merge(gdf, dfx, left_on='vic_loca_2', right_on='suburb', how='left')
    gdfx['vic_loca_4'].fillna(gdfx['postcode'], inplace=True)

    gdfx['name'] = gdfx['vic_loca_2']
    gdfx['postcode'] = gdfx['vic_loca_4']
    gdfx['id'] = gdfx['loc_pid']

    gdfx = gdfx[['id', 'name', 'postcode', 'geometry']]

    gdfx.to_file(output_geojson_file, driver='GeoJSON')


if __name__ == '__main__':
    # Data sources: 
    # - https://github.com/tonywr71/GeoJson-Data
    # - https://www.matthewproctor.com/australian_postcodes

    # Download geojson files
    base_url = 'https://raw.githubusercontent.com/tonywr71/GeoJson-Data/master'
    states = ['act', 'nsw', 'nt', 'qld', 'sa', 'tas', 'vic', 'wa']
    for state in states:
        download_file(f'{base_url}/suburb-10-{state}.geojson', 'data/geojson', f'suburb-10-{state}.geojson')

    # Download postcode data
    download_file(f'{base_url}/postcode-dataout.txt', 'data/postcodes', 'postcode-dataout.txt')
    
    # Download postcode data from https://www.matthewproctor.com/australian_postcodes
    download_file('https://www.matthewproctor.com/Content/postcodes/australian_postcodes.csv', 'data/postcodes', 'australian_postcodes.csv')