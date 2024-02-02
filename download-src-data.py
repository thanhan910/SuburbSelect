import json
import requests

def parse_postcode_file(file_path):
    """
    Parses a text file containing suburb, state, and postcode information
    into a Python dictionary.

    Args:
        file_path (str): The path to the text file to be parsed.

    Returns:
        dict: A dictionary with (suburb, state) as keys and postcode as values.
    """
    postcode_dict = {}
    with open(file_path, 'r') as file:
        for line in file:
            parts = line.strip().split(',')
            if len(parts) == 3:
                suburb, state, postcode = parts
                key = f"{suburb.upper()},{state.upper()}"  # Create a unique key
                postcode_dict[key] = postcode
    return postcode_dict

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


if __name__ == '__main__':
    # Download a geojson file from the internet
    download_file('https://raw.githubusercontent.com/tonywr71/GeoJson-Data/master/suburb-10-vic.geojson', 'suburb-10-vic.geojson')

    # Parse the postcode data
    download_file('https://raw.githubusercontent.com/tonywr71/GeoJson-Data/master/postcode-dataout.txt', 'postcode-dataout.txt')
    output_file = 'postcode-data.json'
    postcode_data = parse_postcode_file('postcode-dataout.txt')

    # Save the parsed data to a JSON file
    save_to_json(postcode_data, output_file)