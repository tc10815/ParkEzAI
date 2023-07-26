import sys
import requests

#url = "https://backend.plan6.com/lots/upload_image/"  
url = "http://127.0.0.1:8000/lots/upload_image/"  

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
