import os
import sys
import requests

url = "http://localhost:8000/lots/upload_image/"

payload = {
    "passcode": "lightsecurity"
}

try:
    folder_path = sys.argv[1]

    if not os.path.isdir(folder_path):
        print("Invalid folder path.")
        sys.exit(1)

    image_files = os.listdir(folder_path)

    for image_filename in image_files:
        file_path = os.path.join(folder_path, image_filename)
        files = {
            "image": open(file_path, "rb")
        }

        response = requests.post(url, data=payload, files=files)

        print("Response for", image_filename)
        print("Response status code:", response.status_code)
        print("Response content:", response.json())
        print()

except IndexError:
    print("Please provide the folder path as a command line argument.")
