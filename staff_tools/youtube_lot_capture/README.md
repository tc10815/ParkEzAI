# YouTube CaptureJP

### This Script grabs images of YouTube videos at time internals.

In this project, it is intended to be used to convert streaming parking lot footage into still JPEGs which are used with ParkEzAi software to monitor parking lots.

ParkEzAi's API accepts a series of JPEGs with their lot id and timestamp encoded into their file name: Similar conversions will have to be done with any type of webcam footage before ParkEzAi can monitor the parking lot. However, as long as this conversion is possible any parking lot can be converted to work with ParkEzAi

1. Follow instructions in file to configure necessary Python libraries
2. Replace the URL in this line to the YouTube URL you want: capture_frame('https://www.youtube.com/watch?v=mwN6l3O1MNI')
3. Replace 30 in this line with the number of minutes between each shot you want uploaded: time.sleep(30 * 60)
