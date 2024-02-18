# Combine states geojson files into one, and fill in missing postcodes data from postcodes csv files
# Output: suburbs.geojson

import pandas as pd
import geopandas as gpd

ALL_STATES = ['ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA']

# Load postcodes data
df_postcodes_1 = pd.read_csv('data/postcodes/australian_postcodes.csv', dtype={'locality': str, 'state': str, 'postcode': str})
df_postcodes_2 = pd.read_csv('data/postcodes/postcode-dataout.txt', header=None, names=['suburb', 'state', 'postcode'], dtype={'suburb': str, 'state': str, 'postcode': str})

# Clean postcodes data
df_postcodes_1.rename(columns={'locality': 'name'}, inplace=True)
df_postcodes_2.rename(columns={'suburb': 'name'}, inplace=True)
df_postcodes_1['name'] = df_postcodes_1['name'].str.upper()
df_postcodes_1['state'] = df_postcodes_1['state'].str.upper()
df_postcodes_2['name'] = df_postcodes_2['name'].str.upper()
df_postcodes_2['state'] = df_postcodes_2['state'].str.upper()

# Load states geojson files
gdfs_states = []
for state in ALL_STATES:
    
    state_lower = state.lower()
    
    gdf_state : gpd.GeoDataFrame = gpd.read_file(f'data/geojson/suburb-10-{state_lower}.geojson')
    
    new_column_names = {}
    for old_column in gdf_state.columns:
        old_column : str
        column = old_column
        column = column.replace(f'{state_lower}_', '')
        column = column.replace(f'loca_', 'local_')
        column = column.replace(f'localit', 'locali')
        column = column.replace(f'locali', 'locality')
        new_column_names[old_column] = column

    gdf_state['state'] = state

    gdf_state = gdf_state.rename(columns=new_column_names).to_crs('EPSG:4326')
    
    gdfs_states.append(gdf_state)

# Combine states geojson files into one
gdf = gpd.GeoDataFrame(pd.concat(gdfs_states, ignore_index=True))


# Full N/A: local_1 local_3 local_6
# No N/A: local_2 local_5 local_7
# Some N/A: local_4
# loc_pid is not unique
# lc_ply_pid is not unique
# id is unique

gdf.rename(columns={'locality': 'dt_locality', 'local_2' : 'name', 'local_4' : 'postcode'}, inplace=True)
gdf = gdf[['name', 'state', 'postcode', 'local_5', 'lc_ply_pid', 'loc_pid', 'dt_create', 'dt_locality', 'id', 'geometry']]


# Fill in missing postcodes data from postcodes csv files

df_postcodes_1['type'].fillna('', inplace=True)
dfpc1 = df_postcodes_1[df_postcodes_1['type'].isin(['Delivery Area'])][['name', 'state', 'postcode']].groupby(['name', 'state'])['postcode'].apply(lambda x: ', '.join(x)).reset_index()
dfpc2 = df_postcodes_1[df_postcodes_1['type'].isin(['Delivery Area', ''])][['name', 'state', 'postcode']].groupby(['name', 'state'])['postcode'].apply(lambda x: ', '.join(x)).reset_index()
dfpc3 = df_postcodes_1[df_postcodes_1['type'].isin(['Delivery Area', '', 'Post Office Boxes'])][['name', 'state', 'postcode']].groupby(['name', 'state'])['postcode'].apply(lambda x: ', '.join(x)).reset_index()
dfpc4 = df_postcodes_1[['name', 'state', 'postcode']].groupby(['name', 'state'])['postcode'].apply(lambda x: ', '.join(x)).reset_index()
dfpc5 = df_postcodes_2.dropna()[['name', 'state', 'postcode']].groupby(['name', 'state'])['postcode'].apply(lambda x: ', '.join(x)).reset_index()

dfpcs = [dfpc1, dfpc2, dfpc3, dfpc4, dfpc5]

for dfpc in dfpcs:
    gdf = pd.merge(gdf, dfpc, on=['name', 'state'], how='left', suffixes=('', '_1'))
    gdf['postcode'].fillna(gdf['postcode_1'], inplace=True)
    gdf.drop(columns='postcode_1', inplace=True)


gdf = gpd.GeoDataFrame(gdf, geometry='geometry')

gdf.to_file('suburbs.geojson', driver='GeoJSON')


