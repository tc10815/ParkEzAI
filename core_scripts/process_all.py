import cv2
import numpy as np
import os
import json
from datetime import datetime

# Load Yolo
net = cv2.dnn.readNet("../../ml_data/yolov3.weights", "../../ml_data/yolov3.cfg")
layer_names = net.getLayerNames()
output_layers = [layer_names[i - 1] for i in net.getUnconnectedOutLayers().flatten()]

# List all files in the input directory
input_folder = './examples/coldwater_mi/'
output_folder = './examples/output/'
input_files = sorted([f for f in os.listdir(input_folder) if os.path.isfile(os.path.join(input_folder, f))])

# Define parking spots
parking_spots = {
    'A1': [372, 846, 698, 1075],
    'A2': [344, 619, 464, 710],
    'A3': [368, 487, 329, 461],
    'B1': [1686, 1919, 546, 1001],
    'B2': [1436, 1682, 526, 727],
    'B3': [1228, 1465, 411, 592],
    'B4': [1102, 1298, 380, 514],
    'B5': [970, 1171, 335, 468],
    'B6': [877, 1056, 325, 428],
}

# Minimum intersection area to be considered as parked in the spot
min_intersection = 0.5

# Define the overparking limit in hours
overparking_limit = 1

# Initialize the 'overparking' dictionary to store when each spot was last seen occupied
overparking = {spot: None for spot in parking_spots.keys()}

# Initialize the 'occupied_time' dictionary to store total occupied time for each spot
occupied_time = {spot: 0 for spot in parking_spots.keys()}

# Calculate intersection of two rectangles
def calculate_intersection(x1, y1, w1, h1, x2, y2, w2, h2):
    x_overlap = max(0, min(x1 + w1, x2 + w2) - max(x1, x2))
    y_overlap = max(0, min(y1 + h1, y2 + h2) - max(y1, y2))
    return x_overlap * y_overlap

# Initialize lot data dictionary
lot_data = {}

# Process each image
for input_file in input_files:
    # Load image
    frame = cv2.imread(input_folder + input_file)
    height, width, channels = frame.shape

    print('\nFilename: ' + input_file)
    # Add white space at the bottom
    bottom_padding = int(height * 0.3)
    frame = cv2.copyMakeBorder(frame, 0, bottom_padding, 0, 0, cv2.BORDER_CONSTANT, value=[255, 255, 255])
    height, width, channels = frame.shape

    # Initialize data list for this image
    lot_data[input_file] = []

    # Extract date and time from the filename and add to the image
    date_str = input_file[12:16] + "-" + input_file[16:18] + "-" + input_file[18:20]
    date_str2 =   input_file[16:18] + "-" + input_file[18:20] + "-" + input_file[12:16]
    time_str = input_file[20:22] + ":" + input_file[22:24]
    datetime_str = date_str + " " + time_str
    cv2.rectangle(frame, (width // 2 - 300, 0), (width // 2 + 350, 50+10), (255,255,255), -1)
    cv2.putText(frame, (date_str2 + " " + time_str), (width // 2 - 300, 50), cv2.FONT_HERSHEY_SIMPLEX, 2, (0,0,0),3)

    datetime_obj = datetime.strptime(datetime_str, '%Y-%m-%d %H:%M')

    # Detecting objects
    blob = cv2.dnn.blobFromImage(frame, 0.00392, (416, 416), (0, 0, 0), True, crop=False)
    net.setInput(blob)
    outs = net.forward(output_layers)

    class_ids = []
    confidences = []
    boxes = []

    # Loop through detections and if a car, truck or motorcycle, save its box
    for out in outs:
        for detection in out:
            scores = detection[5:]
            class_id = np.argmax(scores)
            confidence = scores[class_id]
            if confidence > 0.1 and class_id in [2, 7, 3]:  # 2 is for 'car', 7 for 'truck', 3 for 'motorcycle' in COCO dataset
                center_x = int(detection[0] * width)
                center_y = int(detection[1] * height)
                w = int(detection[2] * width)
                h = int(detection[3] * height)

                x = int(center_x - w / 2)
                y = int(center_y - h / 2)

                boxes.append([x, y, w, h])
                confidences.append(float(confidence))
                class_ids.append(class_id)

    indexes = cv2.dnn.NMSBoxes(boxes, confidences, 0.5, 0.4)

    # Occupied parking spots for this image
    occupied_spots = []

    # Draw bounding boxes and labels on the image
    for i in range(len(boxes)):
        if i in indexes:
            x, y, w, h = boxes[i]
            label = str(class_ids[i])
            cv2.rectangle(frame, (x, y), (x + w, y + h), (0,255,0), 2)

            # Determine which parking spot the vehicle is in
            max_intersection = 0
            max_spot = None
            for spot, (x_spot, x_spot_w, y_spot, y_spot_h) in parking_spots.items():
                intersection = calculate_intersection(x, y, w, h, x_spot, y_spot, x_spot_w-x_spot, y_spot_h-y_spot)
                if intersection > max_intersection:
                    max_intersection = intersection
                    max_spot = spot

            if max_spot is not None and max_intersection >= min_intersection * w * h:
                occupied_spots.append(max_spot)
                cv2.putText(frame, f'Spot {max_spot}', (x + w//3, y), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255, 255, 256), 2)

                # Add box and spot to data list for this image
                lot_data[input_file].append({
                    'box': [x, y, w, h],
                    'spot': max_spot,
                })
    # # Write occupied and unoccupied spots
    # y_offset = 200
    # num_spots = len(parking_spots)
    # spots_per_column = 5
    # x_offset = 50
    # col_dist = 250

    # for i, spot in enumerate(reversed(list(parking_spots.keys()))):
    #     # Increase the divisor to 4 for 4 columns and multiply the offset by 3 to position the columns further apart
    #     column_offset = ((i // spots_per_column) * col_dist) - x_offset
    #     row_offset = (i % spots_per_column) * 50
    #     print('\n Spot ' + str(spot))
    #     if spot in occupied_spots:
    #         cv2.putText(frame, f'{spot} Occupied', (10 + column_offset, height - y_offset - row_offset), cv2.FONT_HERSHEY_SIMPLEX, 1.3, (0,0,0), 2)
    #     else:
    #         cv2.putText(frame, f'{spot} Free', (10 + column_offset, height - y_offset - row_offset), cv2.FONT_HERSHEY_SIMPLEX, 1.3, (0,0,0), 2)

    # # Save the output image
    # cv2.imwrite(output_folder + input_file, frame)

    # Write occupied and unoccupied spots
    num_spots = len(parking_spots)
    spots_per_column = 5
    space_between_rows = 50
    space_between_columns = 400

    for i, spot in enumerate(parking_spots.keys()):
        spot_status = "Free"
        if spot in occupied_spots:
            spot_status = 'Occupied'

        occupied_height = round(height * 0.8) + ((i % spots_per_column) * space_between_rows)
        occupied_width = 100 + ((i // spots_per_column) * space_between_columns)

        cv2.putText(frame, f'{spot} {spot_status}', (occupied_width, occupied_height), cv2.FONT_HERSHEY_SIMPLEX, 1.3, (0,0,0), 3)

    # Save the output image
    cv2.imwrite(output_folder + input_file, frame)



# Write lot data to file
with open(output_folder + 'lot_data.json', 'w') as f:
    json.dump(lot_data, f)
