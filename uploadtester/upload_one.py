import sys
import requests

url = "http://localhost:8000/lots/upload_image/"  

payload = {
    "passcode": "lightsecurity"
}

try:
    image_filename = sys.argv[1]
    files = {
        "image": open(image_filename, "rb")
    }

    response = requests.post(url, data=payload, files=files)

    print("Response status code:", response.status_code)
    print("Response content:", response.json())

except IndexError:
    print("Please provide the image filename as a command line argument.")
