# Takes a current screenshot of a YouTube Live video (see sample for results) 
#
# Note that for this Python to work you need 2 packages, and you need to manually edit both since they are out of date
#
# 1. pafy (pip install pafy)
#   Open the following script in a text editor:
#     .../lib/python3.9/site-packages/pafy/backend_youtube_dl.py
#   Comment out the code after likes and dislikes and set them to = 0
#     self._likes = 0 #self._ydl_info['like_count']
#     self._dislikes = 0 #self._ydl_info['dislike_count']
#
# 2. youtube-dl (pip install youtube-dl)
#   Open the following script in a text editor:
#     ...lib/python3.9/site-packages/youtube_dl/extractor/youtube.py
#   Replace this line:
#     'uploader_id': self._search_regex(r'/(?:channel|user)/([^/?&#]+)', owner_profile_url, 'uploader id') if owner_profile_url else None,
#   With this line: 
#     'uploader_id': self._search_regex(r'/(?:channel/|user/|(?=@))([^/?&#]+)', owner_profile_url, 'uploader id', default=None),


import cv2
import pafy

def capture_frame(video_url):
    # get video and construct stream URL
    video = pafy.new(video_url)
    best = video.getbest(preftype="mp4")
    video_stream_url = best.url

    # open video stream
    cap = cv2.VideoCapture(video_stream_url)

    ret, frame = cap.read()

    if ret:  # if frame read successfully
        # save frame to image file
        cv2.imwrite('frame.jpg', frame)

        # print message
    else:
        print("Error reading frame from video stream")

    cap.release()
    cv2.destroyAllWindows()

# Change URL to *live* YouTube video of which you want a screenshot
capture_frame('https://www.youtube.com/watch?v=mwN6l3O1MNI')
