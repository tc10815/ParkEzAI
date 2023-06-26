import cv2
import os
import json
import argparse

class ImageProcessor:
    def __init__(self, folder, parking_spots):
        self.images = sorted([img for img in os.listdir(folder) if img.endswith(".jpg")])
        self.folder = folder
        self.parking_spots = parking_spots
        self.load_labels()

    def load_labels(self):
        labels_filepath = os.path.join(self.folder, 'labels.json')
        if os.path.exists(labels_filepath):
            with open(labels_filepath, 'r') as f:
                self.labels = json.load(f)
        else:
            raise Exception('Labels file not found.')

    def process_images(self, output_folder):
        for img_file in self.images:
            img_path = os.path.join(self.folder, img_file)
            image = cv2.imread(img_path)
            img_labels = self.labels[img_file]
            
            for spot, is_occupied in img_labels.items():
                x, x_w, y, y_h = self.parking_spots[spot]
                cropped_image = image[y:y_h, x:x_w]
                status = 'occupied' if is_occupied else 'vacant'
                output_path = os.path.join(output_folder, spot, status)
                os.makedirs(output_path, exist_ok=True)
                output_filename = os.path.join(output_path, img_file)
                cv2.imwrite(output_filename, cropped_image)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Parking lot analyzer')
    parser.add_argument('folder', type=str, help='Folder containing the images')
    parser.add_argument('lot_configuration', type=str, help='JSON file containing parking lot configuration')
    parser.add_argument('output_folder', type=str, help='Folder to save the output')

    args = parser.parse_args()

    with open(args.lot_configuration, 'r') as f:
        parking_spots = json.load(f)

    processor = ImageProcessor(args.folder, parking_spots)
    processor.process_images(args.output_folder)
