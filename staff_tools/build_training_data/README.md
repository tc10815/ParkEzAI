# Label Training Data (label_training_data.py)

Brings up GUI for easy parking space labeling (opens folder of images, where each space is identified by coordinates in the .json file. Label results for each image/space saved in image folder in labels.json)

Usage is:

```
python label_training_data.py [folder with lot JPEGs] [JSON file identifying parking space boundaries]
```

To use with example data:
```
python label_training_data.py making_training_data_sample_input sample_lot_spots.json
```

Numbers 1-9 on keyboard label spots, in addition to checking box in GUI. Left and right arrows move next/previous image. z key labels current image with same label as previous image. 

# Convert to Training Data (convert_to_training_data.py)

convert_to_training_data.py creates labeled, cropped training/testing data images. The data which is created with this utility can be used directly with the Jupyter Notebook to create models which determine is a space is occupied or not.  

Usage is:

```
python convert_to_training_data.py [folder with images and label.json from previous step] [JSON file identifying parking space boundaries] [training data destination folder]
```

To use with example data:
```
python convert_to_training_data.py making_training_data_sample_input sample_lot_spots.json prepared_training_data
```

The example here only uses 5 photos for training data for demonstration purposes; note this is not enough build a real life model. 