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
    'a-1': [372, 846, 698, 1075],
    'a-2': [344, 619, 464, 710],
    'a-3': [368, 487, 329, 461],
    'b-1': [1686, 1919, 546, 1001],
    'b-2': [1436, 1682, 526, 727],
    'b-3': [1228, 1465, 411, 592],
    'b-4': [1102, 1298, 380, 514],
    'b-5': [970, 1171, 335, 468],
    'b-6': [877, 1056, 325, 428],
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
    cv2.putText(frame, (date_str2 + " " + time_str), (width // 2 - 100, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0,0,0),2)

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
                cv2.putText(frame, f'Spot: {max_spot}', (x + w//2, y), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (50, 205, 250), 2)

                # Add box and spot to data list for this image
                lot_data[input_file].append({
                    'box': [x, y, w, h],
                    'spot': max_spot,
                })

                # If the spot was already occupied, add the time difference to 'occupied_time'
                if overparking[max_spot] is not None:
                    occupied_time[max_spot] += (datetime_obj - overparking[max_spot]).total_seconds() / 60  # Convert to minutes

                # Update 'overparking' dictionary
                overparking[max_spot] = datetime_obj

    # Write occupied and unoccupied spots
    y_offset = 40
    overparking_spots = []
    for i, spot in enumerate(parking_spots.keys()):
        column_offset = width // 2 * (i % 2)
        row_offset = (i // 2) * 30
        if spot in occupied_spots:
            cv2.putText(frame, f'{spot} Occupied', (10 + column_offset, height - y_offset - row_offset), cv2.FONT_HERSHEY_SIMPLEX, 1, (0,0,0), 2)

            # Check if a spot has been occupied for too long
            if overparking[spot] is not None and (datetime_obj - overparking[spot]).total_seconds() / 3600 > overparking_limit:
                overparking_spots.append(spot)
        else:
            cv2.putText(frame, f'{spot} Free', (10 + column_offset, height - y_offset - row_offset), cv2.FONT_HERSHEY_SIMPLEX, 1, (0,0,0), 2)
            # If a spot is unoccupied in the current image, it should not be considered as occupied in the next image
            overparking[spot] = None

    # Write potential overparking spots
    if overparking_spots:
        print(overparking_spots)
        cv2.putText(frame, "Potential Overparking:", (10, height - 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0,0,0), 2)
        for i, spot in enumerate(overparking_spots):
            cv2.putText(frame, spot, (10, height - i * 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0,0,0), 2)

    # Save the output image
    cv2.imwrite(output_folder + input_file, frame)

# Print the total occupied time for each spot
for spot, time in occupied_time.items():
    print(f'Spot {spot} was occupied for a total of {int(time)} minutes')

# Write lot data to file
with open(output_folder + 'lot_data.json', 'w') as f:
    json.dump(lot_data, f)
