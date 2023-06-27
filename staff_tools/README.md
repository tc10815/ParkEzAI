Example Utility Commands:

Brings up GUI for easy parking space labeling (opens folder of images, where each space is identified by coordinates in the .json file. Label results for each image/space saved in image folder in different .json file)

python make_training_data.py examples/input_to_test_minus_farmersmarket/ coldwater_parking_lot.json

Note: numbers 1-9 on keyboard label spots, in addition to checking box in GUI. Left and right arrows move next/previous image. z key labels current image with same label as previous image. 


Actually creates labeled, cropped training data images, image input folder, .json that defines spaces, output folder for training images

python convert_data.py examples/input_to_test_minus_farmersmarket/ coldwater_parking_lot.json output2/

Used together large amounts of training data can be created quickly for parking lots.