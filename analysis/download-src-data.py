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

def download_file(url, output_file):
    """
    Downloads a file from the internet.

    Args:
        url (str): The URL of the file to be downloaded.
        output_file (str): The path to the output file.
    """
    response = requests.get(url)
    with open(output_file, 'wb') as file:
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
    # Download a geojson file from the internet
    download_file('https://raw.githubusercontent.com/tonywr71/GeoJson-Data/master/suburb-10-vic.geojson', 'suburb-10-vic.geojson')

    # Parse the postcode data
    download_file('https://raw.githubusercontent.com/tonywr71/GeoJson-Data/master/postcode-dataout.txt', 'postcode-dataout.txt')

    # Transform the geojson file
    transform_geojson('suburb-10-vic.geojson', 'postcode-dataout.txt', 'suburbs-vic.geojson')