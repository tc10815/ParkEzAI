# Model Maker (model_maker.ipynb)

This notebook builds models to tell if spots in a image are occupied or not.

This notebook is designed to work with training data in the format created by the 2 scripts in the "build_training_data" folder.

## 2 modifications must be made before making the models:

1. You must put the parking spaces you want build models for in this list. Note, the names of the spaces must be the same as the names in the labels.json file.
```
parking_spaces = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6']
```
2. You must specify the folder of training data (the same folder you set as output for the convert_to_training_data.py script)
```
base_data_dir = '~/ParkEzAI/core_scripts/output/'
```