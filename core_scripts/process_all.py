import cv2
import numpy as np
import os

# Load Yolo
net = cv2.dnn.readNet("../../ml_data/yolov3.weights", "../../ml_data/yolov3.cfg")
layer_names = net.getLayerNames()
output_layers = [layer_names[i - 1] for i in net.getUnconnectedOutLayers().flatten()]

# List all files in the input directory
input_folder = './examples/coldwater_mi/'
output_folder = './examples/output/'
input_files = [f for f in os.listdir(input_folder) if os.path.isfile(os.path.join(input_folder, f))]

# Define parking spots
parking_spots = {
    1: [372, 846, 698, 1075],
    2: [344, 619, 464, 710],
    3: [368, 487, 329, 461],
    4: [1686, 1919, 546, 1001],
    5: [1436, 1682, 526, 727],
    6: [1228, 1465, 411, 592],
    7: [1102, 1298, 380, 514],
    8: [970, 1171, 335, 468],
    9: [877, 1056, 325, 428],
}

# Calculate intersection of two rectangles
def calculate_intersection(x1, y1, w1, h1, x2, y2, w2, h2):
    x_overlap = max(0, min(x1 + w1, x2 + w2) - max(x1, x2))
    y_overlap = max(0, min(y1 + h1, y2 + h2) - max(y1, y2))
    return x_overlap * y_overlap

# Process each image
for input_file in input_files:
    # Load image
    frame = cv2.imread(input_folder + input_file)
    height, width, channels = frame.shape

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

    # Draw bounding boxes and labels on the image
    for i in range(len(boxes)):
        if i in indexes:
            x, y, w, h = boxes[i]
            label = str(class_ids[i])
            cv2.rectangle(frame, (x, y), (x + w, y + h), (0,255,0), 2)
            cv2.putText(frame, label, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0,255,0), 2)
            
            # Added pixel coordinates
            cv2.putText(frame, f'({x}, {y})', (x, y), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255,255,255), 2)
            cv2.putText(frame, f'({x+w}, {y})', (x+w, y), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255,255,255), 2)
            cv2.putText(frame, f'({x}, {y+h})', (x, y+h), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255,255,255), 2)
            cv2.putText(frame, f'({x+w}, {y+h})', (x+w, y+h), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255,255,255), 2)

            # Determine which parking spot the vehicle is in
            max_intersection = 0
            max_spot = None
            for spot, (x_spot, x_spot_w, y_spot, y_spot_h) in parking_spots.items():
                intersection = calculate_intersection(x, y, w, h, x_spot, y_spot, x_spot_w-x_spot, y_spot_h-y_spot)
                if intersection > max_intersection:
                    max_intersection = intersection
                    max_spot = spot

            if max_spot is not None:
                cv2.putText(frame, f'Spot: {max_spot}', (x, y - 20), cv2.FONT_HERSHEY_SIMPLEX, 0.8,  (230, 216, 173), 2)

    # Save the output image
    cv2.imwrite(output_folder + input_file, frame)
