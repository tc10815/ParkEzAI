import cv2
import numpy as np
import os
import json
from datetime import datetime

def process_time(filename):
    date_str = filename.split('_')[1].split('.jpg')[0]
    ret = {}
    ret['year'] = int(date_str[0:4])
    ret['month'] = int(date_str[4:6])
    ret['day'] = int(date_str[6:8])
    ret['hour'] = int(date_str[8:10])
    ret['min'] = int(date_str[10:12])

    # An absolute time which can always be subtracted from any other time to get minute difference
    ret['abs_time'] = ((ret['year']-2023)*525600) + (ret['month']*43800) + (ret['day']*1440) + (ret['hour'] *60) + ret['min']

    # Makes a human readable time accessible through returned dictionary
    human_time = ''
    if ret['hour'] == 0 : human_time = '12'
    elif ret['hour'] > 12 : human_time = str(ret['hour'] - 12)
    else : human_time = str(ret['hour'])
    human_time = human_time + ':' + str(ret['min'])
    if ret['hour'] > 12 : human_time = human_time + 'pm'
    else : human_time = human_time + 'am'
    ret['human_time'] = human_time

    # A string so a programmer can see all data clearly
    ret['debug'] = filename + ' -> ' + str(ret['month']) + '/' + str(ret['month']) + '/' +  str(ret['year']) + ' ' + human_time
    
    return ret

# Load Yolo (External files not included in Git since too big; available to download at these address)
# yolov3.weights - https://pjreddie.com/media/files/yolov3.weights
# yolov3.cfg - https://github.com/pjreddie/darknet/blob/master/cfg/yolov3.cfg

net = cv2.dnn.readNet("../../ml_data/yolov3.weights", "../../ml_data/yolov3.cfg")
layer_names = net.getLayerNames()
output_layers = [layer_names[i - 1] for i in net.getUnconnectedOutLayers().flatten()]

# List all files in the input directory
input_folder = './examples/coldwater_mi/'
output_folder = './examples/output/'
input_files = sorted([f for f in os.listdir(input_folder) if os.path.isfile(os.path.join(input_folder, f))])

# Define parking spot locations, different  for every lot
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

# Ranks spots best to worst, different for every lot, for finding best spots
best_spots = ['B6','B5','B4', 'A3','B3', 'B2', 'A2', 'B1', 'A1']

# Keeps track of how long spots occupied in real time
spots_min_occupied = {key: 0 for key in parking_spots} 

# Minimum intersection area to be considered as parked in the spot
min_intersection = 0.5

# Define the overparking limit in hours
overparking_limit = 360

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
for file_num, input_file in enumerate(input_files):
    # Computes time since last picture taken for overparking tracking
    abs_time = process_time(input_file)['abs_time']
    previous_abs_time = -1
    if file_num > 0: previous_abs_time = process_time(input_files[file_num - 1])['abs_time']
    if previous_abs_time != -1:
        abs_diff =  abs_time - previous_abs_time
    else:
        abs_diff = 0
    print(process_time(input_file)['debug'])
    print(str(file_num) + '. ' + str(previous_abs_time)  + ' - ' + str(abs_time) + ' = ' + str(abs_diff))
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
    time_dict = process_time(input_file)
    datetime_str = str(time_dict['month']) + '/' + str(time_dict['day']) + '/' +  str(time_dict['year']) + ' ' + time_dict['human_time'] 
    cv2.rectangle(frame, (width // 2 - 300, 0), (width // 2 + 400, 50+10), (255,255,255), -1)
    cv2.putText(frame, (datetime_str), (width // 2 - 300, 50), cv2.FONT_HERSHEY_SIMPLEX, 2, (0,0,0),3)
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

    # Write occupied and unoccupied spots
    num_spots = len(parking_spots)
    spots_per_column = 5
    space_between_rows = 50
    space_between_columns = 400
    text_color = (0,0,0)
    best_spot = best_spots[len(best_spots)-1]
    for i, spot in enumerate(parking_spots.keys()):
        spot_status = "Free"
        if spot in occupied_spots:
            spot_status = 'Occupied'
            spots_min_occupied[spot] += abs_diff
            spot_status += ' (' + str(spots_min_occupied[spot] // 60) + ':' + "{:02d}".format(spots_min_occupied[spot] % 60)+ ')'
            if spots_min_occupied[spot] > overparking_limit:
                text_color = (0, 0, 230)
        else:
            spots_min_occupied[spot] = 0
            if best_spots.index(best_spot) > best_spots.index(spot):
                best_spot = spot

        occupied_height = round(height * 0.8) + ((i % spots_per_column) * space_between_rows)
        occupied_width = 100 + ((i // spots_per_column) * space_between_columns)

        cv2.putText(frame, f'{spot} {spot_status}', (occupied_width, occupied_height), cv2.FONT_HERSHEY_SIMPLEX, 1.3, text_color, 3)
    cv2.putText(frame, ("Best spot: " +  best_spot), (width // 2 - 50, height - 20), cv2.FONT_HERSHEY_SIMPLEX, 1.3, (0, 100, 0), 3)
    print('Best spot: ' + best_spot)

    # Save the output image
    cv2.imwrite(output_folder + input_file, frame)



# Write lot data to file
with open(output_folder + 'lot_data.json', 'w') as f:
    json.dump(lot_data, f)
